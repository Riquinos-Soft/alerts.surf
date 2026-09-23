"""Exercise deployment failure ordering without Docker or production credentials."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / "deploy.sh"
SHA = "a" * 40


class DeploymentTests(unittest.TestCase):
    def run_case(self, failure="", existing=True):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            release = root / "releases" / SHA
            release.mkdir(parents=True)
            (release / "compose.production.yaml").touch()
            (root / ".env").write_text("test configuration")
            previous = root / "releases" / ("b" * 40)
            previous.mkdir()
            if existing:
                (root / "current").symlink_to(previous)
            binary = root / "bin"
            binary.mkdir()
            docker = binary / "docker"
            docker.write_text(
                '#!/bin/sh\n'
                'echo "$*" >> "$DEPLOY_ROOT/calls"\n'
                'if [ -n "$FAIL_MATCH" ]; then\n'
                '  case "$*" in *"$FAIL_MATCH"*) exit 1;; esac\n'
                'fi\n'
                'case "$*" in *pg_dump*) echo "database backup";; esac\n'
            )
            docker.chmod(0o755)
            result = subprocess.run(
                ["bash", str(SCRIPT), SHA], capture_output=True, text=True,
                env={**os.environ, "PATH": f"{binary}:{os.environ['PATH']}",
                     "DEPLOY_ROOT": str(root), "FAIL_MATCH": failure},
            )
            calls = (root / "calls").read_text()
            current = (root / "current").resolve()
            backups = list((root / "backups").glob("*.sql"))
            return result, calls, current == release, len(backups)

    def test_success_backs_up_before_migration_and_marks_release(self):
        result, calls, current, backups = self.run_case()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(current)
        self.assertEqual(backups, 1)
        self.assertLess(calls.index("pg_dump"), calls.index("alembic upgrade head"))

    def test_first_install_has_no_previous_database_backup(self):
        result, _, current, backups = self.run_case(existing=False)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(current)
        self.assertEqual(backups, 0)

    def test_failures_preserve_previous_release(self):
        for failure in ("build --pull", "pg_dump", "alembic upgrade head", "up -d --wait --wait-timeout 180", "wget"):
            with self.subTest(failure=failure):
                result, calls, current, _ = self.run_case(failure)
                self.assertNotEqual(result.returncode, 0)
                self.assertFalse(current)
                if failure in ("build --pull", "pg_dump"):
                    self.assertNotIn("alembic upgrade head", calls)

    def test_invalid_revision_is_rejected(self):
        result = subprocess.run(["bash", str(SCRIPT), "../bad"], capture_output=True)
        self.assertNotEqual(result.returncode, 0)
