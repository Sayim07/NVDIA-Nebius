# TRD.md — Technical Requirements Document: HermesShield

> **Crucial Implementation Constraint:** The coding tool must not substitute a library, dataset, or service not listed here without flagging it as an assumption first.

---

## 1. Architectural Overview & System Design
HermesShield is a decoupled, local-first sovereign agent control center consisting of:
1. **Frontend Dashboard:** A high-performance Next.js 14 web client utilizing the App Router, Tailwind CSS for dark-mode cybersecurity aesthetics, Framer Motion for telemetry micro-animations, and Lucide React icons.
2. **Backend Runtime:** An asynchronous Python 3.11+ FastAPI service hosting the 3-tier Nemotron router, the Privacy-Preserving Tavily Airlock, the OpenShell sandboxing supervisor, and the Hermes persistent memory compiler.
3. **Local Storage:** SQLite (`data/hermesshield.db`) for caching and security audit events, accompanied by human-readable markdown (`data/MEMORY.md`) and declarative YAML files (`config/nemoclaw-policy.yaml`, `data/skills/*.yaml`).

```
+---------------------------------------------------------------------------------+
|                                 HermesShield UI                                 |
|                         (Next.js 14 + Tailwind CSS)                             |
|  [Executive Tab]  |  [Tavily Airlock]  |  [NemoClaw HUD]  |  [Hermes Studio]   |
+----------------------------------------+----------------------------------------+
                                         | HTTP / JSON (Port 8000)
                                         v
+---------------------------------------------------------------------------------+
|                            FastAPI Agent Runtime                                |
|                                                                                 |
|  +-----------------------+  +----------------------+  +----------------------+  |
|  |     Tavily Airlock    |  |   3-Tier Router      |  |  OpenShell Guard     |  |
|  | (Regex + Tier 1 Scrub)|  | (Nebius Token Fact.) |  | (Policy Enforcement) |  |
|  +-----------+-----------+  +----------+-----------+  +----------+-----------+  |
+--------------|-------------------------|-------------------------|--------------+
               |                         |                         |
               v                         v                         v
       +---------------+      +--------------------+      +-----------------+
       | Tavily Search |      | Nebius Nemotron    |      | Sandboxed Local |
       | & Extract API |      | Nano / Super /     |      | Workspace & Sub-|
       | (Cached 24h)  |      | Ultra Inference    |      | process Runner  |
       +---------------+      +--------------------+      +-----------------+
```

---

## 2. Technical Stack & Architectural Justification

### 2.1 Frontend Layer
- **Framework: Next.js 14 (App Router)**
  - *Justification:* Industry-standard React framework supporting server components, optimized client state, and rapid local iteration. Single default chosen; locked on Day 1.
