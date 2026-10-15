# Rules.md — Grounding Rules for AI Coding Tools: HermesShield

> **CRITICAL DIRECTIVE:** Read this file before generating any code. If a request conflicts with these rules, flag it instead of silently complying.

---

## 1. Source-of-Truth Hierarchy for Resolving Conflicts
When any ambiguity, contradiction, or conflict arises between documents, resolve it strictly according to the following descending priority order:

```
Rules.md
   │
   ▼
Schema.md
   │
   ▼
TRD.md
   │
   ▼
PRD.md
   │
   ▼
AppFlow.md
   │
   ▼
Design.md
   │
   ▼
ImplementationPlan.md
   │
   ▼
Tracker.md
```

---

## 2. Mandatory App Naming Rule
The exact name of this project is **HermesShield**.
- **User-Facing Rule:** Every header, title, browser tab, README, log banner, and API metadata field must use the exact casing: `HermesShield`.
- **Prohibited:** Never use `Hermes-Shield`, `Hermes Shield`, `HermesAgent`, `NemoShield`, `Hermes_Shield`, or abbreviations like `HS`.

---

## 3. Hard Scope Boundaries (Strict "Do NOT" List)
Any instruction or temptation to implement the following items must be actively rejected:
- **NO Heavyweight Agent Frameworks:** Do NOT introduce LangChain, LlamaIndex, AutoGen, CrewAI, or semantic-kernel. Write explicit, pure Python async functions.
- **NO External Database Engines or Auth Walls:** Do NOT introduce PostgreSQL, MongoDB, Redis, Supabase, Clerk, NextAuth, or JWT login modals. The app must run out-of-the-box locally with zero signup friction.
- **NO Terminal PTY Emulators:** OpenShell executes single sandboxed commands with immediate output capture. Do NOT attempt to build an interactive terminal (`xterm.js` / bash socket).
- **NO Live Third-Party OAuth Syncs:** Do NOT attempt to integrate live Gmail, Slack, or Google Calendar APIs. All workspace inputs are simulated via local structured manifests in `data/workspace/`.

---

## 4. Non-Negotiable Technical Rules

### Rule 1: The Privacy-Preserving Tavily Airlock Is Mandatory
- **Required Approach:** Every outgoing web search intent must pass through the Airlock (`backend/services/airlock.py`) using deterministic regex and Tier 1 Nemotron parsing before invoking the Tavily SDK.
- **Forbidden Approach:** Never make raw, unfiltered HTTP requests to search APIs directly with user workspace text.

### Rule 2: OpenShell Policy Sandboxing Must Be Enforced Out-of-Process
- **Required Approach:** Every shell or file execution command must be validated by `openshell_guard.py` against `config/nemoclaw-policy.yaml`. Denied paths (`.env`, `id_rsa`, `.ssh`) and blocked binaries must be terminated in <15ms before any subprocess execution occurs.
- **Forbidden Approach:** Never execute raw `os.system()` or `subprocess.run(shell=True)` directly on unvalidated user or LLM-generated strings.

### Rule 3: Dynamic 3-Tier Nemotron Routing with FinOps Accounting
- **Required Approach:** Route tasks across distinct Nemotron tiers on Nebius Token Factory (Tier 1 Nano/Lightning for scrubbing, Tier 2 Super for briefing synthesis, Tier 3 Ultra for skill compilation) and log all token consumption to calculate real-time cost savings (>80%).
- **Forbidden Approach:** Never route all tasks to a single monolithic model tier without telemetry tracking.

### Rule 4: Zero-Crash Fallback Guarantee
- **Required Approach:** When `NEBIUS_API_KEY` or `TAVILY_API_KEY` are unset or fail, gracefully serve pre-seeded mock responses from `data/fallback/` and flag `"is_fallback": true`.
- **Forbidden Approach:** Never return an unhandled HTTP 500 error or crash the application during judge evaluation.

---

