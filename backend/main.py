# backend/main.py
"""HermesShield FastAPI Agent Runtime Entrypoint."""

import sys
import os
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure repository root is on sys.path
_repo_root = Path(__file__).resolve().parent.parent
if str(_repo_root) not in sys.path:
    sys.path.insert(0, str(_repo_root))

from dotenv import load_dotenv

# Ensure local .env is loaded
_env_path = Path(__file__).resolve().parent / ".env"
if _env_path.exists():
    load_dotenv(_env_path)
else:
    load_dotenv()

from config.constants import APP_NAME, APP_VERSION
from backend.services.database import init_db
from backend.models.agent import HealthStatus
from backend.routers import agent, security, memory, jobs, context_dev

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("hermesshield.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Bootstrap database and verify configurations upon startup."""
    logger.info("Initializing %s v%s runtime...", APP_NAME, APP_VERSION)
    init_db()
    nebius_key = os.getenv("NEBIUS_API_KEY")
    tavily_key = os.getenv("TAVILY_API_KEY")
    context_dev_key = os.getenv("CONTEXT_DEV_API_KEY")
    logger.info("Nebius Token Factory Key: %s", "CONFIGURED" if nebius_key else "UNSET (Offline Fallback Active)")
    logger.info("Tavily API Key: %s", "CONFIGURED" if tavily_key else "UNSET (Offline Fallback Active)")
    logger.info("Context.dev API Key: %s", "CONFIGURED" if context_dev_key else "UNSET (Offline Fallback Active)")
    yield
    logger.info("HermesShield runtime shutting down.")

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description="The Self-Learning, Zero-Trust Personal AI Executive & Deep Web Scout",
    lifespan=lifespan
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(agent.router)
app.include_router(security.router)
app.include_router(memory.router)
app.include_router(jobs.router)
app.include_router(context_dev.router)

@app.get("/api/v1/health", response_model=HealthStatus, tags=["System"])
async def get_health():
    """System health check and connection status indicator."""
    nebius_connected = bool(os.getenv("NEBIUS_API_KEY"))
    tavily_connected = bool(os.getenv("TAVILY_API_KEY"))
    context_dev_connected = bool(os.getenv("CONTEXT_DEV_API_KEY"))
    is_fallback = not (nebius_connected and (tavily_connected or context_dev_connected))

    return HealthStatus(
        app_name=APP_NAME,
        version=APP_VERSION,
        status="ok",
        is_fallback=is_fallback,
        nebius_connected=nebius_connected,
        tavily_connected=tavily_connected,
        context_dev_connected=context_dev_connected,
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
