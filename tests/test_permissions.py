"""
Automated unit tests for Permissions & Sandbox Security.
"""
import unittest
import os
from backend.permissions.permission_engine import PermissionEngine

class TestPermissions(unittest.TestCase):
    def setUp(self):
        self.engine = PermissionEngine("./projects")

    def test_risk_classification(self):
        self.assertEqual(self.engine.classify_risk("READ_FILE", {}), "LOW")
        self.assertEqual(self.engine.classify_risk("INSTALL_DEPENDENCY", {}), "MEDIUM")
        self.assertEqual(self.engine.classify_risk("DEPLOYMENT", {}), "HIGH")
        self.assertEqual(self.engine.classify_risk("DELETE_WORKSPACE", {}), "HIGH")

    def test_command_safety_checks(self):
        # Safe commands
        safe1, msg1 = self.engine.validate_command("npm run build")
        self.assertTrue(safe1)

        safe2, msg2 = self.engine.validate_command("python3 -m unittest discover")
        self.assertTrue(safe2)

        # Dangerous commands
        danger1, dmsg1 = self.engine.validate_command("rm -rf /")
        self.assertFalse(danger1)

        danger2, dmsg2 = self.engine.validate_command(":(){ :|:& };:")
        self.assertFalse(danger2)

        danger3, dmsg3 = self.engine.validate_command("mkfs.ext4 /dev/sda1")
        self.assertFalse(danger3)

    def test_workspace_isolation(self):
        project_id = "proj_test_123"
        valid_path = f"./projects/{project_id}/workspace/src/index.html"
        invalid_path = "/etc/passwd"
        invalid_relative = f"./projects/other_project/workspace/secret.key"

        is_valid, msg = self.engine.validate_workspace_path(project_id, valid_path)
        self.assertTrue(is_valid)

        is_invalid, msg = self.engine.validate_workspace_path(project_id, invalid_path)
        self.assertFalse(is_invalid)

        is_invalid_rel, msg = self.engine.validate_workspace_path(project_id, invalid_relative)
        self.assertFalse(is_invalid_rel)

if __name__ == "__main__":
    unittest.main()
