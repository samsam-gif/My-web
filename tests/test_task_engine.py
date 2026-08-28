"""
Automated unit tests for Task Engine DAG and state transitions.
"""
import unittest
import os
from backend.database.db import DatabaseManager
from backend.core.task_engine import TaskEngine

class TestTaskEngine(unittest.TestCase):
    def setUp(self):
        self.test_db = "test_engine.db"
        if os.path.exists(self.test_db):
            os.remove(self.test_db)
        self.db = DatabaseManager(self.test_db)
        self.engine = TaskEngine(self.db)

    def tearDown(self):
        if os.path.exists(self.test_db):
            os.remove(self.test_db)

    def test_dependency_resolution(self):
        task1 = {
            "id": "t1",
            "project_id": "p1",
            "title": "Design",
            "assigned_agent": "design",
            "state": "PENDING",
            "dependencies": [],
            "risk_level": "LOW"
        }
        task2 = {
            "id": "t2",
            "project_id": "p1",
            "title": "Development",
            "assigned_agent": "developer",
            "state": "PENDING",
            "dependencies": ["t1"],
            "risk_level": "MEDIUM"
        }
        self.db.save_task(task1)
        self.db.save_task(task2)

        # Before t1 completes, only t1 can run
        ready = self.engine.get_ready_tasks("p1")
        self.assertEqual(len(ready), 1)
        self.assertEqual(ready[0]["id"], "t1")

        # Complete t1
        self.engine.update_task_state("t1", "COMPLETED")

        # Now t2 should be ready to run
        ready = self.engine.get_ready_tasks("p1")
        self.assertEqual(len(ready), 1)
        self.assertEqual(ready[0]["id"], "t2")

    def test_retry_limits(self):
        task = {
            "id": "t_fail",
            "project_id": "p1",
            "title": "Flaky Task",
            "assigned_agent": "qa",
            "state": "FAILED",
            "dependencies": [],
            "risk_level": "LOW",
            "retry_count": 0,
            "max_retries": 3
        }
        self.db.save_task(task)

        # Retries 1, 2, 3 should succeed
        self.assertTrue(self.engine.retry_task("t_fail"))
        self.engine.update_task_state("t_fail", "FAILED")
        self.assertTrue(self.engine.retry_task("t_fail"))
        self.engine.update_task_state("t_fail", "FAILED")
        self.assertTrue(self.engine.retry_task("t_fail"))
        self.engine.update_task_state("t_fail", "FAILED")

        # 4th retry should be blocked
        self.assertFalse(self.engine.retry_task("t_fail"))

if __name__ == "__main__":
    unittest.main()
