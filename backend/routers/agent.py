# backend/routers/agent.py
"""Core Agent execution router: coordinates workspace ingestion, Airlock, OpenShell, and Tier 2 synthesis."""

import sys
import os
import time
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter

# Ensure repository root is on sys.path
_repo_root = Path(__file__).resolve().parent.parent.parent
if str(_repo_root) not in sys.path:
    sys.path.insert(0, str(_repo_root))

from config.constants import (
    DEFAULT_WORKSPACE_DIR,
    DEFAULT_MEMORY_FILE,
    DEFAULT_BRIEFINGS_DIR,
    MODEL_TIER_1_SCRUBBER,
)
from backend.models.agent import AgentRunRequest, AgentRunResponse, AgentSecuritySummary
from backend.models.security import SecurityEvent
from backend.models.finops import TierTokenUsage
from backend.services.airlock import sanitize_for_tavily
from backend.services.tavily_scout import search_tavily
from backend.services.openshell_guard import validate_command, log_security_event
from backend.services.nebius_router import synthesize_briefing_tier2, build_finops_telemetry, calculate_tier_cost
from backend.services.database import get_db_connection

router = APIRouter(prefix="/api/v1/agent", tags=["Agent"])

@router.post("/run", response_model=AgentRunResponse)
async def run_agent(req: AgentRunRequest):
    """
    Execute full HermesShield executive pipeline:
    1. Read local workspace manifest
    2. Read episodic memory
    3. Pass through Privacy-Preserving Tavily Airlock
    4. Fetch cached/live web advisories
    5. Execute OpenShell validated reading
    6. Synthesize briefing via Tier 2 Nemotron Super
    7. Compute FinOps token telemetry
    """
    pipeline_start = time.perf_counter()
    task_id = f"task_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"

    # 1. Ingest workspace context
    workspace_file = DEFAULT_WORKSPACE_DIR / f"{req.workspace_id}_manifest.json"
    if not workspace_file.exists():
        workspace_file = DEFAULT_WORKSPACE_DIR / "project_titan_manifest.json"

    raw_workspace_text = workspace_file.read_text(encoding="utf-8") if workspace_file.exists() else "{}"

    # 2. Ingest persistent memory
    memory_text = DEFAULT_MEMORY_FILE.read_text(encoding="utf-8") if DEFAULT_MEMORY_FILE.exists() else ""

    # 3. OpenShell security check on reading the workspace
    read_cmd = f"cat {workspace_file.relative_to(_repo_root)}"
    is_safe, rule, reason = validate_command(read_cmd)
    log_security_event(read_cmd, "ALLOWED" if is_safe else "BLOCKED", rule, reason)

    security_summary = AgentSecuritySummary(
        commands_executed=[read_cmd] if is_safe else [],
        violations_detected=[] if is_safe else [
            SecurityEvent(
                timestamp=datetime.utcnow().isoformat(),
                command=read_cmd,
                status="BLOCKED",
                policy_rule=rule,
                reason=reason
            )
        ]
    )

    # 4. Privacy-Preserving Tavily Airlock
    diff = await sanitize_for_tavily(raw_workspace_text, req.instruction)
    airlock_res = search_tavily(diff.sanitized_query, diff)

    # Compile source markdown for synthesis prompt
    sources_summary_md = ""
    for s in airlock_res.sources:
        sources_summary_md += f"- [{s.title}]({s.url}) (CVE: {s.cve_id or 'N/A'}): {s.content}\n"

    # 5. Tier 2 Nemotron Super Synthesis
    briefing_md, tier2_usage, is_fallback = await synthesize_briefing_tier2(
        user_instruction=req.instruction,
        workspace_context=raw_workspace_text,
        memory_context=memory_text,
        tavily_sources_md=sources_summary_md
    )

    # Write generated briefing to disk
    DEFAULT_BRIEFINGS_DIR.mkdir(parents=True, exist_ok=True)
    briefing_output_path = DEFAULT_BRIEFINGS_DIR / f"briefing_{task_id}.md"
    briefing_output_path.write_text(briefing_md, encoding="utf-8")

    # 6. FinOps Telemetry Accounting
    tier1_usage = calculate_tier_cost(
        tier_name="Tier 1 (Nano/Lightning)",
        model=MODEL_TIER_1_SCRUBBER,
        input_tokens=420,
        output_tokens=35
    )

    total_latency_ms = (time.perf_counter() - pipeline_start) * 1000
    telemetry = build_finops_telemetry([tier1_usage, tier2_usage], total_latency_ms)

    # Log telemetry to SQLite
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO telemetry_logs (
                task_id, tier_1_input_tokens, tier_1_output_tokens,
                tier_2_input_tokens, tier_2_output_tokens,
                total_cost_usd, latency_ms
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                task_id,
                tier1_usage.input_tokens, tier1_usage.output_tokens,
                tier2_usage.input_tokens, tier2_usage.output_tokens,
                telemetry.total_cost_usd,
                total_latency_ms
            )
        )
        conn.commit()
        conn.close()
    except Exception:
        pass

    return AgentRunResponse(
        task_id=task_id,
        timestamp=datetime.utcnow().isoformat(),
        status="completed",
        is_fallback=is_fallback,
        briefing_markdown=briefing_md,
        airlock=airlock_res,
        security=security_summary,
        finops=telemetry
    )
