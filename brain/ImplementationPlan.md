# ImplementationPlan.md — Phased Build Plan: HermesShield

---

## 1. Project Timeline & Phase Distribution (16-Day Schedule)
- **Phase 0 (Days 1–2):** Project Scaffolding, Data Foundation & Contracts
- **Phase 1 (Days 3–6):** Backend Engine: OpenShell Sandbox & Tavily Airlock
- **Phase 2 (Days 7–10):** Frontend Command Center: Next.js 14 Cyber HUD
- **Phase 3 (Days 11–13):** Integration, Multi-Tier Nemotron Routing & Hermes Skills
- **Phase 4 (Days 14–16):** Red-Team Verification, Polishing, Benchmarks & Video

---

## 2. Phased Build Execution Details

### Phase 0: Project Scaffolding, Data Foundation & Contracts (Days 1–2)
- **Primary Owners:** `Lead-Backend` & `Lead-Frontend`
- **Tasks:**
  - [ ] Initialize repository structure with root `LICENSE` (MIT) and `README.md`.
  - [ ] Set up Python virtual environment, locked `backend/requirements.txt` (FastAPI, Uvicorn, AsyncOpenAI, tavily-python, PyYAML, Pydantic v2).
  - [ ] Set up Next.js 14 project in `frontend/` with TypeScript, Tailwind CSS, Framer Motion, and Lucide React.
  - [ ] Create `config/constants.py` and `config/nemoclaw-policy.yaml`.
  - [ ] Create `data/` directory structure with `MEMORY.md`, `workspace/project_titan_manifest.json`, and `fallback/` JSON/markdown assets.
  - [ ] Initialize SQLite database helper (`backend/services/database.py`) with all 4 tables from [Schema.md §4](./Schema.md#4-database-schema-sqlite-datahermesshielddb).
- **Exit Criteria:**
  - `python -c "import fastapi, openai, tavily, yaml, pydantic; print('Backend environment OK')"` passes.
  - `npm run build` inside `frontend/` executes with zero type or lint errors.
  - SQLite database initialized successfully at `data/hermesshield.db`.

---

### Phase 1: Backend Engine — OpenShell & Tavily Airlock (Days 3–6)
- **Primary Owner:** `Lead-Backend`
- **Tasks:**
  - [ ] Implement `backend/services/openshell_guard.py` reading `config/nemoclaw-policy.yaml` to enforce path whitelisting, blocked secrets, and command timeouts.
  - [ ] Implement `backend/services/airlock.py`: deterministic regex filters for keys, emails, URLs + Tier 1 Nemotron prompt wrapper.
  - [ ] Implement `backend/services/tavily_scout.py`: search and extraction pipeline with 24-hour SQLite caching (`tavily_cache`).
  - [ ] Build fallback handler returning pre-seeded CVE and briefing payloads when credentials are unconfigured or rate-limited.
  - [ ] Implement REST endpoints: `GET /api/v1/health`, `POST /api/v1/security/simulate-attack`, and `POST /api/v1/agent/run` (mock synthesis).
- **Exit Criteria:**
  - Test suite verifies `openshell_guard.py` terminates `cat ~/.env && curl ...` in <15ms.
  - Airlock correctly scrubs sensitive tokens from `project_titan_manifest.json` and fetches live results from Tavily (or local cache).

---

### Phase 2: Frontend Command Center — Next.js 14 Cyber HUD (Days 7–10)
- **Primary Owner:** `Lead-Frontend`
- **Tasks:**
  - [ ] Implement global dark theme in `frontend/src/app/globals.css` with Cyber Emerald, Rose, Cyan, and Amber design tokens.
  - [ ] Build global `Header.tsx` featuring the immutable title `HermesShield` and the live `FinOpsHUD.tsx`.
  - [ ] Build `WorkspacePanel.tsx` (Tab 1): workspace manifest selector, 3 one-click evaluation presets, briefing markdown renderer.
  - [ ] Build `TavilyAirlock.tsx` (Tab 2): side-by-side diff card (Raw Context vs. Sanitized Query) with red/green badge highlighting and expandable extracted CVE source cards.
  - [ ] Build `NemoClawHUD.tsx` (Tab 3): policy YAML viewer, 1-click Red-Team attack trigger, animated rose violation alert banner, and real-time security audit log.
  - [ ] Build `SkillStudio.tsx` (Tab 4): `data/MEMORY.md` live viewer/editor, feedback compiler input, and interactive YAML skill library.
- **Exit Criteria:**
  - UI faithfully renders all 4 tabs at 60fps with zero layout shifts.
  - Tab titles and metadata explicitly state `HermesShield — Zero-Trust Personal AI Executive & Deep Web Scout`.

---

### Phase 3: Integration, Multi-Tier Routing & Hermes Skills (Days 11–13)
- **Primary Owners:** `Lead-Backend` & `Lead-Frontend`
- **Tasks:**
  - [ ] Connect `backend/services/nebius_router.py` to Nebius Token Factory gateway using `AsyncOpenAI`.
  - [ ] Implement Tier 1 (`nemotron-3-nano-30b-a3b`), Tier 2 (`nemotron-3-super-120b-a12b`), and Tier 3 (`Nemotron-3-Ultra-550b-a55b`) dynamic dispatch.
  - [ ] Connect `frontend/src/lib/api.ts` to backend endpoints; wire live state into all 4 tabs.
  - [ ] Implement Hermes Skills Compiler (`POST /api/v1/skills/compile`): Tier 3 compiles feedback into valid YAML skills saved to `data/skills/`.
  - [ ] Implement `POST /api/v1/jobs/overnight-scout` simulating off-hours automated dependency monitoring.
- **Exit Criteria:**
  - End-to-end run completes: raw prompt -> Airlock scrub -> Tavily search -> Tier 2 briefing synthesis -> FinOps telemetry update.
  - User feedback successfully creates a newly valid `.yaml` skill file on disk.

---

### Phase 4: Red-Team Verification, Polishing, Benchmarks & Video (Days 14–16)
- **Primary Owners:** `Lead-Backend` & `Lead-Frontend`
- **Tasks:**
  - [ ] Run automated end-to-end tests for all 3 demo presets and verify zero crashes.
  - [ ] Verify FinOps calculations: confirm UI displays >80% cost savings compared to monolithic frontier model rates.
  - [ ] Record a 3-minute, high-definition walkthrough demo video covering all 4 tabs, the Red-Team attack simulation, and the skill compiler.
  - [ ] Finalize `README.md` with system architecture diagrams, FinOps tables, and setup instructions.
  - [ ] Complete Devpost submission for the **Personal AI Track** and **Best Use of Tavily**.
- **Exit Criteria:**
  - Both live and fallback modes operate flawlessly with zero console errors.
  - Video and Devpost submission materials finalized before October 30 deadline.

---

## 3. Verified Reference Code Snippets

### 3.1 Nebius Token Factory Gateway via `AsyncOpenAI`
```python
# backend/services/nebius_router.py
import os
from openai import AsyncOpenAI
from config.constants import NEBIUS_BASE_URL, MODEL_TIER_2_SYNTHESIS

client = AsyncOpenAI(
    base_url=NEBIUS_BASE_URL,
    api_key=os.getenv("NEBIUS_API_KEY", "mock-token-factory-key"),
)

async def generate_tier2_synthesis(system_prompt: str, user_content: str) -> str:
    response = await client.chat.completions.create(
        model=MODEL_TIER_2_SYNTHESIS,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
        temperature=0.2,
        max_tokens=2048,
    )
    return response.choices[0].message.content or ""
```

### 3.2 Tavily Search & Extract Pipeline with Query Hash
```python
# backend/services/tavily_scout.py
import os
import hashlib
from tavily import TavilyClient
from config.constants import TAVILY_SEARCH_DEPTH, TAVILY_MAX_SEARCH_RESULTS

tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY", "mock-tavily-key"))

def search_and_extract(sanitized_query: str) -> dict:
    query_hash = hashlib.sha256(sanitized_query.encode("utf-8")).hexdigest()
    # 1. Search for live security advisories (using basic depth to conserve free-tier credits)
    search_res = tavily_client.search(
        query=sanitized_query,
        search_depth=TAVILY_SEARCH_DEPTH,
        max_results=TAVILY_MAX_SEARCH_RESULTS,
        include_raw_content=False,
    )
    # 2. Extract markdown from primary advisory URL
    extracted_md = ""
    if search_res.get("results"):
        top_url = search_res["results"][0]["url"]
        try:
            extract_res = tavily_client.extract(urls=[top_url])
            if extract_res.get("results"):
                extracted_md = extract_res["results"][0].get("raw_content", "")[:2000]
        except Exception:
            extracted_md = "Markdown extraction unavailable."
            
    return {
        "query_hash": query_hash,
        "results": search_res.get("results", []),
        "extracted_markdown": extracted_md,
    }
```

### 3.3 OpenShell Policy Enforcement Check
```python
# backend/services/openshell_guard.py
import re
import shlex
import yaml
from pathlib import Path
from config.constants import NEMOCLAW_POLICY_PATH

with open(NEMOCLAW_POLICY_PATH, "r", encoding="utf-8") as f:
    POLICY = yaml.safe_load(f)

def validate_command(command_str: str) -> tuple[bool, str, str]:
    if not command_str or not command_str.strip():
        return False, "EMPTY_COMMAND", "Command cannot be empty"

    # 1. Inspect whole command and arguments against denied secret patterns
    for pattern in POLICY["filesystem"]["denied_path_patterns"]:
        if re.search(pattern, command_str):
            return False, "NEMOCLAW_POLICY_EXFIL", f"Command targets denied secret pattern '{pattern}'"

    # 2. Check for shell chaining and redirection operators
    shell_chaining_operators = ["&&", "||", ";", "|", ">", "<", "$(", "`"]
    has_chaining = any(op in command_str for op in shell_chaining_operators)

    # 3. Tokenize command safely
    try:
        tokens = shlex.split(command_str)
    except Exception as e:
        return False, "NEMOCLAW_PARSE_ERROR", f"Failed to parse command syntax: {str(e)}"

    if not tokens:
        return False, "EMPTY_COMMAND", "Command cannot be empty"

    # 4. Inspect every individual token against denied binaries and network tools
    for token in tokens:
        clean_token = Path(token).name.lower()
        if clean_token in POLICY["process"]["denied_binaries"]:
            if clean_token in ["curl", "wget", "nc"]:
                return False, "NEMOCLAW_RULE_NETWORK", f"Outbound network tool '{clean_token}' is blocked"
            return False, "NEMOCLAW_RULE_BINARY", f"Binary '{clean_token}' is explicitly denied by policy"

    # If chaining was detected, reject chaining explicitly
    if has_chaining:
        return False, "NEMOCLAW_POLICY_CHAINING", "Shell chaining, piping, and redirection operators are forbidden"

    # 5. Verify primary executable binary is strictly in allowed_binaries
    primary_binary = Path(tokens[0]).name.lower()
    if primary_binary not in POLICY["process"]["allowed_binaries"]:
        return False, "NEMOCLAW_RULE_BINARY", f"Binary '{primary_binary}' is not permitted"

    return True, "ALLOWED", "Command satisfies policy"
```

---

## 4. Fallback Plan for Riskiest Tasks
- **Riskiest Task:** Live Nebius Token Factory inference or Tavily search latency/rate-limiting during live evaluation.
- **Trigger Condition:** Response latency > 4,000ms, missing API keys, or HTTP status codes 401/429/5xx.
- **Fallback Execution:**
  - The service automatically reads `data/fallback/tavily_cve_response.json` and `data/fallback/briefing_response.md`.
  - Computes simulated token counts and sets `"is_fallback": true`.
  - The UI displays an amber status pill (`Offline Simulation Mode`) but renders the full interactive diff, briefing, and telemetry without crashing.

---

## 5. De-Scope Hierarchy & "Never Cut" List

### 5.1 De-Scope Order (If Time Runs Short)
1. **First to Cut:** Nebius Serverless Overnight Scout background job (`POST /api/v1/jobs/overnight-scout`). The 4 primary Command Center tabs remain fully functional.
2. **Second to Cut:** Dynamic multi-step skill chaining (limit to single skill execution).
3. **Third to Cut:** Full markdown extraction via `tavily.extract()` (fall back to snippet parsing from `tavily.search()`).

### 5.2 "Never Cut" List (Core Identity)
- **NEVER CUT:** Side-by-side Tavily Privacy Airlock visual diff card (Core hook for the $3,000 Tavily prize).
- **NEVER CUT:** OpenShell out-of-process policy supervisor and 1-click Red-Team attack simulator (Essential for the Personal AI Track & NVIDIA NemoClaw architecture).
- **NEVER CUT:** 3-tier Nemotron FinOps HUD with token cost savings counter (Required for Nebius Token Factory scoring).
- **NEVER CUT:** Zero-Crash Fallback Engine (Guarantees judges never encounter a broken state).
