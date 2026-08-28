"""
Permission Engine and Security Sandbox Validator.
Enforces workspace isolation, command safety, risk levels, and approval gating.
"""
import os
import re
from typing import Dict, Any, Tuple

class PermissionEngine:
    FORBIDDEN_COMMAND_PATTERNS = [
        r"rm\s+-rf\s+/",
        r"mkfs",
        r"dd\s+if=/dev",
        r":\(\)\s*\{",
        r"chmod\s+-R\s+777\s+/",
        r"shutdown",
        r"reboot",
        r">\s*/dev/sda",
        r"curl.*\|\s*bash",
        r"wget.*\|\s*sh"
    ]

    def __init__(self, projects_root: str = "./projects"):
        self.projects_root = os.path.abspath(projects_root)

    def classify_risk(self, action_type: str, details: Dict[str, Any]) -> str:
        """
        Classifies an action as LOW, MEDIUM, or HIGH risk.
        """
        if action_type in ["READ_FILE", "ANALYZE_SPEC", "RUN_UNIT_TEST", "GENERATE_DOCS"]:
            return "LOW"
        elif action_type in ["INSTALL_DEPENDENCY", "CREATE_FILE", "UPDATE_CODE", "LOCAL_BUILD"]:
            return "MEDIUM"
        elif action_type in ["DEPLOYMENT", "PRODUCTION_RELEASE", "DELETE_WORKSPACE", "EXECUTE_SYSTEM_CMD", "FINANCIAL_TX"]:
            return "HIGH"
        return "MEDIUM"

    def validate_command(self, command: str) -> Tuple[bool, str]:
        """
        Validates whether a shell command is safe to run.
        """
        if not command or not command.strip():
            return False, "Empty command"

        for pattern in self.FORBIDDEN_COMMAND_PATTERNS:
            if re.search(pattern, command, re.IGNORECASE):
                return False, f"Dangerous command pattern detected: {pattern}"

        return True, "Command safe"

    def validate_workspace_path(self, project_id: str, target_path: str) -> Tuple[bool, str]:
        """
        Ensures an agent cannot read/write outside `projects/{project_id}/workspace/`.
        """
        project_ws = os.path.abspath(os.path.join(self.projects_root, project_id, "workspace"))
        target_abs = os.path.abspath(target_path)

        # Check if target_abs is inside project_ws
        if not target_abs.startswith(project_ws):
            return False, f"Access denied: Path '{target_path}' is outside isolated project workspace '{project_ws}'"

        return True, "Path authorized"
