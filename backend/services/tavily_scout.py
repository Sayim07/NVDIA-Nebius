# backend/services/tavily_scout.py
"""Tavily search & extract pipeline with SHA-256 query caching in SQLite."""

import sys
import os
import json
import hashlib
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any, Optional

# Ensure repository root is on sys.path
_repo_root = Path(__file__).resolve().parent.parent.parent
if str(_repo_root) not in sys.path:
    sys.path.insert(0, str(_repo_root))

from config.constants import (
    TAVILY_SEARCH_DEPTH,
    TAVILY_MAX_SEARCH_RESULTS,
    TAVILY_CACHE_TTL_HOURS,
    DEFAULT_FALLBACK_DIR,
)
from backend.services.database import get_db_connection
from backend.models.tavily import TavilySource, AirlockResult, AirlockDiff

logger = logging.getLogger("hermesshield.tavily_scout")

def get_cached_search(query_hash: str) -> Optional[Dict[str, Any]]:
    """Retrieve non-expired search result from SQLite tavily_cache table."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT search_response_json, extracted_markdown, created_at
            FROM tavily_cache
            WHERE query_hash = ?
            """,
            (query_hash,)
        )
        row = cursor.fetchone()
        conn.close()

        if row:
            created_at = datetime.fromisoformat(row["created_at"].replace("Z", "+00:00").split(".")[0])
            if datetime.utcnow() - created_at < timedelta(hours=TAVILY_CACHE_TTL_HOURS):
                return {
                    "results": json.loads(row["search_response_json"]),
                    "extracted_markdown": row["extracted_markdown"] or ""
                }
    except Exception as e:
        logger.warning("Cache lookup failed for %s: %s", query_hash, str(e))
    return None

def store_cached_search(query_hash: str, sanitized_query: str, results: List[Dict[str, Any]], extracted_md: str) -> None:
    """Persist search and extract results to SQLite tavily_cache."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT OR REPLACE INTO tavily_cache (query_hash, sanitized_query, search_response_json, extracted_markdown, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (query_hash, sanitized_query, json.dumps(results), extracted_md, datetime.utcnow().isoformat())
        )
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error("Failed to store search in SQLite cache: %s", str(e))

def load_fallback_cves() -> List[TavilySource]:
    """Load deterministic pre-seeded CVE advisories from data/fallback/tavily_cve_response.json."""
    fallback_file = DEFAULT_FALLBACK_DIR / "tavily_cve_response.json"
    if fallback_file.exists():
        try:
            with open(fallback_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                return [
                    TavilySource(
                        title=item.get("title", "Advisory"),
                        url=item.get("url", "https://cve.mitre.org"),
                        content=item.get("content", ""),
                        score=float(item.get("score", 0.9)),
                        cve_id=item.get("cve_id")
                    )
                    for item in data.get("results", [])
                ]
        except Exception as e:
            logger.error("Error reading fallback CVEs: %s", str(e))

    return [
        TavilySource(
            title="CVE-2024-34351: Next.js Server Actions Host Header Advisory",
            url="https://nvd.nist.gov/vuln/detail/CVE-2024-34351",
            content="Next.js SSRF vulnerability in Server Actions when unvalidated Host header is supplied.",
            score=0.95,
            cve_id="CVE-2024-34351"
        )
    ]

def search_tavily(sanitized_query: str, diff: AirlockDiff) -> AirlockResult:
    """Execute cached or live Tavily search and markdown extract."""
    query_hash = hashlib.sha256(sanitized_query.encode("utf-8")).hexdigest()

    # 1. Check SQLite 24-hour cache
    cached = get_cached_search(query_hash)
    if cached:
        logger.info("Tavily cache HIT for query_hash: %s", query_hash[:12])
        sources = [
            TavilySource(
                title=item.get("title", ""),
                url=item.get("url", ""),
                content=item.get("content", ""),
                score=float(item.get("score", 0.8)),
                cve_id=item.get("cve_id")
            )
            for item in cached["results"]
        ]
        return AirlockResult(diff=diff, sources=sources, is_cached=True)

    tavily_key = os.getenv("TAVILY_API_KEY")

    if not tavily_key:
        logger.info("TAVILY_API_KEY not configured. Using pre-seeded offline fallback advisories.")
        fallback_sources = load_fallback_cves()
        return AirlockResult(diff=diff, sources=fallback_sources, is_cached=False)

    try:
        from tavily import TavilyClient
        tavily_client = TavilyClient(api_key=tavily_key)

        # Basic search depth conserves credits (1 credit/search)
        search_res = tavily_client.search(
            query=sanitized_query,
            search_depth=TAVILY_SEARCH_DEPTH,
            max_results=TAVILY_MAX_SEARCH_RESULTS,
            include_raw_content=False,
        )

        results = search_res.get("results", [])
        extracted_md = ""

        # Extract markdown from primary advisory URL if available
        if results:
            top_url = results[0]["url"]
            try:
                extract_res = tavily_client.extract(urls=[top_url])
                if extract_res.get("results"):
                    extracted_md = extract_res["results"][0].get("raw_content", "")[:2000]
            except Exception as e:
                logger.warning("Tavily extract failed for %s: %s", top_url, str(e))
                extracted_md = "Markdown extraction unavailable."

        # Cache live response in SQLite
        store_cached_search(query_hash, sanitized_query, results, extracted_md)

        sources = [
            TavilySource(
                title=item.get("title", "Advisory"),
                url=item.get("url", ""),
                content=item.get("content", ""),
                score=float(item.get("score", 0.8)),
                cve_id=next((word for word in item.get("title", "").split() if word.startswith("CVE-")), None)
            )
            for item in results
        ]

        return AirlockResult(diff=diff, sources=sources, is_cached=False)
    except Exception as e:
        logger.error("Tavily API call failed, activating zero-crash fallback: %s", str(e))
        fallback_sources = load_fallback_cves()
        return AirlockResult(diff=diff, sources=fallback_sources, is_cached=False)
