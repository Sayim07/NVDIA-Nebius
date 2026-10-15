# backend/routers/memory.py
"""Memory and Hermes Skills endpoints for episodic recall and self-writing skills."""

import sys
import os
import yaml
import logging
from datetime import datetime
from pathlib import Path
from typing import List
from fastapi import APIRouter, HTTPException

# Ensure repository root is on sys.path
_repo_root = Path(__file__).resolve().parent.parent.parent
if str(_repo_root) not in sys.path:
    sys.path.insert(0, str(_repo_root))

from config.constants import (
    DEFAULT_MEMORY_FILE,
    DEFAULT_SKILLS_DIR,
    MODEL_TIER_3_COMPILER,
    NEBIUS_BASE_URL,
)
from backend.models.memory import (
    HermesSkill,
    MemoryStateResponse,
    UpdateMemoryRequest,
    UpdateMemoryResponse,
    CompileSkillRequest,
    CompileSkillResponse,
)

logger = logging.getLogger("hermesshield.memory")

router = APIRouter(tags=["Memory & Skills"])

def read_skills() -> List[HermesSkill]:
    """Read and parse all YAML skill files from data/skills/."""
    skills: List[HermesSkill] = []
    if not DEFAULT_SKILLS_DIR.exists():
        DEFAULT_SKILLS_DIR.mkdir(parents=True, exist_ok=True)
        return skills

    for yaml_file in DEFAULT_SKILLS_DIR.glob("*.yaml"):
        try:
            with open(yaml_file, "r", encoding="utf-8") as f:
                data = yaml.safe_load(f)
                if isinstance(data, dict):
                    skills.append(
                        HermesSkill(
                            skill_name=data.get("skill_name", yaml_file.stem),
                            version=str(data.get("version", "1.0.0")),
                            description=data.get("description", ""),
                            trigger_conditions=data.get("trigger_conditions", []),
                            execution_steps=data.get("execution_steps", []),
                            allowed_tools=data.get("allowed_tools", []),
                            created_at=data.get("created_at", datetime.utcnow().isoformat())
                        )
                    )
        except Exception as e:
            logger.error("Failed to parse skill file %s: %s", yaml_file, str(e))
    return skills

@router.get("/api/v1/memory", response_model=MemoryStateResponse)
async def get_memory_state():
    """Retrieve current contents of data/MEMORY.md and all saved YAML skills."""
    memory_md = ""
    if DEFAULT_MEMORY_FILE.exists():
        memory_md = DEFAULT_MEMORY_FILE.read_text(encoding="utf-8")
    else:
        memory_md = "# Hermes Persistent Memory\n\nNo memory initialized yet."

    skills = read_skills()
    return MemoryStateResponse(memory_markdown=memory_md, skills=skills)

@router.put("/api/v1/memory", response_model=UpdateMemoryResponse)
async def update_memory_state(req: UpdateMemoryRequest):
    """Update in-place contents of data/MEMORY.md."""
    try:
        DEFAULT_MEMORY_FILE.parent.mkdir(parents=True, exist_ok=True)
        DEFAULT_MEMORY_FILE.write_text(req.memory_markdown, encoding="utf-8")
        return UpdateMemoryResponse(updated=True, timestamp=datetime.utcnow().isoformat())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update memory: {str(e)}")

@router.post("/api/v1/skills/compile", response_model=CompileSkillResponse)
async def compile_skill(req: CompileSkillRequest):
    """
    Compile natural language user feedback into a structured YAML skill using Tier 3 Nemotron Ultra.
    Persists skill to data/skills/<skill_name>.yaml and appends rule to MEMORY.md.
    """
    feedback = req.user_feedback.strip()
    nebius_key = os.getenv("NEBIUS_API_KEY")

    skill_name = "architecture_briefing_skill"
    description = "Updated standard operating procedure incorporating user feedback."
    triggers = ["Prep technical briefing", "Architecture sync"]
    steps = [
        "Ingest local dependency manifest",
        "Scrub and query Tavily for CVE advisories and npm deprecation",
        "Synthesize briefing with mandatory 'Rollback Plan' section"
    ]
    tools = ["tavily_airlock_search", "workspace_manifest_reader"]

    if nebius_key:
        try:
            from openai import AsyncOpenAI
            client = AsyncOpenAI(base_url=NEBIUS_BASE_URL, api_key=nebius_key)
            prompt = (
                "You are the Hermes Skill Compiler powered by Nemotron 3 Ultra. "
                "Convert this user feedback into a structured JSON with keys: "
                "skill_name, version, description, trigger_conditions (list of strings), "
                "execution_steps (list of strings), allowed_tools (list of strings).\n\n"
                f"User Feedback: {feedback}"
            )
            response = await client.chat.completions.create(
                model=MODEL_TIER_3_COMPILER,
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.2,
                max_tokens=600,
            )
            import json
            parsed = json.loads(response.choices[0].message.content or "{}")
            skill_name = parsed.get("skill_name", skill_name)
            description = parsed.get("description", description)
            triggers = parsed.get("trigger_conditions", triggers)
            steps = parsed.get("execution_steps", steps)
            tools = parsed.get("allowed_tools", tools)
        except Exception as e:
            logger.warning("Tier 3 skill compiler fallback triggered: %s", str(e))

    now_iso = datetime.utcnow().isoformat()
    skill_obj = HermesSkill(
        skill_name=skill_name,
        version="1.1.0",
        description=description,
        trigger_conditions=triggers,
        execution_steps=steps,
        allowed_tools=tools,
        created_at=now_iso
    )

    skill_dict = skill_obj.model_dump()
    raw_yaml = yaml.dump(skill_dict, sort_keys=False)

    # Save to disk
    DEFAULT_SKILLS_DIR.mkdir(parents=True, exist_ok=True)
    target_skill_file = DEFAULT_SKILLS_DIR / f"{skill_name}.yaml"
    target_skill_file.write_text(raw_yaml, encoding="utf-8")

    # Append to MEMORY.md
    try:
        current_memory = DEFAULT_MEMORY_FILE.read_text(encoding="utf-8") if DEFAULT_MEMORY_FILE.exists() else ""
        rule_addition = f"\n- **Skill Learned ({skill_name}):** {feedback} (compiled at {now_iso})\n"
        DEFAULT_MEMORY_FILE.write_text(current_memory + rule_addition, encoding="utf-8")
        memory_updated = True
    except Exception:
        memory_updated = False

    return CompileSkillResponse(skill=skill_obj, raw_yaml=raw_yaml, memory_updated=memory_updated)
