# backend/models/security.py
"""Security events and attack simulation models."""

from typing import Optional, List
from pydantic import BaseModel, Field

class SecurityEvent(BaseModel):
    id: Optional[int] = Field(default=None, description="Primary key ID")
    timestamp: str = Field(..., description="Timestamp of the event")
    command: str = Field(..., description="Executed or attempted command string")
    status: str = Field(..., description="ALLOWED or BLOCKED")
    policy_rule: str = Field(..., description="Violated or evaluated policy rule identifier")
    reason: str = Field(..., description="Explanation of policy decision")

class AttackSimulationResponse(BaseModel):
    payload_executed: str = Field(..., description="Malicious injection payload tested")
    status: str = Field(default="BLOCKED", description="Security outcome")
    violated_rule: str = Field(..., description="Violated policy rule identifier")
    execution_latency_ms: float = Field(..., description="Time taken to intercept in milliseconds")
    details: str = Field(..., description="Detailed explanation of the interception")

class SecurityStateResponse(BaseModel):
    policy_yaml: str = Field(..., description="Content of config/nemoclaw-policy.yaml")
    events: List[SecurityEvent] = Field(default_factory=list, description="Historical security audit log")
