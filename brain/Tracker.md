# Tracker.md — Status Board: HermesShield

---

## 1. Project Phase Trackers

### Phase 0: Project Scaffolding, Data Foundation & Contracts (Days 1–2)
| Task | Owner | Status | Notes |
| :--- | :--- | :--- | :--- |
| Initialize Git repo, root `LICENSE` (MIT), and `README.md` | Lead-Backend | Done | Baseline setup |
| Set up Python virtual environment & locked `requirements.txt` | Lead-Backend | Done | Python 3.11+ |
| Initialize Next.js 14 project with Tailwind & Framer Motion | Lead-Frontend | Done | App Router & TypeScript |
| Create `config/constants.py` and `config/nemoclaw-policy.yaml` | Lead-Backend | Done | System constants & policy |
| Seed `data/` assets (`MEMORY.md`, manifests, fallback data) | Lead-Frontend | Done | Mock workspace data |
| **[BLOCKING EXIT]** Initialize SQLite database with 4 schemas | Lead-Backend | Done | Database verified |

---

### Phase 1: Backend Engine — OpenShell & Tavily Airlock (Days 3–6)
| Task | Owner | Status | Notes |
| :--- | :--- | :--- | :--- |
| Implement OpenShell supervisor (`openshell_guard.py`) | Lead-Backend | Done | Out-of-process subprocess guard |
| Implement regex & Tier 1 PII scrubber (`airlock.py`) | Lead-Backend | Done | Intercepts outgoing queries |
| Implement Tavily search, extract & 24h SQLite caching | Lead-Backend | Done | `tavily_scout.py` |
| Build offline fallback handlers with realistic mock data | Lead-Backend | Done | Guarantees zero crashes |
| **[BLOCKING EXIT]** Implement core REST endpoints in FastAPI | Lead-Backend | Done | Health, run, simulate-attack verified |

---

### Phase 2: Frontend Command Center — Next.js 14 Cyber HUD (Days 7–10)
| Task | Owner | Status | Notes |
| :--- | :--- | :--- | :--- |
| Configure dark-mode cyber design tokens in `globals.css` | Lead-Frontend | Done | `bg-slate-950` palette |
| Build `Header.tsx` & `FinOpsHUD.tsx` | Lead-Frontend | Done | Live cost & latency pill with GSAP |
| Build Tab 1: `WorkspacePanel.tsx` with 3 demo presets | Lead-Frontend | Done | Executive workspace run |
| Build Tab 2: `TavilyAirlock.tsx` side-by-side diff card | Lead-Frontend | Done | Visual red/green PII diff |
| Build Tab 3: `NemoClawHUD.tsx` with Red-Team attack trigger | Lead-Frontend | Done | Interactive attack simulator |
| Build Tab 4: `SkillStudio.tsx` (`MEMORY.md` & skill cards) | Lead-Frontend | Done | Hermes memory & skills |
| **[BLOCKING EXIT]** Verify Next.js build & responsive UI | Lead-Frontend | Done | `npm run build` succeeds 0 errors |

---

### Phase 3: Integration, Multi-Tier Routing & Hermes Skills (Days 11–13)
| Task | Owner | Status | Notes |
| :--- | :--- | :--- | :--- |
| Connect Nebius Token Factory gateway via `AsyncOpenAI` | Lead-Backend | Done | Multi-tier Nemotron router |
| Connect frontend `api.ts` to backend REST endpoints | Lead-Frontend | Done | End-to-end data flow |
| Implement Tier 3 Hermes Skills Compiler (`POST /skills/compile`) | Lead-Backend | Done | Compiles feedback into YAML |
| Implement Nebius Serverless Overnight Scout job | Lead-Backend | Done | Background CVE crawler |
| **[BLOCKING EXIT]** Complete full execution cycle end-to-end | Lead-Backend | Done | Tested via TestClient |

---

### Phase 4: Red-Team Verification, Polishing & Benchmarks (Days 14–15)
| Task | Owner | Status | Notes |
| :--- | :--- | :--- | :--- |
| Run automated end-to-end regression tests | Both | Done | Live and fallback modes verified |
| Verify FinOps benchmark calculations (>80% cost savings) | Lead-Backend | Done | Telemetry validated (~82% savings) |
| Remove wobbly 3D tilts and sheens from web UI cards | Lead-Frontend | Done | `TiltCard.tsx` and `Magnetic.tsx` flattened |
| Harden git hygiene (`.gitignore` & `.env.example`) | Lead-Backend | Done | Zero key leakage guarantee |

---

