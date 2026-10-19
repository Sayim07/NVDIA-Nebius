# backend/services/context_client.py
"""Context.dev unified server-side wrapper service for HermesShield Personal AI."""

import os
import logging
from typing import Optional, Dict, Any, List
from pathlib import Path
from dotenv import load_dotenv

# Ensure local .env is loaded
_env_path = Path(__file__).resolve().parent.parent / ".env"
if _env_path.exists():
    load_dotenv(_env_path)
else:
    load_dotenv()

from context.dev import ContextDev

logger = logging.getLogger("hermesshield.context_dev")

class ContextDevClient:
    """Unified server-side client wrapper for Context.dev APIs."""

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("CONTEXT_DEV_API_KEY")
        if not self.api_key:
            logger.warning("CONTEXT_DEV_API_KEY is not set. Context.dev calls will operate in fallback mode.")
            self._client: Optional[ContextDev] = None
        else:
            self._client = ContextDev(api_key=self.api_key)
            logger.info("Context.dev client initialized successfully.")

    @property
    def is_configured(self) -> bool:
        """Check if an active API key is available."""
        return self._client is not None and bool(self.api_key)

    def search(
        self,
        query: str,
        num_results: int = 5,
        include_domains: Optional[List[str]] = None,
        exclude_domains: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Search the web via Context.dev (POST /web/search).
        
        Docs: https://docs.context.dev/api-reference/web-scraping/search
        Cost: From 1 credit per 10 results.
        """
        if not self.is_configured:
            logger.warning("Context.dev not configured; returning fallback search response.")
            return {
                "query": query,
                "results": [],
                "is_fallback": True,
                "error": "CONTEXT_DEV_API_KEY unset",
            }

        try:
            logger.info("Context.dev search dispatched: query='%s', numResults=%d", query, num_results)
            params: Dict[str, Any] = {
                "query": query,
                "num_results": num_results,
            }
            if include_domains:
                params["include_domains"] = include_domains
            if exclude_domains:
                params["exclude_domains"] = exclude_domains

            response = self._client.web.search(**params)
            
            # Format results into standardized dict
            raw_results = getattr(response, "results", []) or []
            formatted_results = []
            for item in raw_results:
                formatted_results.append({
                    "title": getattr(item, "title", ""),
                    "url": getattr(item, "url", ""),
                    "description": getattr(item, "description", ""),
                    "relevance": getattr(item, "relevance", "medium"),
                })

            return {
                "query": query,
                "results": formatted_results,
                "partial": getattr(response, "partial", False),
                "is_fallback": False,
            }
        except Exception as exc:
            logger.error("Context.dev search failed: %s", exc, exc_info=True)
            return {
                "query": query,
                "results": [],
                "is_fallback": True,
                "error": str(exc),
            }

    def scrape(
        self,
        url: str,
        markdown: bool = True,
        main_content_only: bool = True,
    ) -> Dict[str, Any]:
        """Scrape webpage content via Context.dev (POST /web/scrape).
        
        Docs: https://docs.context.dev/api-reference/web-scraping/scrape
        Cost: From 1 credit per page.
        """
        if not self.is_configured:
            return {
                "url": url,
                "markdown": "",
                "is_fallback": True,
                "error": "CONTEXT_DEV_API_KEY unset",
            }

        try:
            logger.info("Context.dev scrape dispatched: url='%s'", url)
            response = self._client.web.scrape(
                url=url,
                formats={"markdown": markdown},
                shared_params={"main_content_only": main_content_only},
            )
            markdown_data = ""
            if hasattr(response, "markdown") and response.markdown:
                markdown_data = getattr(response.markdown, "data", "")

            return {
                "url": url,
                "markdown": markdown_data,
                "is_fallback": False,
            }
        except Exception as exc:
            logger.error("Context.dev scrape failed: %s", exc, exc_info=True)
            return {
                "url": url,
                "markdown": "",
                "is_fallback": True,
                "error": str(exc),
            }

    def answers(
        self,
        query: str,
        mode: str = "fast",
    ) -> Dict[str, Any]:
        """Answer a research question via Context.dev (POST /web/answers).
        
        Docs: https://docs.context.dev/api-reference/web-extraction/answers
        Cost: 10 credits in Fast mode.
        """
        if not self.is_configured:
            return {
                "query": query,
                "answer": None,
                "is_fallback": True,
                "error": "CONTEXT_DEV_API_KEY unset",
            }

        try:
            logger.info("Context.dev answers dispatched: query='%s', mode='%s'", query, mode)
            response = self._client.web.answers(
                query=query,
                mode=mode,
            )
            return {
                "query": query,
                "answer": response,
                "is_fallback": False,
            }
        except Exception as exc:
            logger.error("Context.dev answers failed: %s", exc, exc_info=True)
            return {
                "query": query,
                "answer": None,
                "is_fallback": True,
                "error": str(exc),
            }

# Module-level singleton instance
context_client = ContextDevClient()
