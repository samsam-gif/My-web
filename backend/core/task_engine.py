"""
Task Engine and Dependency Resolver for AI Company Command Center.
Handles DAG resolution, state transitions, retries, and task execution pipelines.
"""
from typing import List, Dict, Any, Optional
from datetime import datetime

class TaskEngine:
    def __init__(self, db_manager):
        self.db = db_manager

    def can_task_run(self, task: Dict[str, Any], all_tasks: List[Dict[str, Any]]) -> bool:
        """
        A task can run if:
        1. Its state is PENDING or QUEUED
        2. All tasks listed in task['dependencies'] have state == 'COMPLETED'
        """
        if task.get("state") not in ["PENDING", "QUEUED"]:
            return False
        
        dependencies = task.get("dependencies", [])
        if not dependencies:
            return True
        
        task_map = {t["id"]: t for t in all_tasks}
        for dep_id in dependencies:
            dep_task = task_map.get(dep_id)
            if not dep_task or dep_task.get("state") != "COMPLETED":
                return False
        
        return True

    def get_ready_tasks(self, project_id: Optional[str] = None) -> List[Dict[str, Any]]:
        all_tasks = self.db.list_tasks(project_id)
        ready_tasks = []
        for task in all_tasks:
            if self.can_task_run(task, all_tasks):
                ready_tasks.append(task)
        return ready_tasks

    def update_task_state(self, task_id: str, new_state: str, output: Optional[str] = None, error: Optional[str] = None, artifacts: Optional[List[str]] = None) -> Optional[Dict[str, Any]]:
        task = self.db.get_task(task_id)
        if not task:
            return None

        now = datetime.utcnow().isoformat()
        task["state"] = new_state
        task["updated_at"] = now
        
        if new_state == "FAILED":
            task["retry_count"] = task.get("retry_count", 0) + 1
        if output is not None:
            task["output_summary"] = output
        if error is not None:
            task["error"] = error
        if artifacts is not None:
            task["artifacts"] = list(set(task.get("artifacts", []) + artifacts))
        
        if new_state == "COMPLETED":
            task["completed_at"] = now
            task["progress"] = 100
        elif new_state == "RUNNING":
            task["progress"] = max(task.get("progress", 0), 20)

        self.db.save_task(task)
        return task

    def retry_task(self, task_id: str) -> bool:
        task = self.db.get_task(task_id)
        if not task:
            return False
        
        if task.get("retry_count", 0) >= task.get("max_retries", 3):
            # Max retries reached
            return False
        
        task["state"] = "QUEUED"
        task["error"] = None
        task["progress"] = 0
        task["updated_at"] = datetime.utcnow().isoformat()
        self.db.save_task(task)
        return True