### Phase 5: Standalone Desktop IDE, Arbitrary Codebase Ingestion & BYOK (Days 15–16)
| Task | Owner | Status | Notes |
| :--- | :--- | :--- | :--- |
| Scaffold Electron desktop application in `desktop/` | Both | Done | Antigravity / VS Code luxury craft |
| Native folder picker with 2-level recursive scanning | Lead-Backend | Done | Detects `frontend/`, `backend/` manifests |
| Dynamic `workspace_context` ingestion in FastAPI router | Lead-Backend | Done | Overrides titan memory with chosen repo |
| Bring-Your-Own-Key (BYOK) manager with local `.env` persistence | Lead-Backend | Done | `GET /api/v1/settings/keys`, `POST /api/v1/settings/keys` |
| Native OpenShell Sandbox defense panel & attack test | Both | Done | Sub-15ms attack interception in Desktop IDE |
| One-click Windows launch and build scripts | Both | Done | `launch-desktop.bat` & `build-installer.bat` |
| Integrate Context.dev SDK client for web scraping/search | Lead-Backend | Done | `context_client.py` & `/api/v1/context` |
| **[BLOCKING EXIT]** Unpacked standalone executable verified | Both | Done | `desktop/dist/win-unpacked/HermesShield IDE.exe` |

---

## 2. Blockers Log

| Date | Blocker Description | Impact | Status | Resolution |
| :--- | :--- | :--- | :--- | :--- |
| 2026-10-24 | Nemotron empty output on low token budgets | High | Closed | Adjusted max_tokens to accommodate reasoning tokens before synthesis. |
| 2026-10-24 | Project Titan anchoring during custom folder audits | Medium | Closed | Added explicit Workspace Context override in system prompt & dynamic prompt bindings. |
| 2026-10-24 | `NameError: memory_text` in agent runner | Critical | Closed | Scoped `memory_text` prior to Airlock/Nemotron synthesis calls. |

---

## 3. Decisions Log

| Date | Decision Made | Rationale | Doc Updated? |
| :--- | :--- | :--- | :--- |
| 2026-10-15 | App Name locked to `HermesShield` | Exact branding required across all documentation and interfaces. | PRD, TRD, Design, Schema, Rules |
| 2026-10-15 | Lock Next.js 14 App Router + Tailwind CSS | Maximizes developer velocity and rich dark-mode UI control. | TRD §2.1, Design §1 |
| 2026-10-15 | Disallow LangChain, LlamaIndex, CrewAI | Pure async Python provides full transparency and FinOps control. | PRD §3, TRD §2.2, Rules §3 |
| 2026-10-15 | Enforce local SQLite + file persistence | Eliminates external cloud DB dependencies for frictionless judge evaluation. | TRD §2.2, Schema §4 |
| 2026-10-15 | Add 24-hour SHA-256 SQLite caching for Tavily | Prevents exhausting 1,000 free researcher credits during hackathon testing. | TRD §3, Schema §4 |
| 2026-10-15 | Implement Zero-Crash Fallback Mode | Guarantees demo never crashes if API keys are unconfigured or rate-limited. | PRD §7, TRD §6, Rules §6 |
| 2026-10-15 | Add Read/Write Endpoints (`/security/state`, `/memory`) | Supports initial state rendering and in-place `MEMORY.md` editing for Tabs 3 & 4. | Schema §2, §5 |
| 2026-10-15 | Harden OpenShell & standardize `NEMOCLAW_POLICY_EXFIL` | Rejects chaining operators, checks all tokens, and unifies rule ID. | ImplementationPlan §3.3, AppFlow §4, Schema §5.3, Design §4.2 |
| 2026-10-15 | Enforce GitHub-relative documentation links | Ensures markdown file navigation functions on GitHub without broken local machine paths. | PRD, TRD, Schema, ImplementationPlan, Rules |
| 2026-10-15 | Lock `TAVILY_SEARCH_DEPTH = "basic"` | Conserves Tavily Free Researcher credits (1 credit/search instead of 2). | TRD §4, ImplementationPlan §3.2 |
| 2026-10-15 | Adopt Anti-Slop Design Taste System & 5-Pillar Animation Stack | Enforces Linear/Stripe craft with GSAP 3D Tilt, Lenis, Radix, cmdk, and Framer Motion. | Design, TRD §2.1, Schema §1, ImplementationPlan, .agents/skills/design-taste |
| 2026-10-24 | Build Standalone Electron Desktop IDE (`desktop/`) | Provides daily developer workspace with native folder picker and zero-distraction dark craft. | PRD, TRD, AppFlow, Tracker |
| 2026-10-24 | Implement 2-Level Recursive Scanner for Arbitrary Codebases | Detects nested packages in `frontend/`, `backend/`, `engine/` without crashing on `node_modules`. | TRD, Schema, Tracker |
| 2026-10-24 | Flatten 3D tilts and cursor jitter to professional anti-slop standard | Removed distracting wobbles from `TiltCard.tsx` and `Magnetic.tsx` for luxury calm aesthetics. | Design, CHANGELOG, Tracker |
| 2026-10-24 | Add Bring-Your-Own-Key (BYOK) Local Vault (`/settings/keys`) | Guarantees user keys remain private locally without public repository leak risk. | PRD, TRD, Schema, Tracker |
| 2026-10-24 | Integrate Context.dev Client for Search & Scraping | Expands web data acquisition beyond Tavily with `context.dev` official SDK. | TRD, AGENTS.md, Tracker |
