# config/constants.py
"""System-wide fixed constants and configuration parameters for HermesShield."""

from pathlib import Path

# Base Paths (anchored to repository root)
ROOT_DIR: Path = Path(__file__).resolve().parent.parent
DEFAULT_WORKSPACE_DIR: Path = ROOT_DIR / "data" / "workspace"
DEFAULT_MEMORY_FILE: Path = ROOT_DIR / "data" / "MEMORY.md"
DEFAULT_SKILLS_DIR: Path = ROOT_DIR / "data" / "skills"
DEFAULT_BRIEFINGS_DIR: Path = ROOT_DIR / "data" / "briefings"
DEFAULT_FALLBACK_DIR: Path = ROOT_DIR / "data" / "fallback"
SQLITE_DB_PATH: Path = ROOT_DIR / "data" / "hermesshield.db"
NEMOCLAW_POLICY_PATH: Path = ROOT_DIR / "config" / "nemoclaw-policy.yaml"

# Application Branding
APP_NAME: str = "HermesShield"
APP_VERSION: str = "1.0.0"

# Nebius Token Factory Model Endpoints & Configuration
NEBIUS_BASE_URL: str = "https://api.studio.nebius.ai/v1"
MODEL_TIER_1_SCRUBBER: str = "nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B"      # Fallback: nvidia/Nemotron-3_5-Lightning
MODEL_TIER_2_SYNTHESIS: str = "nvidia/nemotron-3-super-120b-a12b"
MODEL_TIER_3_COMPILER: str = "nvidia/Nemotron-3-Ultra-550b-a55b"

# FinOps Pricing Rates (USD per 1,000,000 tokens)
RATE_TIER_1_INPUT: float = 0.06
RATE_TIER_1_OUTPUT: float = 0.24
RATE_TIER_2_INPUT: float = 0.30
RATE_TIER_2_OUTPUT: float = 1.20
RATE_TIER_3_INPUT: float = 1.00
RATE_TIER_3_OUTPUT: float = 4.00
RATE_MONOLITHIC_BASELINE: float = 1.00  # Baseline comparison rate ($1.00/1M tokens)

# Tavily Rate & Cache Limits (Basic depth protects free tier credits: 1 credit/search)
TAVILY_SEARCH_DEPTH: str = "basic"
TAVILY_MAX_SEARCH_RESULTS: int = 5
TAVILY_CACHE_TTL_HOURS: int = 24
AIRLOCK_MAX_QUERY_LENGTH: int = 200

# OpenShell Execution Timeouts
OPENSHELL_CMD_TIMEOUT_SECONDS: float = 5.0
