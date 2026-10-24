# backend/main.py - updated with dynamic env loading
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

# CORS configuration for Next.js frontend (Local, Vercel, and Custom Domains)
frontend_url = os.getenv("FRONTEND_URL")
allowed_origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
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

@app.get("/", tags=["System"])
async def root():
    """Root endpoint for Render health check."""
    return {"status": "ok", "app": APP_NAME, "version": APP_VERSION}

@app.get("/health", tags=["System"])
async def health():
    """Generic health check for cloud load balancers."""
    return {"status": "ok"}

@app.get("/api/v1/health", response_model=HealthStatus, tags=["System"])
async def get_health():
    """System health check and connection status indicator."""
    if _env_path.exists():
        load_dotenv(_env_path, override=True)

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

@app.get("/api/v1/settings/keys", tags=["Settings"])
async def get_settings_keys():
    """Retrieve masked status of configured API keys."""
    if _env_path.exists():
        load_dotenv(_env_path, override=True)

    nebius_key = os.getenv("NEBIUS_API_KEY", "")
    tavily_key = os.getenv("TAVILY_API_KEY", "")
    context_key = os.getenv("CONTEXT_DEV_API_KEY", "")

    def mask(k: str) -> str:
        if not k:
            return ""
        if len(k) <= 8:
            return "****"
        return f"{k[:6]}...{k[-4:]}"

    return {
        "nebius_configured": bool(nebius_key),
        "nebius_masked": mask(nebius_key),
        "tavily_configured": bool(tavily_key),
        "tavily_masked": mask(tavily_key),
        "context_dev_configured": bool(context_key),
        "context_dev_masked": mask(context_key),
    }

from pydantic import BaseModel
class UpdateKeysRequest(BaseModel):
    nebius_api_key: str | None = None
    tavily_api_key: str | None = None
    context_dev_api_key: str | None = None

@app.post("/api/v1/settings/keys", tags=["Settings"])
async def save_settings_keys(req: UpdateKeysRequest):
    """Save user-provided API keys to backend/.env and reload runtime."""
    env_lines = {}
    if _env_path.exists():
        for line in _env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env_lines[k.strip()] = v.strip()

    if req.nebius_api_key is not None and req.nebius_api_key.strip():
        env_lines["NEBIUS_API_KEY"] = req.nebius_api_key.strip()
    if req.tavily_api_key is not None and req.tavily_api_key.strip():
        env_lines["TAVILY_API_KEY"] = req.tavily_api_key.strip()
    if req.context_dev_api_key is not None and req.context_dev_api_key.strip():
        env_lines["CONTEXT_DEV_API_KEY"] = req.context_dev_api_key.strip()

    new_content = "\n".join(f"{k}={v}" for k, v in env_lines.items()) + "\n"
    _env_path.write_text(new_content, encoding="utf-8")
    load_dotenv(_env_path, override=True)

    nebius_connected = bool(os.getenv("NEBIUS_API_KEY"))
    tavily_connected = bool(os.getenv("TAVILY_API_KEY"))
    context_dev_connected = bool(os.getenv("CONTEXT_DEV_API_KEY"))

    return {
        "status": "updated",
        "nebius_connected": nebius_connected,
        "tavily_connected": tavily_connected,
        "context_dev_connected": context_dev_connected,
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=True)

