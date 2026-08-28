"""
Automated unit tests for SQLite database layer and persistence.
"""
import unittest
import os
import shutil
from backend.database.db import DatabaseManager

class TestDatabase(unittest.TestCase):
    def setUp(self):
        self.test_db = "test_ai_company.db"
        if os.path.exists(self.test_db):
            os.remove(self.test_db)
        self.db = DatabaseManager(self.test_db)

    def tearDown(self):
        if os.path.exists(self.test_db):
            os.remove(self.test_db)

    def test_save_and_get_project(self):
        proj = {
            "id": "proj_test_1",
            "name": "Test Repair Shop",
            "description": "Test description",
            "status": "PLANNING",
            "progress": 0,
            "owner_command": "Build a test app",
            "workspace_path": "./projects/proj_test_1/workspace",
            "task_ids": ["t1", "t2"],
            "files": [],
            "created_at": "2026-08-28T00:00:00Z",
            "updated_at": "2026-08-28T00:00:00Z"
        }
        self.db.save_project(proj)
        loaded = self.db.get_project("proj_test_1")
        self.assertIsNotNone(loaded)
        self.assertEqual(loaded["name"], "Test Repair Shop")
        self.assertEqual(loaded["task_ids"], ["t1", "t2"])

    def test_save_and_list_tasks(self):
        task = {
            "id": "task_1",
            "project_id": "proj_test_1",
            "title": "Design Mockup",
            "description": "Create UI",
            "assigned_agent": "design",
            "state": "QUEUED",
            "progress": 0,
            "risk_level": "LOW",
            "dependencies": [],
            "retry_count": 0,
            "max_retries": 3,
            "output_summary": "",
            "artifacts": ["spec.md"],
            "created_at": "2026-08-28T00:00:00Z",
            "updated_at": "2026-08-28T00:00:00Z"
        }
        self.db.save_task(task)
        tasks = self.db.list_tasks("proj_test_1")
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0]["assigned_agent"], "design")

    def test_approvals_flow(self):
        approval = {
            "id": "appr_1",
            "project_id": "proj_test_1",
            "task_id": "task_deploy",
            "agent_id": "deployment",
            "title": "Production Release",
            "description": "Release v1.0",
            "action_type": "DEPLOYMENT",
            "risk_level": "HIGH",
            "status": "PENDING",
            "payload": {"version": "1.0.0"},
            "requested_at": "2026-08-28T00:00:00Z"
        }
        self.db.save_approval(approval)
        pending = self.db.list_approvals("PENDING")
        self.assertEqual(len(pending), 1)
        self.assertEqual(pending[0]["id"], "appr_1")

if __name__ == "__main__":
    unittest.main()
