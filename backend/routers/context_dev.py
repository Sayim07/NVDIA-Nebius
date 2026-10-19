# backend/routers/context_dev.py
"""Context.dev API router: Exposes search, scrape, and answer endpoints for Personal AI."""

from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.services.context_client import context_client

router = APIRouter(prefix="/api/v1/context", tags=["Context.dev"])

class ContextSearchRequest(BaseModel):
    query: str = Field(..., description="Web search query for real-time web intelligence")
    num_results: int = Field(5, ge=1, le=20, description="Number of results to return")
    include_domains: Optional[List[str]] = Field(None, description="Optional domain allowlist")
    exclude_domains: Optional[List[str]] = Field(None, description="Optional domain blocklist")

class ContextScrapeRequest(BaseModel):
    url: str = Field(..., description="URL to scrape into Markdown")
    main_content_only: bool = Field(True, description="Whether to isolate main article content")

class ContextAnswersRequest(BaseModel):
    query: str = Field(..., description="Research question to answer from the live web")
    mode: str = Field("fast", description="Research mode: 'fast' (10 credits) or 'ultra' (100 credits)")

@router.get("/status")
async def get_context_status() -> Dict[str, Any]:
    """Return Context.dev integration status and available capabilities."""
    return {
        "configured": context_client.is_configured,
        "base_url": "https://api.context.dev/v1",
        "endpoints": [
            {
                "name": "Search Web",
                "method": "POST",
                "path": "/web/search",
                "docs": "https://docs.context.dev/api-reference/web-scraping/search",
            },
            {
                "name": "Scrape Web",
                "method": "POST",
                "path": "/web/scrape",
                "docs": "https://docs.context.dev/api-reference/web-scraping/scrape",
            },
            {
                "name": "Web Answers",
                "method": "POST",
                "path": "/web/answers",
                "docs": "https://docs.context.dev/api-reference/web-extraction/answers",
            },
        ],
    }

@router.post("/search")
async def context_search(req: ContextSearchRequest) -> Dict[str, Any]:
    """Execute live web search via Context.dev."""
    result = context_client.search(
        query=req.query,
        num_results=req.num_results,
        include_domains=req.include_domains,
        exclude_domains=req.exclude_domains,
    )
    return result

@router.post("/scrape")
async def context_scrape(req: ContextScrapeRequest) -> Dict[str, Any]:
    """Scrape a web page to GFM Markdown via Context.dev."""
    result = context_client.scrape(
        url=req.url,
        markdown=True,
        main_content_only=req.main_content_only,
    )
    return result

@router.post("/answers")
async def context_answers(req: ContextAnswersRequest) -> Dict[str, Any]:
    """Extract answers from the live web via Context.dev."""
    result = context_client.answers(
        query=req.query,
        mode=req.mode,
    )
    return result
