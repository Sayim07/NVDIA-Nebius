# PRD.md — Product Requirements Document: HermesShield

> **Mandatory Branding Rule:** The exact application name is **HermesShield**. This exact string must be used everywhere without exception: UI headers, browser window/tab titles, README files, API metadata, logging schemas, and all internal documentation. No abbreviations (e.g., "HS"), prefixes, or alternate casings are permitted.

---

## 1. Problem Statement
Technical founders, software engineers, and engineering managers want an always-on Personal AI Agent capable of indexing their local workspace (meeting notes, source code, pull request diffs, `.env` files, and architecture diagrams) while utilizing live web search to investigate Common Vulnerabilities and Exposures (CVEs), library updates, competitor releases, and technical documentation.

However, existing agentic solutions suffer from two fatal vulnerabilities that block real-world adoption:
1. **The Security & Privacy Loophole:**
   - **Prompt Injection & Secret Exfiltration:** Malicious instructions embedded in live web pages or external issue trackers can hijack agent execution, coercing it into reading local files (e.g., `~/.ssh/id_rsa`, `.env`) and exfiltrating credentials through outbound HTTP requests or terminal commands.
   - **Search Query PII Leakage:** Standard personal agents forward raw user workspace context directly to external search APIs, inadvertently leaking confidential project codenames, private repository paths, internal staging URLs, employee emails, and API keys to third-party providers.
2. **Workflow Amnesia:**
   - Stateless agents do not compound operational knowledge. When an engineer specifies formatting rules, security verification steps, or architectural constraints (e.g., *"always inspect CVE databases for FastAPI dependencies and output a Markdown comparison table"*), standard agents forget this context in the subsequent session rather than compiling it into persistent, sandboxed, reusable local skills.

---

## 2. Goals (Scoped for 16-Day Hackathon Cycle)
- **Zero-PII Tavily Airlock:** Intercept all outgoing web search intents, sanitize PII/internal secrets via deterministic regex and Tier 1 Nemotron parsing in under 250ms, and display real-time visual side-by-side verification in the UI.
- **Out-of-Process OpenShell & NemoClaw Sandbox:** Enforce declarative least-privilege policies (`config/nemoclaw-policy.yaml`) on all filesystem read/write and subprocess operations, terminating dangerous commands in under 15ms.
- **Persistent Hermes Memory & Self-Writing Skills:** Maintain human-readable episodic memory (`data/MEMORY.md` + SQLite) and automatically compile user feedback/corrections into structured YAML skills (`data/skills/*.yaml`) executed by Tier 2/3 Nemotron models.
- **3-Tier FinOps Routing on Nebius Token Factory:** Dynamically route requests across NVIDIA Nemotron tiers (Nano/Lightning, Super, Ultra) to demonstrate an 80%+ reduction in inference spend compared to monolithic frontier model calls.
- **Single-Click Hackathon Evaluation Experience:** Provide pre-seeded workspace manifests, 3 instant evaluation presets, a 1-click Red-Team prompt injection attack simulator, and a zero-crash offline fallback mode.

---

## 3. Non-Goals (Explicit "Do NOT Build" Scope Boundaries)
To ensure delivery within 16 days and prevent scope creep, the following items are strictly out of scope:
- **Do NOT Build LangChain / LlamaIndex / CrewAI / AutoGen Pipelines:** No heavyweight agent abstraction frameworks. All agentic loops, prompt constructions, and API calls must be explicit, pure async Python using `openai` (AsyncOpenAI) and `tavily-python`.
- **Do NOT Build User Authentication / Multi-Tenancy:** No JWT auth flows, Supabase Auth, Clerk, login modals, or role-based access control (RBAC). The application is a local, sovereign personal executive dashboard running in single-user mode.
- **Do NOT Connect External Production Databases:** No PostgreSQL, MongoDB, Redis, or cloud vector stores. All persistence is strictly local via SQLite (`data/hermesshield.db`) and local markdown/YAML files.
- **Do NOT Support Arbitrary Cloud Deployments / Docker Swarm / Kubernetes:** No complex multi-node orchestration. Deployment targets are local bare-metal (`localhost:3000` / `localhost:8000`) and stateless Nebius Serverless Endpoints.
- **Do NOT Build Full Email / Slack / Calendar Daemon Syncs:** No live OAuth integration with Gmail, Slack, or Google Calendar. All workspace inputs are simulated via local structured JSON/Markdown files in `data/workspace/`.
- **Do NOT Support Interactive Shell PTY Terminals:** OpenShell executes discrete sandboxed commands with immediate stdout/stderr interception; it does not implement a full terminal emulator (e.g., `xterm.js` or bash interactive PTY).

---

## 4. Target Users and Stakeholders
- **Primary User:** Software engineers, technical leads, and founders seeking an automated sovereign executive assistant that monitors local repos and browses the live web without risking secret leaks.
- **Hackathon Judges (NVIDIA & Nebius):** Evaluating token efficiency, multi-tier Nemotron routing, FinOps telemetry, OpenShell sandboxing, and autonomous skill compilation.
- **Hackathon Judges (Tavily):** Evaluating novel search architecture, privacy preservation, source extraction quality, query sanitization, and intelligent local caching.

---

## 5. Core Features (Prioritized P0 / P1 / P2)

