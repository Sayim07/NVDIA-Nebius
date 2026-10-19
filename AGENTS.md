# AGENTS.md — Agent System Guide: HermesShield

## Context.dev Web Data Integration
- **Environment Secret:** `CONTEXT_DEV_API_KEY` in `backend/.env`. Read via environment variable only.
- **Server-Side Wrapper Module:** `backend/services/context_client.py` (`ContextDevClient`, singleton instance `context_client`).
- **Official SDK:** `context.dev` (`from context.dev import ContextDev`).
- **Selected Endpoints for Personal AI:**
  1. `POST /web/search` (from 1 credit / 10 results): Live web research and CVE advisory discovery.
     Docs: https://docs.context.dev/api-reference/web-scraping/search
  2. `POST /web/scrape` (from 1 credit / page): Extracts GFM Markdown from web pages with `mainContentOnly` filtering.
     Docs: https://docs.context.dev/api-reference/web-scraping/scrape
  3. `POST /web/answers` (10 credits in fast mode): Direct web research answers for personal briefings.
     Docs: https://docs.context.dev/api-reference/web-extraction/answers
- **FastAPI Endpoints:** `backend/routers/context_dev.py` mounted at `/api/v1/context` (`/search`, `/scrape`, `/answers`, `/status`).
- **Integration Rule:** All web data retrieval outside of Tavily must pass through `context_client`.