- **Language: TypeScript 5.0+**
  - *Justification:* Enforces strict compile-time types matching backend schemas defined in [Schema.md §2](./Schema.md#2-typescript-frontend-interfaces).
- **Styling: Tailwind CSS v3.4+ (`clsx`, `tailwind-merge`, `class-variance-authority`)**
  - *Justification:* Rapid implementation of rich cybersecurity dark-mode UI palettes (`slate-950`, emerald cyber accents, rose security banners) without bloated CSS.
- **UI Primitives: Radix UI & cmdk**
  - *Justification:* Accessible, unstyled primitives (`Dialog`, `Tabs`, `Tooltip`) paired with `cmdk` for the global Command Palette (`Ctrl+K` / `Cmd+K`).
- **3D Physics & Motion Engine: GSAP (`gsap` + `@gsap/react`)**
  - *Justification:* High-performance 3D perspective card tilts with specular reflection (`TiltCard`), magnetic cursor attraction (`Magnetic`), and luxury numerical tickers (`AnimatedCounter`).
- **Layout & Spring Animation: Framer Motion v11+**
  - *Justification:* Fluid spring transitions, animated tab indicators (`layoutId`), and red-team violation alert slides.
- **Inertial Smooth Scrolling: Lenis (`lenis`)**
  - *Justification:* Momentum-based smooth scrolling providing a luxury, agency-grade feel.
- **Icons: Lucide React**
  - *Justification:* Clean, lightweight iconography for cyber badges, status pills, and terminal tabs.

### 2.2 Backend Layer
- **Runtime: Python 3.11+**
  - *Justification:* Standard runtime for AI engineering with native async/await performance and broad SDK support.
- **Web Framework: FastAPI v0.111+**
  - *Justification:* High-performance asynchronous REST routing, automatic OpenAPI specification generation, and native integration with Pydantic v2.
- **Server: Uvicorn v0.30+**
  - *Justification:* Standard ASGI server for production-grade async Python.
- **LLM Gateway Client: `openai` (v1.35+ `AsyncOpenAI`)**
  - *Justification:* Official client for OpenAI-compatible gateways. Connects directly to the Nebius Token Factory endpoint (`https://api.tokenfactory.nebius.com/v1`).
- **Web Search Client: `tavily-python` (v0.5+)**
  - *Justification:* Official Tavily client for structured web search and markdown content extraction.
- **Serialization & Validation: Pydantic v2 & PyYAML v6+**
  - *Justification:* Strict runtime schema validation for API payloads and Hermes skill files.
- **Database Driver: Built-in `sqlite3`**
  - *Justification:* Zero-configuration, zero-external-dependency relational storage.

### 2.3 Layer-by-Layer Decision Defaults (Locked Day 1)
- *Frontend state management:* Native React state (`useState`, `useCallback`, `useEffect`). No Redux, Zustand, or Jotai needed for single-dashboard scope.
- *Styling strategy:* Pure Tailwind CSS utility classes with CSS variables in `globals.css`.
- *Agent architecture:* Pure Python async orchestration functions. Strictly **no** LangChain, LlamaIndex, AutoGen, or CrewAI.

---

## 3. Data Sources & External Services Catalog

| Service | Access Method | Cost / Tier | Authentication | Purpose & Limits |
| :--- | :--- | :--- | :--- | :--- |
| **Nebius Token Factory** | REST via `AsyncOpenAI` (`https://api.tokenfactory.nebius.com/v1`) | Hackathon credits ($0.06 to $1.00 per 1M input tokens) | `NEBIUS_API_KEY` (Bearer header) | Multi-tier Nemotron model inference (Nano/Lightning, Super, Ultra). |
| **Tavily Search API** | Python SDK (`tavily.TavilyClient`) | Free Researcher Tier (1,000 requests/month) | `TAVILY_API_KEY` in environment | Privacy-scrubbed web intelligence gathering. Protected by 24h SQLite query cache. |
| **Tavily Extract API** | Python SDK (`tavily.TavilyClient.extract`) | Included in Free Researcher Tier | `TAVILY_API_KEY` in environment | Full-page Markdown extraction from top advisory URLs discovered via search. |
| **Local Workspace Manifests** | Direct filesystem read (`data/workspace/*.json`) | $0.00 (Local) | None | Ingestion of project dependency versions, commit history, and meeting notes. |

---

## 4. Fixed Scope Constants & System Boundaries
The following parameters are immutable constants across all backend and frontend modules:

```python
# System-wide fixed constants (config/constants.py)
APP_NAME: str = "HermesShield"
APP_VERSION: str = "1.0.0"
DEFAULT_WORKSPACE_DIR: str = "data/workspace"
DEFAULT_MEMORY_FILE: str = "data/MEMORY.md"
DEFAULT_SKILLS_DIR: str = "data/skills"
SQLITE_DB_PATH: str = "data/hermesshield.db"
NEMOCLAW_POLICY_PATH: str = "config/nemoclaw-policy.yaml"

# Nebius Token Factory Model Endpoints
NEBIUS_BASE_URL: str = "https://api.tokenfactory.nebius.com/v1"
MODEL_TIER_1_SCRUBBER: str = "nvidia/nemotron-3-nano-30b-a3b"      # Fallback: nvidia/Nemotron-3_5-Lightning
MODEL_TIER_2_SYNTHESIS: str = "nvidia/nemotron-3-super-120b-a12b"
MODEL_TIER_3_COMPILER: str = "nvidia/Nemotron-3-Ultra-550b-a55b"

# FinOps Pricing Rates (USD per 1,000,000 tokens)
RATE_TIER_1_INPUT: float = 0.06
RATE_TIER_1_OUTPUT: float = 0.24
RATE_TIER_2_INPUT: float = 0.30
RATE_TIER_2_OUTPUT: float = 1.20
RATE_TIER_3_INPUT: float = 1.00
RATE_TIER_3_OUTPUT: float = 4.00
RATE_MONOLITHIC_BASELINE: float = 1.00  # Baseline comparison rate

# Tavily Rate & Cache Limits
TAVILY_SEARCH_DEPTH: str = "basic"
TAVILY_MAX_SEARCH_RESULTS: int = 5
TAVILY_CACHE_TTL_HOURS: int = 24
AIRLOCK_MAX_QUERY_LENGTH: int = 200

# OpenShell Execution Timeouts
OPENSHELL_CMD_TIMEOUT_SECONDS: float = 5.0
```

---

## 5. Performance Targets & Resource Constraints
- **Airlock Sanitization Latency:** ≤ 250ms for two-stage regex and Tier 1 model scrub.
- **OpenShell Sandboxing Overhead:** ≤ 15ms command validation and policy check before subprocess spawning.
- **End-to-End Briefing Pipeline Latency:** ≤ 4.5 seconds under live API execution; ≤ 350ms under fallback mode.
- **SQLite Database Footprint:** ≤ 50MB across 1,000 cached searches and audit records.
- **Memory Consumption:** Backend FastAPI service ≤ 250MB RAM; Next.js frontend client ≤ 150MB browser heap.

---

## 6. Zero-Crash Fallback & Fault Tolerance Architecture
If `NEBIUS_API_KEY` or `TAVILY_API_KEY` are not set in the environment, or if either API returns an HTTP 401, 429, or 5xx error, the agent runtime must **never crash or throw an unhandled 500 exception**.

1. **Airlock Fallback:** When Tavily API is offline or unauthenticated, the Airlock executes local regex sanitization, generates the visual diff, and loads realistic pre-seeded CVE and advisory intelligence from `data/fallback/tavily_cve_response.json`.
2. **Inference Fallback:** When Nebius Token Factory is offline or unauthenticated, the synthesis pipeline loads deterministic mock intelligence synthesis from `data/fallback/briefing_response.md` and generates structured YAML skills using internal templates.
3. **Response Flag:** All responses emitted under fallback conditions must return `"is_fallback": true` in their JSON payload, prompting the frontend to render an amber status badge: `Offline Simulation Mode`.

---

## 7. Security Architecture & OpenShell Specification
The backend execution supervisor (`backend/services/openshell_guard.py`) inspects all commands prior to invocation using Python's `shlex` and regex parsing against `config/nemoclaw-policy.yaml`:

- **Path Normalization:** Resolves absolute and relative paths to eliminate directory traversal tricks (`../../`).
- **Filesystem Constraints:** Write operations are strictly locked to `data/workspace/` and `data/briefings/`. File writes to root, system dirs, or source directories are rejected.
- **Blocked Sensitive Targets:** Any command referencing `.env`, `id_rsa`, `.ssh`, `credentials`, or `.git` is aborted immediately.
- **Network Exfiltration Rules:** Outgoing HTTP commands (`curl`, `wget`, `nc`) to arbitrary domains are blocked; external communication is exclusively handled via the application's internal Tavily client.
- **Audit Logging:** Every attempted execution—whether permitted or denied—is written synchronously to the SQLite `security_events` table (see [Schema.md §4](./Schema.md#4-database-schema-sqlite-datahermesshielddb)).

---

## 8. API Contract Pointer
For the complete, frozen specification of all REST endpoints, request bodies, response models, and error structures, refer directly to [Schema.md §5](./Schema.md#5-rest-api-contracts).
