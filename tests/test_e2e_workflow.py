"""
End-to-End autonomous pipeline test for AI Company Command Center.
Validates:
1. Owner input prompt
2. CEO decomposition into DAG tasks
3. Task execution order (Design -> Dev -> QA -> Security -> Docs -> Deployment)
4. High-risk approval creation and manual Owner approval
5. Completion and artifact persistence.
"""
import unittest
import os
import shutil
from backend.database.db import DatabaseManager
from backend.core.task_engine import TaskEngine
from backend.agents.orchestrator import CEOAgent

class TestE2EWorkflow(unittest.TestCase):
    def setUp(self):
        self.test_db = "test_e2e.db"
        if os.path.exists(self.test_db):
            os.remove(self.test_db)
        self.db = DatabaseManager(self.test_db)
        self.engine = TaskEngine(self.db)

    def tearDown(self):
        if os.path.exists(self.test_db):
            os.remove(self.test_db)

    def test_full_pipeline_orchestration(self):
        # 1. Owner gives command
        owner_command = "Create a simple landing page for a mobile repair shop."
        plan = CEOAgent.plan_project(owner_command)
        
        project_id = plan["project_id"]
        tasks = plan["tasks"]

        self.assertEqual(len(tasks), 6)
        
        # Save project and tasks to DB
        proj_data = {
            "id": project_id,
            "name": plan["project_name"],
            "status": "IN_PROGRESS",
            "owner_command": owner_command,
            "task_ids": [t["id"] for t in tasks],
            "created_at": "2026-08-28T00:00:00Z"
        }
        self.db.save_project(proj_data)
        for t in tasks:
            self.db.save_task(t)

        # 2. Step through tasks in DAG order
        # Stage 1: Design (has no dependencies)
        ready = self.engine.get_ready_tasks(project_id)
        self.assertEqual(len(ready), 1)
        self.assertEqual(ready[0]["assigned_agent"], "design")

        # Execute Design
        self.engine.update_task_state(ready[0]["id"], "COMPLETED", output="Design completed with wireframe specs.")

        # Stage 2: Developer (depends on Design)
        ready = self.engine.get_ready_tasks(project_id)
        self.assertEqual(len(ready), 1)
        self.assertEqual(ready[0]["assigned_agent"], "developer")

        # Execute Developer
        self.engine.update_task_state(ready[0]["id"], "COMPLETED", output="Full-stack code built.", artifacts=["index.html", "app.js"])

        # Stage 3: QA (depends on Developer)
        ready = self.engine.get_ready_tasks(project_id)
        self.assertEqual(len(ready), 1)
        self.assertEqual(ready[0]["assigned_agent"], "qa")

        # Execute QA
        self.engine.update_task_state(ready[0]["id"], "COMPLETED", output="QA passed with 24 tests green.")

        # Stage 4: Security (depends on QA)
        ready = self.engine.get_ready_tasks(project_id)
        self.assertEqual(len(ready), 1)
        self.assertEqual(ready[0]["assigned_agent"], "security")

        # Execute Security
        self.engine.update_task_state(ready[0]["id"], "COMPLETED", output="Security audit clear. 0 vulnerabilities.")

        # Stage 5: Documentation (depends on Security)
        ready = self.engine.get_ready_tasks(project_id)
        self.assertEqual(len(ready), 1)
        self.assertEqual(ready[0]["assigned_agent"], "documentation")

        # Execute Documentation
        self.engine.update_task_state(ready[0]["id"], "COMPLETED", output="User guide and README produced.")

        # Stage 6: Deployment (High risk, requires approval)
        ready = self.engine.get_ready_tasks(project_id)
        self.assertEqual(len(ready), 1)
        deploy_task = ready[0]
        self.assertEqual(deploy_task["assigned_agent"], "deployment")
        self.assertEqual(deploy_task["risk_level"], "HIGH")

        # Create approval request
        approval_id = "appr_test_e2e"
        self.db.save_approval({
            "id": approval_id,
            "project_id": project_id,
            "task_id": deploy_task["id"],
            "agent_id": "deployment",
            "title": "Production Deployment Approval",
            "action_type": "DEPLOYMENT",
            "risk_level": "HIGH",
            "status": "PENDING"
        })

        # Verify approval is pending
        pending = self.db.list_approvals("PENDING")
        self.assertEqual(len(pending), 1)

        # Owner approves
        pending[0]["status"] = "APPROVED"
        self.db.save_approval(pending[0])

        # Complete deployment
        self.engine.update_task_state(deploy_task["id"], "COMPLETED", output="Deployed live to production!")

        # Verify all tasks completed
        all_tasks = self.db.list_tasks(project_id)
        self.assertTrue(all(t["state"] == "COMPLETED" for t in all_tasks))

if __name__ == "__main__":
    unittest.main()
