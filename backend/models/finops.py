# backend/models/finops.py
"""FinOps telemetry data models."""

from typing import List
from pydantic import BaseModel, Field

class TierTokenUsage(BaseModel):
    tier_name: str = Field(..., description="Name of the Nemotron tier")
    model: str = Field(..., description="Specific Nemotron model identifier")
    input_tokens: int = Field(default=0, description="Input tokens processed")
    output_tokens: int = Field(default=0, description="Output tokens generated")
    cost_usd: float = Field(default=0.0, description="Computed cost in USD")

class FinOpsTelemetry(BaseModel):
    total_cost_usd: float = Field(..., description="Total inference spend in USD")
    baseline_cost_usd: float = Field(..., description="Cost if routed to monolithic frontier baseline")
    cost_reduction_percent: float = Field(..., description="Percentage saved compared to baseline")
    execution_latency_ms: float = Field(..., description="Total pipeline latency in milliseconds")
    tier_breakdown: List[TierTokenUsage] = Field(default_factory=list, description="Usage breakdown per tier")
