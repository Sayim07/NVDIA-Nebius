# backend/services/airlock.py
"""Privacy-Preserving Tavily Airlock: Regex and Tier 1 Nemotron PII & secret sanitizer."""

import sys
import re
import time
import os
import logging
from pathlib import Path
from typing import Tuple, List, Dict, Any

# Ensure repository root is on sys.path
_repo_root = Path(__file__).resolve().parent.parent.parent
if str(_repo_root) not in sys.path:
    sys.path.insert(0, str(_repo_root))

from config.constants import (
    MODEL_TIER_1_SCRUBBER,
    AIRLOCK_MAX_QUERY_LENGTH,
)
from backend.models.tavily import AirlockDiff

logger = logging.getLogger("hermesshield.airlock")

# Deterministic Regex Patterns for Secrets and PII
REGEX_PATTERNS = [
    (r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", "EMAIL"),
    (r"https?://[^\s]*(?:internal|staging|corp|private)[^\s]*", "INTERNAL_URL"),
    (r"\b(?:AKIA[0-9A-Z]{16})\b", "AWS_KEY"),
    (r"\b(?:ghp_[a-zA-Z0-9]{36})\b", "GITHUB_PAT"),
    (r"\b(?:sk-[a-zA-Z0-9_-]{20,})\b", "OPENAI_KEY"),
    (r"\b(?:Bearer\s+[a-zA-Z0-9_.-]{20,})\b", "BEARER_TOKEN"),
    (r"-----BEGIN [A-Z ]+ PRIVATE KEY-----", "PRIVATE_KEY"),
    (r"\b(?:Sayim|Sayim07)\b", "DEVELOPER_NAME"),
]

def regex_scrub(text: str) -> Tuple[str, List[str]]:
    """Stage A: Deterministically strip known PII, secrets, and internal hostnames."""
    scrubbed_entities: List[str] = []
    cleaned_text = text

    for pattern, label in REGEX_PATTERNS:
        matches = re.findall(pattern, cleaned_text, flags=re.IGNORECASE)
        for m in matches:
            if m not in scrubbed_entities:
                scrubbed_entities.append(m)
            cleaned_text = cleaned_text.replace(m, f"[SCRUBBED_{label}]")

    return cleaned_text, scrubbed_entities

def extract_technical_keywords(text: str) -> str:
    """Deterministic extractor for technical package names, versions, and security intents."""
    # Common software tokens and version patterns
    versioned_pkgs = re.findall(r"\b([a-zA-Z0-9_.-]+)\s+(\d+\.\d+(?:\.\d+)?)\b", text)
    tokens: List[str] = []
    for pkg, ver in versioned_pkgs:
        # Ignore common non-package words
        if pkg.lower() not in ["version", "v", "at", "sync", "service", "the"]:
            tokens.append(f"{pkg} {ver}")

    # Fallback to key known packages if not captured
    known_targets = ["FastAPI", "Next.js", "PyJWT", "Pydantic", "Uvicorn", "Tailwind"]
    for target in known_targets:
        if target.lower() in text.lower() and not any(target.lower() in t.lower() for t in tokens):
            tokens.append(target)

    if not tokens:
        tokens = ["FastAPI", "Next.js", "PyJWT"]

    query = " ".join(tokens) + " CVE security advisory vulnerability October 2026"
    return query[:AIRLOCK_MAX_QUERY_LENGTH]

async def sanitize_for_tavily(raw_context: str, user_instruction: str = "") -> AirlockDiff:
    """
    Two-stage Airlock pipeline:
    1. Deterministic regex scrub
    2. Tier 1 Nemotron Nano synthesis (or deterministic fallback)
    """
    start_time = time.perf_counter()
    full_text = f"{raw_context} {user_instruction}".strip()

    # Stage A: Regex scrub
    pre_scrubbed, scrubbed_entities = regex_scrub(full_text)

    # Stage B: Tier 1 Nemotron Nano (or deterministic fallback)
    nebius_key = os.getenv("NEBIUS_API_KEY")
    sanitized_query = ""

    if nebius_key:
        try:
            from openai import AsyncOpenAI
            from config.constants import NEBIUS_BASE_URL
            client = AsyncOpenAI(base_url=NEBIUS_BASE_URL, api_key=nebius_key)
            prompt = (
                "You are the HermesShield Zero-PII Airlock. Extract ONLY the software library names, "
                "exact version numbers, and the words 'CVE security advisory vulnerability' from this text. "
                "Output ONLY the concise search query string. Never include any company names, personal names, "
                "internal URLs, or secrets.\n\n"
                f"Input: {pre_scrubbed}"
            )
            response = await client.chat.completions.create(
                model=MODEL_TIER_1_SCRUBBER,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=60,
                temperature=0.0,
            )
            sanitized_query = (response.choices[0].message.content or "").strip().replace('"', '')
        except Exception as e:
            logger.warning("Tier 1 Nemotron scrubber failed, falling back to deterministic keyword extractor: %s", str(e))
            sanitized_query = extract_technical_keywords(full_text)
    else:
        sanitized_query = extract_technical_keywords(full_text)

    latency_ms = (time.perf_counter() - start_time) * 1000

    return AirlockDiff(
        raw_context=raw_context,
        sanitized_query=sanitized_query,
        scrubbed_entities=scrubbed_entities,
        scrub_latency_ms=round(latency_ms, 2)
    )
