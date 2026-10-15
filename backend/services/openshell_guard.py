# backend/services/openshell_guard.py
"""OpenShell supervisor and NemoClaw declarative security policy guard."""

import sys
import re
import shlex
import time
import subprocess
import yaml
import logging
from pathlib import Path
from typing import Tuple, Dict, Any, List

# Ensure repository root is on sys.path
_repo_root = Path(__file__).resolve().parent.parent.parent
if str(_repo_root) not in sys.path:
    sys.path.insert(0, str(_repo_root))

from config.constants import NEMOCLAW_POLICY_PATH, OPENSHELL_CMD_TIMEOUT_SECONDS, ROOT_DIR
from backend.services.database import get_db_connection

logger = logging.getLogger("hermesshield.openshell")

def load_policy() -> Dict[str, Any]:
    """Load and parse config/nemoclaw-policy.yaml."""
    if not NEMOCLAW_POLICY_PATH.exists():
        logger.warning("Policy file not found at %s. Using default strict policy.", NEMOCLAW_POLICY_PATH)
        return {
            "policy_version": "1.0.0",
            "filesystem": {
                "allowed_read_roots": ["data/workspace", "data/skills", "data/briefings", "data/MEMORY.md"],
                "allowed_write_roots": ["data/workspace", "data/briefings", "data/skills"],
                "denied_path_patterns": ["^.*\\.env.*$", "^.*id_rsa.*$", "^.*\\.ssh.*$", "^.*credentials.*$", "^.*\\.git/.*$"]
            },
            "process": {
                "allowed_binaries": ["cat", "ls", "grep", "python", "pytest", "echo"],
                "denied_binaries": ["curl", "wget", "nc", "bash", "sh", "rm", "dd"],
                "execution_timeout_seconds": 5.0
            },
            "network": {
                "outbound_http_permitted": False,
                "allowed_destinations": []
            }
        }
    with open(NEMOCLAW_POLICY_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)

def log_security_event(command: str, status: str, policy_rule: str, reason: str) -> None:
    """Synchronously record security evaluation to SQLite security_events table."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO security_events (command, status, policy_rule, reason)
            VALUES (?, ?, ?, ?)
            """,
            (command, status, policy_rule, reason)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error("Failed to log security event: %s", str(e))

def validate_command(command_str: str) -> Tuple[bool, str, str]:
    """
    Validate proposed shell command against NemoClaw policy out-of-process.
    Returns: (is_allowed, policy_rule, reason)
    """
    if not command_str or not command_str.strip():
        return False, "EMPTY_COMMAND", "Command cannot be empty"

    policy = load_policy()

    # 1. Inspect whole command and arguments against denied secret patterns
    # Standardized rule: NEMOCLAW_POLICY_EXFIL
    for pattern in policy["filesystem"].get("denied_path_patterns", []):
        if re.search(pattern, command_str):
            reason = f"Command targets denied secret pattern '{pattern}'"
            return False, "NEMOCLAW_POLICY_EXFIL", reason

    # 2. Check for unauthorized shell chaining, piping, or command substitution
    shell_chaining_operators = ["&&", "||", ";", "|", ">", "<", "$(", "`"]
    has_chaining = any(op in command_str for op in shell_chaining_operators)

    # 3. Tokenize command safely
    try:
        tokens = shlex.split(command_str)
    except Exception as e:
        return False, "NEMOCLAW_PARSE_ERROR", f"Failed to parse command syntax: {str(e)}"

    if not tokens:
        return False, "EMPTY_COMMAND", "Command cannot be empty"

    # 4. Inspect every individual token against denied binaries and network tools
    denied_binaries = policy["process"].get("denied_binaries", [])
    for token in tokens:
        clean_token = Path(token).name.lower()
        if clean_token in denied_binaries:
            if clean_token in ["curl", "wget", "nc"]:
                return False, "NEMOCLAW_RULE_NETWORK", f"Outbound network tool '{clean_token}' is blocked by policy"
            return False, "NEMOCLAW_RULE_BINARY", f"Binary '{clean_token}' is explicitly denied by policy"

    # If chaining was detected, reject chaining explicitly
    if has_chaining:
        return False, "NEMOCLAW_POLICY_CHAINING", "Shell chaining, piping, and redirection operators are forbidden"

    # 5. Verify primary executable binary is strictly in allowed_binaries
    primary_binary = Path(tokens[0]).name.lower()
    allowed_binaries = policy["process"].get("allowed_binaries", [])
    if primary_binary not in allowed_binaries:
        return False, "NEMOCLAW_RULE_BINARY", f"Binary '{primary_binary}' is not permitted in allowed_binaries"

    return True, "ALLOWED", "Command satisfies NemoClaw policy"

def execute_sandboxed_command(command_str: str) -> Dict[str, Any]:
    """
    Execute a sandboxed command out-of-process with strict timeout and validation.
    """
    start_time = time.perf_counter()
    is_allowed, rule, reason = validate_command(command_str)
    eval_latency_ms = (time.perf_counter() - start_time) * 1000

    log_security_event(command_str, "ALLOWED" if is_allowed else "BLOCKED", rule, reason)

    if not is_allowed:
        return {
            "success": False,
            "status": "BLOCKED",
            "violated_rule": rule,
            "reason": reason,
            "stdout": "",
            "stderr": reason,
            "latency_ms": eval_latency_ms
        }

    tokens = shlex.split(command_str)
    try:
        proc = subprocess.run(
            tokens,
            cwd=str(ROOT_DIR),
            capture_output=True,
            text=True,
            timeout=OPENSHELL_CMD_TIMEOUT_SECONDS
        )
        total_latency_ms = (time.perf_counter() - start_time) * 1000
        return {
            "success": proc.returncode == 0,
            "status": "ALLOWED",
            "violated_rule": "",
            "reason": "Execution completed",
            "stdout": proc.stdout,
            "stderr": proc.stderr,
            "latency_ms": total_latency_ms
        }
    except subprocess.TimeoutExpired:
        log_security_event(command_str, "BLOCKED", "OPENSHELL_TIMEOUT", "Execution exceeded maximum timeout")
        return {
            "success": False,
            "status": "BLOCKED",
            "violated_rule": "OPENSHELL_TIMEOUT",
            "reason": f"Execution timed out after {OPENSHELL_CMD_TIMEOUT_SECONDS}s",
            "stdout": "",
            "stderr": "Command terminated: timeout exceeded",
            "latency_ms": OPENSHELL_CMD_TIMEOUT_SECONDS * 1000
        }
    except Exception as e:
        return {
            "success": False,
            "status": "ERROR",
            "violated_rule": "EXECUTION_EXCEPTION",
            "reason": str(e),
            "stdout": "",
            "stderr": str(e),
            "latency_ms": (time.perf_counter() - start_time) * 1000
        }
