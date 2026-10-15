# backend/models/tavily.py
"""Tavily search, extract, and Airlock diff models."""

from typing import List, Optional
from pydantic import BaseModel, Field

class AirlockDiff(BaseModel):
    raw_context: str = Field(..., description="Raw developer workspace context containing PII")
    sanitized_query: str = Field(..., description="Privacy-scrubbed search query dispatched to Tavily")
    scrubbed_entities: List[str] = Field(default_factory=list, description="List of scrubbed sensitive entities")
    scrub_latency_ms: float = Field(..., description="Time taken to scrub in milliseconds")

class TavilySource(BaseModel):
    title: str = Field(..., description="Web page title")
    url: str = Field(..., description="Source URL")
    content: str = Field(..., description="Extracted content snippet or markdown")
    score: float = Field(default=0.0, description="Relevance score")
    cve_id: Optional[str] = Field(default=None, description="Associated CVE identifier if discovered")

class AirlockResult(BaseModel):
    diff: AirlockDiff = Field(..., description="Airlock diff showing scrubbed entities")
    sources: List[TavilySource] = Field(default_factory=list, description="Extracted web intelligence sources")
    is_cached: bool = Field(default=False, description="Whether result was served from SQLite cache")