## 5. Schema Consistency Rule
All data types, field names, and structures must strictly adhere to [Schema.md](./Schema.md).
- Do not rename fields for convenience (e.g., do not use `cost` if Schema.md specifies `total_cost_usd`).
- Do not invent extra keys in JSON responses without first updating [Schema.md §5](./Schema.md#5-rest-api-contracts).

---

## 6. Fallback and Error-Handling Protocol
1. **Network / API Failures:** Wrap all external HTTP calls (`AsyncOpenAI`, `TavilyClient`) in explicit `try...except` blocks.
2. **Fallback Activation:** Catch timeout, rate-limit (429), and authentication (401) exceptions and route execution to fallback loaders:
   - For Tavily: `data/fallback/tavily_cve_response.json`
   - For Nebius: `data/fallback/briefing_response.md`
3. **UI Warning Banner:** When `"is_fallback": true` is returned, the frontend must render an amber status indicator: `Offline Simulation Mode`.

---

## 7. Grounded Talking Points for Hackathon Evaluators

| Evaluator Question | Grounded Answer | Verification Reference |
| :--- | :--- | :--- |
| **"Why is this in the Personal AI Track instead of general agents?"** | HermesShield is a sovereign executive agent that reads private local developer workspaces while browsing the live web, solving the primary security and memory bottlenecks preventing personal agent adoption. | See [PRD.md §1](./PRD.md#1-problem-statement) |
| **"How does the Tavily Airlock protect private credentials?"** | Outgoing queries pass through a sub-250ms deterministic regex firewall and Tier 1 Nemotron scrubber, stripping emails, keys, and internal staging domains before search dispatch. | See [TRD.md §1](./TRD.md#1-architectural-overview--system-design) & [Design.md §4.1](./Design.md#41-side-by-side-tavily-airlock-diff-card) |
| **"How does OpenShell prevent prompt injection attacks?"** | Commands are evaluated out-of-process against `nemoclaw-policy.yaml`. Access to `.env` or `.ssh/id_rsa` is intercepted in <15ms before any subprocess spawns. | See [AppFlow.md §4](./AppFlow.md#4-red-team-attack-simulation-flow) & [ImplementationPlan.md §3.3](./ImplementationPlan.md#33-openshell-policy-enforcement-check) |
| **"How does Hermes compound knowledge across sessions?"** | User corrections are compiled by Tier 3 Nemotron Ultra into deterministic YAML skills stored in `data/skills/`, ensuring permanent, user-auditable operational memory. | See [Schema.md §3.2](./Schema.md#32-hermes-skill-schema-dataskillsyaml) |
| **"What proves your FinOps cost savings claim?"** | Our live FinOps HUD benchmarks dynamic 3-tier routing (Nano/Lightning, Super, Ultra) against monolithic frontier model pricing, proving >80% cost reduction. | See [TRD.md §4](./TRD.md#4-fixed-scope-constants--system-boundaries) & [Design.md §3.2](./Design.md#32-global-header--finops-hud) |

*(Note: If implementation changes, update this table immediately).*

---

## 8. Code Conventions & Standards
- **Python Backend:**
  - Strict type hints on all function signatures (`typing.Optional`, `typing.List`, `pydantic.BaseModel`).
  - Use Python standard `logging` (`logger.info`, `logger.warning`, `logger.error`). Never use bare `print()` statements in production services.
  - No hardcoded absolute file paths. Always use relative paths anchored to workspace root (`config.constants`).
  - No new database engines. Persist only to SQLite (`data/hermesshield.db`) unless logged in [Tracker.md §3](./Tracker.md#3-decisions-log).
- **TypeScript Frontend:**
  - TypeScript strict mode enabled (`"strict": true` in `tsconfig.json`).
  - All API response handling must be typed using interfaces from `frontend/src/lib/types.ts`.
  - Use Tailwind CSS utility classes; avoid inline styles.

---

## 9. "When the Coding Tool Is Unsure" Protocol
If an incoming coding task is ambiguous or underspecified:
1. **Never Silently Hallucinate:** Do not invent new packages, endpoints, or database tables.
2. **State the Ambiguity Explicitly:** State the exact question or conflict concisely.
3. **Propose the Documented Default:** Reference the relevant section in [Schema.md](./Schema.md) or [TRD.md](./TRD.md) and propose the option that strictly adheres to established contracts.

---

## 10. Definition of Done (DoD) per Feature
A feature is marked as **Done** only when:
1. It strictly conforms to the endpoint contract and schema in [Schema.md](./Schema.md).
2. It executes without raising unhandled 500 exceptions in both live and fallback simulation modes.
3. It has zero TypeScript compile errors (`npm run build` succeeds).
4. Its status is updated in [Tracker.md §1](./Tracker.md#1-project-phase-trackers).
