# backend/models/memory.py
"""Hermes skill and persistent memory models."""

from typing import List, Optional
from pydantic import BaseModel, Field

class HermesSkill(BaseModel):
    skill_name: str = Field(..., description="Unique skill name identifier")
    version: str = Field(default="1.0.0", description="Skill semantic version")
    description: str = Field(..., description="Operational summary of the skill")
    trigger_conditions: List[str] = Field(default_factory=list, description="Phrases triggering this skill")
    execution_steps: List[str] = Field(default_factory=list, description="Ordered procedural steps")
    allowed_tools: List[str] = Field(default_factory=list, description="Permitted execution tools")
    created_at: str = Field(..., description="ISO timestamp of creation")

class MemoryStateResponse(BaseModel):
    memory_markdown: str = Field(..., description="Current contents of data/MEMORY.md")
    skills: List[HermesSkill] = Field(default_factory=list, description="List of all compiled skills")

class UpdateMemoryRequest(BaseModel):
    memory_markdown: str = Field(..., description="Updated contents for data/MEMORY.md")

class UpdateMemoryResponse(BaseModel):
    updated: bool = Field(default=True, description="Update status")
    timestamp: str = Field(..., description="Timestamp of write")

class CompileSkillRequest(BaseModel):
    user_feedback: str = Field(..., description="Natural language feedback or correction")
    reference_task_id: Optional[str] = Field(default=None, description="Task ID this correction applies to")

class CompileSkillResponse(BaseModel):
    skill: HermesSkill = Field(..., description="Compiled structured skill object")
    raw_yaml: str = Field(..., description="Serialized YAML string of the skill")
    memory_updated: bool = Field(default=True, description="Whether MEMORY.md was updated")
