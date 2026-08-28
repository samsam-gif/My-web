"""
Database persistence engine for AI Company Command Center.
Uses SQLite for robust, self-contained local storage and ACID compliance.
"""
import sqlite3
import json
import os
from typing import List, Optional, Dict, Any

class DatabaseManager:
    def __init__(self, db_path: str = "ai_company.db"):
        self.db_path = db_path
        self._init_db()

    def get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            
            # Projects Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS projects (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    description TEXT,
                    status TEXT NOT NULL,
                    progress INTEGER DEFAULT 0,
                    owner_command TEXT,
                    workspace_path TEXT,
                    task_ids TEXT,
                    files TEXT,
                    created_at TEXT,
                    updated_at TEXT
                )
            """)

            # Tasks Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    project_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT,
                    assigned_agent TEXT NOT NULL,
                    state TEXT NOT NULL,
                    progress INTEGER DEFAULT 0,
                    risk_level TEXT NOT NULL,
                    dependencies TEXT,
                    retry_count INTEGER DEFAULT 0,
                    max_retries INTEGER DEFAULT 3,
                    output_summary TEXT,
                    artifacts TEXT,
                    error TEXT,
                    created_at TEXT,
                    updated_at TEXT,
                    completed_at TEXT
                )
            """)

            # Approvals Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS approvals (
                    id TEXT PRIMARY KEY,
                    project_id TEXT NOT NULL,
                    task_id TEXT NOT NULL,
                    agent_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT,
                    action_type TEXT NOT NULL,
                    risk_level TEXT NOT NULL,
                    status TEXT NOT NULL,
                    payload TEXT,
                    requested_at TEXT,
                    resolved_at TEXT,
                    resolved_by TEXT,
                    rejection_reason TEXT
                )
            """)

            # Audit Logs Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id TEXT PRIMARY KEY,
                    timestamp TEXT NOT NULL,
                    level TEXT NOT NULL,
                    agent_id TEXT,
                    project_id TEXT,
                    task_id TEXT,
                    message TEXT NOT NULL,
                    details TEXT
                )
            """)

            # Agent Status Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS agent_states (
                    agent_id TEXT PRIMARY KEY,
                    status TEXT NOT NULL,
                    current_task_id TEXT,
                    progress INTEGER DEFAULT 0,
                    last_action TEXT,
                    last_active TEXT,
                    tasks_completed INTEGER DEFAULT 0,
                    tasks_failed INTEGER DEFAULT 0
                )
            """)

            conn.commit()

    # Project Operations
    def save_project(self, project_data: Dict[str, Any]):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO projects (
                    id, name, description, status, progress, owner_command, workspace_path, task_ids, files, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                project_data["id"],
                project_data["name"],
                project_data.get("description", ""),
                project_data.get("status", "PLANNING"),
                project_data.get("progress", 0),
                project_data.get("owner_command", ""),
                project_data.get("workspace_path", f"./projects/{project_data['id']}/workspace"),
                json.dumps(project_data.get("task_ids", [])),
                json.dumps(project_data.get("files", [])),
                project_data.get("created_at", ""),
                project_data.get("updated_at", "")
            ))
            conn.commit()

    def get_project(self, project_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM projects WHERE id = ?", (project_id,))
            row = cursor.fetchone()
            if not row:
                return None
            data = dict(row)
            data["task_ids"] = json.loads(data["task_ids"] or "[]")
            data["files"] = json.loads(data["files"] or "[]")
            return data

    def list_projects(self) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM projects ORDER BY created_at DESC")
            rows = cursor.fetchall()
            results = []
            for row in rows:
                data = dict(row)
                data["task_ids"] = json.loads(data["task_ids"] or "[]")
                data["files"] = json.loads(data["files"] or "[]")
                results.append(data)
            return results

    # Task Operations
    def save_task(self, task_data: Dict[str, Any]):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO tasks (
                    id, project_id, title, description, assigned_agent, state, progress, risk_level, dependencies,
                    retry_count, max_retries, output_summary, artifacts, error, created_at, updated_at, completed_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                task_data["id"],
                task_data["project_id"],
                task_data["title"],
                task_data.get("description", ""),
                task_data["assigned_agent"],
                task_data.get("state", "PENDING"),
                task_data.get("progress", 0),
                task_data.get("risk_level", "LOW"),
                json.dumps(task_data.get("dependencies", [])),
                task_data.get("retry_count", 0),
                task_data.get("max_retries", 3),
                task_data.get("output_summary", ""),
                json.dumps(task_data.get("artifacts", [])),
                task_data.get("error", None),
                task_data.get("created_at", ""),
                task_data.get("updated_at", ""),
                task_data.get("completed_at", None)
            ))
            conn.commit()

    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
            row = cursor.fetchone()
            if not row:
                return None
            data = dict(row)
            data["dependencies"] = json.loads(data["dependencies"] or "[]")
            data["artifacts"] = json.loads(data["artifacts"] or "[]")
            return data

    def list_tasks(self, project_id: Optional[str] = None) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            if project_id:
                cursor.execute("SELECT * FROM tasks WHERE project_id = ? ORDER BY created_at ASC", (project_id,))
            else:
                cursor.execute("SELECT * FROM tasks ORDER BY created_at ASC")
            rows = cursor.fetchall()
            results = []
            for row in rows:
                data = dict(row)
                data["dependencies"] = json.loads(data["dependencies"] or "[]")
                data["artifacts"] = json.loads(data["artifacts"] or "[]")
                results.append(data)
            return results

    # Approvals Operations
    def save_approval(self, app_data: Dict[str, Any]):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO approvals (
                    id, project_id, task_id, agent_id, title, description, action_type, risk_level, status,
                    payload, requested_at, resolved_at, resolved_by, rejection_reason
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                app_data["id"],
                app_data["project_id"],
                app_data["task_id"],
                app_data["agent_id"],
                app_data["title"],
                app_data.get("description", ""),
                app_data["action_type"],
                app_data.get("risk_level", "HIGH"),
                app_data.get("status", "PENDING"),
                json.dumps(app_data.get("payload", {})),
                app_data.get("requested_at", ""),
                app_data.get("resolved_at", None),
                app_data.get("resolved_by", None),
                app_data.get("rejection_reason", None)
            ))
            conn.commit()

    def list_approvals(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            if status:
                cursor.execute("SELECT * FROM approvals WHERE status = ? ORDER BY requested_at DESC", (status,))
            else:
                cursor.execute("SELECT * FROM approvals ORDER BY requested_at DESC")
            rows = cursor.fetchall()
            results = []
            for row in rows:
                data = dict(row)
                data["payload"] = json.loads(data["payload"] or "{}")
                results.append(data)
            return results

    # Audit Logs
    def add_audit_log(self, log_data: Dict[str, Any]):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO audit_logs (
                    id, timestamp, level, agent_id, project_id, task_id, message, details
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                log_data["id"],
                log_data["timestamp"],
                log_data.get("level", "INFO"),
                log_data.get("agent_id", None),
                log_data.get("project_id", None),
                log_data.get("task_id", None),
                log_data["message"],
                json.dumps(log_data.get("details", {}))
            ))
            conn.commit()

    def list_logs(self, limit: int = 100) -> List[Dict[str, Any]]:
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?", (limit,))
            rows = cursor.fetchall()
            results = []
            for row in rows:
                data = dict(row)
                data["details"] = json.loads(data["details"] or "{}")
                results.append(data)
            return results