| Priority | Feature Module | Description | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **P0** | **Tavily Privacy Airlock** | Two-stage PII/secret sanitizer for all outgoing search queries using regex and Tier 1 Nemotron. | Blocks emails, keys, internal domains; displays side-by-side diff card in UI; searches live web; extracts markdown; caches queries in SQLite for 24h. |
| **P0** | **NemoClaw & OpenShell Sandbox** | Out-of-process subprocess and file execution guard enforcing `config/nemoclaw-policy.yaml`. | Intercepts blocked commands in <15ms; blocks access to `.env`, `.ssh`, and unauthorized network calls; logs security events to SQLite. |
| **P0** | **3-Tier Nemotron Routing** | Dynamic routing across Nano/Lightning, Super, and Ultra tiers via Nebius Token Factory gateway. | Sub-250ms scrubbing (Tier 1), deep synthesis (Tier 2), and YAML skill generation (Tier 3); displays real-time FinOps & latency telemetry HUD. |
| **P0** | **Hermes Persistent Memory & Workspace Ingestion** | Reads `data/MEMORY.md` and local workspace files to personalize briefings and technical synthesis. | Ingests mock workspace manifests; updates episodic memory; renders synthesized markdown briefing in UI. |
| **P1** | **Hermes Skills Compiler** | Natural language user feedback compilation into structured YAML skills stored in `data/skills/`. | Compiles correction into valid YAML schema; persists file to disk; executes saved skill deterministically on subsequent runs. |
| **P1** | **Interactive Red-Team Attack Simulator** | Single-click UI button triggering a simulated prompt injection exfiltration payload. | Triggers malicious `cat ~/.env && curl ...` payload; verified blocked by OpenShell; displays instant red security alert in UI. |
| **P1** | **Zero-Crash Fallback System** | Autonomous fallback mode activating when `NEBIUS_API_KEY` or `TAVILY_API_KEY` is missing or rate-limited. | Returns valid mock payloads with `"is_fallback": true`; guarantees zero HTTP 500 crashes during judge evaluation. |
| **P2** | **Nebius Serverless Overnight Scout** | Asynchronous background scout endpoint simulating off-hours automated dependency monitoring. | `POST /api/v1/jobs/overnight-scout` runs async task, searches CVEs via Airlock, and outputs timestamped briefing to `data/briefings/`. |
| **P2** | **FinOps Comparison Benchmark Card** | Visual metrics card comparing multi-tier Nemotron routing costs against monolithic frontier models. | Displays calculated cost savings (>80%), token usage breakdown, and cumulative latency numbers. |

---

## 6. Success Metrics
- **PII Scrubbing Precision & Recall:** 100% of standard credential patterns (`AKIA...`, `BEGIN PRIVATE KEY`, `.env` tokens, `@internal.corp` emails) scrubbed prior to dispatching Tavily HTTP requests.
- **Airlock Scrubbing Latency:** Tier 1 Nemotron + regex sanitization completed in ≤ 250ms.
- **OpenShell Enforcement Latency:** Policy violation interception completed in ≤ 15ms.
- **FinOps Efficiency:** Measured cost reduction ≥ 80% compared to monolithic frontier model routing ($1.00/1M tokens baseline).
- **Zero Evaluation Failures:** 100% successful demo executions under missing, invalid, or exhausted API keys via the deterministic fallback engine.

---

## 7. Key Risks and Mitigations

| Risk | Impact | Mitigation Strategy | Reference Section |
| :--- | :--- | :--- | :--- |
| **External API Rate Limits or Outages** | Judge demo breaks during live review due to Tavily or Nebius API limits. | Implement deterministic regex scrubber and pre-seeded mock responses; return `"is_fallback": true`. | See [TRD.md §6](./TRD.md#6-zerocrash-fallback--fault-tolerance-architecture) & [Schema.md §5](./Schema.md#5-rest-api-contracts) |
| **Tavily Credit Depletion** | Hackathon testing exhausts 1,000 free researcher credits. | Implement SHA-256 query hashing with a 24-hour persistent SQLite cache (`tavily_cache` table). | See [TRD.md §3](./TRD.md#3-data-sources--external-services-catalog) & [Schema.md §4](./Schema.md#4-database-schema-sqlite-datahermesshielddb) |
| **Prompt Injection Exfiltration** | Malicious content in fetched web pages attempts to execute shell commands to read secrets. | OpenShell supervisor enforces strict whitelist sandboxing out-of-process via `config/nemoclaw-policy.yaml`. | See [TRD.md §2](./TRD.md#2-technical-stack--architectural-justification) & [AppFlow.md §4](./AppFlow.md#4-red-team-attack-simulation-flow) |
| **Hallucinated YAML Skills** | LLM generates malformed or unparseable YAML when compiling user workflow corrections. | Tier 3 Nemotron Ultra output validated against strict Pydantic `HermesSkillSchema`; rejected if validation fails. | See [Schema.md §3](./Schema.md#3-file-based-storage-schemas) & [Rules.md §4](./Rules.md#4-non-negotiable-technical-rules) |

---

## 8. Deliverables Checklist
- [ ] Root `LICENSE` file containing the standard open-source MIT License text.
- [ ] Root `README.md` featuring architecture diagrams, quickstart instructions, and live demo links.
- [ ] Python FastAPI backend application located in `backend/` with full Pydantic v2 schemas.
- [ ] Next.js 14 frontend dashboard located in `frontend/` featuring dark-mode cyber HUD styling.
- [ ] Declarative NemoClaw policy configuration file located in `config/nemoclaw-policy.yaml`.
- [ ] Persistent storage files: `data/MEMORY.md`, `data/hermesshield.db`, and `data/skills/`.
- [ ] Test suite containing automated unit tests for regex sanitization, policy enforcement, and fallback modes.
- [ ] Pre-recorded 3-minute high-definition walkthrough demo video.
