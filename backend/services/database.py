# backend/services/database.py
"""SQLite connection and table initialization for HermesShield."""

import sys
import sqlite3
import logging
from pathlib import Path

# Ensure repository root is on sys.path
_repo_root = Path(__file__).resolve().parent.parent.parent
if str(_repo_root) not in sys.path:
    sys.path.insert(0, str(_repo_root))

from config.constants import SQLITE_DB_PATH

logger = logging.getLogger("hermesshield.database")

def get_db_connection() -> sqlite3.Connection:
    """Return a configured SQLite database connection with row factory."""
    SQLITE_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(SQLITE_DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn

def init_db() -> None:
    """Initialize all 4 relational tables specified in Schema.md §4."""
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # 1. Persistent Memories Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS memories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT UNIQUE NOT NULL,
                category TEXT NOT NULL,
                content TEXT NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 2. Tavily Cache Table (24-hour TTL)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS tavily_cache (
                query_hash TEXT PRIMARY KEY,
                sanitized_query TEXT NOT NULL,
                search_response_json TEXT NOT NULL,
                extracted_markdown TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 3. Security Audit Events Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS security_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                command TEXT NOT NULL,
                status TEXT NOT NULL,
                policy_rule TEXT NOT NULL,
                reason TEXT NOT NULL
            );
        """)

        # 4. FinOps Telemetry Logs Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS telemetry_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task_id TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                tier_1_input_tokens INTEGER DEFAULT 0,
                tier_1_output_tokens INTEGER DEFAULT 0,
                tier_2_input_tokens INTEGER DEFAULT 0,
                tier_2_output_tokens INTEGER DEFAULT 0,
                tier_3_input_tokens INTEGER DEFAULT 0,
                tier_3_output_tokens INTEGER DEFAULT 0,
                total_cost_usd REAL NOT NULL,
                latency_ms REAL NOT NULL
            );
        """)

        # Seed initial memories if table is empty
        cursor.execute("SELECT COUNT(*) as count FROM memories")
        row = cursor.fetchone()
        if row and row["count"] == 0:
            cursor.execute("""
                INSERT INTO memories (key, category, content)
                VALUES 
                ('preferred_briefing_format', 'user_preference', 'Executive Summary -> Dependency Matrix -> CVE Advisories -> Rollback Plan'),
                ('target_stack', 'project_context', 'FastAPI 0.111.0, PyJWT 2.8.0, Next.js 14.2.1'),
                ('lead_engineer', 'team', 'Sayim (sayim@internal.corp)')
            """)

        conn.commit()
        logger.info("Database initialized successfully at %s", SQLITE_DB_PATH)
    except Exception as e:
        logger.error("Failed to initialize database: %s", str(e))
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    init_db()
    print("SQLite database verified successfully at:", SQLITE_DB_PATH)
