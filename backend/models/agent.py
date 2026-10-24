# backend/models/agent.py
"""Agent execution request and response contracts."""

from typing import List, Optional
from pydantic import BaseModel, Field
from backend.models.tavily import AirlockResult
from backend.models.security import SecurityEvent
from backend.models.finops import FinOpsTelemetry

class HealthStatus(BaseModel):
    app_name: str = Field(default="HermesShield")
    version: str = Field(default="1.0.0")
    status: str = Field(default="ok")
    is_fallback: bool = Field(default=False)
    nebius_connected: bool = Field(default=False)
    tavily_connected: bool = Field(default=False)
    context_dev_connected: bool = Field(default=False)

class AgentSecuritySummary(BaseModel):
    commands_executed: List[str] = Field(default_factory=list)
    violations_detected: List[SecurityEvent] = Field(default_factory=list)

class AgentRunRequest(BaseModel):
    instruction: str = Field(..., description="User prompt or task instruction")
    workspace_id: str = Field(default="project_titan", description="Target workspace manifest ID")
    preset_name: Optional[str] = Field(default=None, description="Optional preset identifier")
    workspace_context: Optional[str] = Field(default=None, description="Optional raw code/manifest text from selected folder")

class AgentRunResponse(BaseModel):
    task_id: str = Field(..., description="Unique task execution ID")
    timestamp: str = Field(..., description="Timestamp of completion")
    status: str = Field(default="completed", description="Task status")
    is_fallback: bool = Field(default=False, description="Whether fallback engine handled request")
    briefing_markdown: str = Field(..., description="Synthesized technical briefing report")
    airlock: AirlockResult = Field(..., description="Airlock diff and extracted intelligence")
    security: AgentSecuritySummary = Field(..., description="Commands executed and violations caught")
    finops: FinOpsTelemetry = Field(..., description="FinOps token metrics and latency")

class OvernightScoutResponse(BaseModel):
    job_id: str = Field(..., description="Background scout job ID")
    status: str = Field(default="completed")
    briefing_path: str = Field(..., description="Path to generated overnight briefing")
    dependencies_checked: int = Field(default=0)
    new_advisories_found: int = Field(default=0)
    execution_latency_ms: float = Field(default=0.0)
