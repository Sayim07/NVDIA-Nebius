# HermesShield

> **The Self-Learning, Zero-Trust Personal AI Executive & Deep Web Scout**  
> Built on **NVIDIA NemoClaw for Hermes Agent**, **OpenShell**, **Nebius Token Factory (3-tier Nemotron routing)**, and a **Privacy-Preserving Tavily Airlock**.

---

## 1. Executive Summary & Why HermesShield Wins

**HermesShield** addresses the critical security and memory roadblocks preventing developers and technical leaders from connecting personal AI agents to local workspaces and the live web:

1. **Zero-PII Tavily Airlock ($3,000 Best Use of Tavily Target):** Intercepts all outgoing search intents, scrubbing internal project codenames, staging URLs, emails, and secrets using deterministic regex and **Tier 1 Nemotron Nano** (`nvidia/nemotron-3-nano-30b-a3b` on Nebius Token Factory) in <250ms with visual side-by-side verification.
2. **NVIDIA NemoClaw & OpenShell Sandboxing (Personal AI Track Target):** Out-of-process execution supervisor enforcing declarative policies (`config/nemoclaw-policy.yaml`), intercepting unauthorized filesystem reads (`.env`, `id_rsa`) and network exfiltration attempts in <15ms.
3. **Persistent Hermes Memory & Self-Writing Skills:** Compounds user feedback across sessions by compiling corrections into reusable, user-auditable YAML skills (`data/skills/*.yaml`) executed deterministically by **Tier 2/3 Nemotron models**.
4. **FinOps & Latency Telemetry HUD:** Demonstrates over **80% cost reduction** by intelligently routing between Nemotron Nano, Super, and Ultra tiers on Nebius Token Factory rather than dispatching monolithic frontier calls.
5. **Zero-Crash Evaluation Mode:** Automatically degrades to deterministic regex sanitization and pre-seeded mock responses (`"is_fallback": true`) if API keys are unset or rate-limited.

---

## 2. Competitive Differentiation: Why HermesShield vs Cursor, Antigravity & Copilot

While tools like **Cursor**, **Copilot**, and **Antigravity** focus purely on *code generation* (writing functions and autocompleting syntax), **HermesShield operates as a Zero-Trust AI Architect & Security Shield**:

| Feature / Dimension | Cursor / Copilot / Standard AI IDEs | HermesShield Zero-Trust Executive IDE |
| :--- | :--- | :--- |
| **Web Search Privacy** | Raw code snippets, internal URLs, and repo names are sent directly to external search APIs. | **Two-Stage Privacy Airlock:** Regex scrubbing + NVIDIA Nemotron-3 Nano (Tier 1) extracts *only* abstract package keywords before searching Tavily/Context.dev. |
| **Terminal / Agent Execution** | Unrestricted terminal access with risk of prompt injection executing malicious commands. | **OpenShell Deterministic Guard:** Whitelist of read-only commands; sub-15ms blocking of command chaining (`&&`, `|`), destructive actions (`rm`), and secret exfiltration. |
| **Token Cost Economics** | Dispatches all queries to monolithic frontier models ($3–$15 / 1M tokens). | **Dynamic 3-Tier NVIDIA Router:** Tier 1 (Nano 30B) for scrubbing + Tier 2 (Super 120B) for synthesis. **Proven ~82% token cost reduction** with live FinOps telemetry. |
| **Local Codebase Ingestion** | Often requires uploading codebase or indexing on third-party cloud servers. | **100% Sovereign Local Scanning:** Native OS folder picker scans local directories (with recursive subfolder detection) entirely on-device. |
| **API Key Security (BYOK)** | Hardcoded keys or centralized account billing that can run up unexpected charges. | **Bring-Your-Own-Key (BYOK) Manager:** Encrypted local `.env` storage with masked UI inputs and zero-cost offline fallback protection. |
| **Dependency Audits** | Blindly suggests upgrading packages without vulnerability rollback planning. | **Executive CVE Matrix + Mandatory Rollback Plan:** Detailed vulnerability tables cross-referenced with live Mitre advisories and automated rollback steps. |

---

## 3. Architecture Overview

```
+----------------------------------------------------------------------------------------------------+
|                                    HermesShield Client Interfaces                                  |
|                                                                                                    |
|    +------------------------------------------+    +------------------------------------------+    |
|    |      HermesShield Desktop IDE (Electron) |    |     HermesShield Web Console (Next.js)   |    |
|    | - Native Directory Picker (Arbitrary Repos)|  | - Executive Architecture Sync            |    |
|    | - Antigravity / VS Code Dark Craft       |    | - Real-time FinOps Telemetry HUD         |    |
|    | - Bring-Your-Own-Key (BYOK) Privacy Hub  |    | - Full Interactive Red-Team Sandbox HUD  |    |
|    | - Live OpenShell Attack Defense Simulator|    | - Hermes Memory & Self-Writing Skills    |    |
|    +--------------------+---------------------+    +--------------------+---------------------+    |
+-------------------------|-----------------------------------------------|--------------------------+
                          | HTTP / REST (Port 8000)                       |
                          +-----------------------+-----------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|                                FastAPI Agent Runtime (Python 3.11+)                                |
|                                                                                                    |
|  +---------------------------+  +---------------------------+  +--------------------------------+  |
|  |   Privacy-Preserving      |  |    Dynamic 3-Tier Router  |  |    OpenShell Deterministic     |  |
|  |     Tavily Airlock        |  |  (Nebius Token Factory)   |  |          Sandbox Guard         |  |
|  |  (Regex + Nemotron Nano)  |  |  Nano 30B -> Super 120B   |  |  (Sub-15ms Policy Enforcement) |  |
|  +-------------+-------------+  +-------------+-------------+  +---------------+----------------+  |
|                |                              |                                 |                  |
|                |                              |                                 |                  |
|  +-------------+-------------+  +-------------+-------------+  +----------------+---------------+  |
|  | Context.dev Web Pipeline  |  | FinOps Accounting Engine  |  | Local SQLite Caching & Memory  |  |
|  | (Live Search & Scraping)  |  | (80%+ Cost Reduction Calc)|  | (tavily_cache, security_events)|  |
|  +---------------------------+  +---------------------------+  +--------------------------------+  |
+----------------------------------------------------------------------------------------------------+
```

---

## 4. Technology Stack

- **Desktop IDE:** Electron, Node.js, HTML5/CSS3 (Antigravity/VS Code luxury dark palette), Native File System IPC Bridge, `electron-builder`.
- **Web Console:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, GSAP (`@gsap/react`), Lenis smooth scrolling, `cmdk` (Global Command Palette), Lucide React.
- **Backend Runtime:** Python 3.11+, FastAPI, Uvicorn, Pydantic v2, PyYAML, `openai` (`AsyncOpenAI`), `tavily-python`, SQLite3.
- **AI Gateways:** Nebius Token Factory (`https://api.tokenfactory.nebius.com/v1` featuring `nvidia/Nemotron-3-Nano-30B-A3B` and `nvidia/Nemotron-3-Super-120B-A12B`), Tavily Search & Extract API, Context.dev API (`context.dev` SDK).

---

## 5. Quickstart & Installation Guide

### 5.1 Clone & Environment Setup
```bash
git clone https://github.com/Sayim07/NVDIA-Nebius.git
cd NVDIA-Nebius
```

> [!NOTE]
> All personal secrets are strictly ignored via `.gitignore`. You can inspect `backend/.env.example` for all configurable variables.

### 5.2 Launching the Backend
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

### 5.3 Launching the Desktop IDE (Recommended for Developers)
The Desktop IDE provides native folder scanning for any arbitrary local repository and in-app Bring-Your-Own-Key configuration.

**One-Click Launcher (Windows):**
Double-click `launch-desktop.bat` in the repository root, or run:
```bash
.\launch-desktop.bat
```

**Packaging Standalone Executable:**
To create an installer or portable executable (`HermesShield IDE.exe`):
```bash
.\build-installer.bat
```
The output executable is generated at `desktop/dist/win-unpacked/HermesShield IDE.exe`.

### 5.4 Launching the Web Console
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Cloud Deployment Guide (Frontend: Vercel | Backend: Render)

Deploying the Next.js frontend to **Vercel** and the FastAPI backend to **Render** is the recommended production architecture:

### 6.1 Backend Deployment on Render (FastAPI)
1. Fork or push this repository to GitHub.
2. Sign in to [Render](https://dashboard.render.com).
3. Click **New +** → **Blueprint** and select your repository (or choose **Web Service**).
   - Render automatically reads [`render.yaml`](./render.yaml).
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/health`
4. In the Render Dashboard under **Environment**, add your secret keys:
   - `NEBIUS_API_KEY`: Your Nebius Token Factory API Key
   - `TAVILY_API_KEY`: Your Tavily Search API Key
   - `CONTEXT_DEV_API_KEY`: Your Context.dev API Key (optional)
   - `FRONTEND_URL`: `https://your-project.vercel.app` (optional, CORS allows all `*.vercel.app` automatically)
5. Deploy the service and copy your public URL (e.g., `https://hermesshield-api.onrender.com`).

### 6.2 Frontend Deployment on Vercel (Next.js 14)
1. Sign in to [Vercel](https://vercel.com) and click **Add New...** → **Project**.
2. Select your repository.
3. In the configuration screen:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** Click `Edit` and select `frontend`
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g. `https://hermesshield-api.onrender.com`)
5. Click **Deploy**. Vercel will build the optimized production bundle with global CDN edge distribution.

---

## 7. Hackathon Evaluation Presets & Workflows

### Desktop IDE Workflows:
1. **Choose Any Local Workspace:** Click *"Select Project Folder"* to browse to any local project (e.g., `Avnex`, `AgentX`, or any React/Python repo). The recursive scanner automatically indexes package manifests across subdirectories.
2. **One-Click Recipe Cards:**
   - **Architecture Sync:** Deep dependency analysis + live Mitre/CVE check.
   - **PR Review:** Security verification before merging.
   - **Deep Scout:** External threat scouting without secret leaks.
3. **Safety Shield & Privacy Hub:** Live inspection of the Airlock redaction rules and interactive OpenShell sandbox defense simulator.
4. **Bring Your Own Key (BYOK):** Seamlessly configure and test your own Nebius, Tavily, and Context.dev keys in-app.

### Web Console Workflows:
1. **Executive Workspace:** Audits pre-defined manifests (Titan, Apollo) with side-by-side diff telemetry.
2. **OpenShell & NemoClaw Security HUD:** Click *"Simulate Prompt Injection Attack"*; OpenShell intercepts the malicious exfiltration command in <15ms with full audit event logging.
3. **Skill Studio:** Review and compile autonomous Hermes YAML skills compounding operational knowledge.

---

## 8. Project Documentation
- [PRD.md](./brain/PRD.md) — Product Requirements Document (Updated for Desktop IDE & BYOK)
- [TRD.md](./brain/TRD.md) — Technical Requirements Document
- [AppFlow.md](./brain/AppFlow.md) — System Architecture & Flows
- [Design.md](./brain/Design.md) — UI/UX Specification & Anti-Slop System
- [Schema.md](./brain/Schema.md) — File, Data, & API Contracts
- [ImplementationPlan.md](./brain/ImplementationPlan.md) — Phased Execution Plan
- [Tracker.md](./brain/Tracker.md) — Development Progress & Status Board
- [Rules.md](./brain/Rules.md) — AI Coding Rules & Constraints
- [CHANGELOG.md](./CHANGELOG.md) — Detailed UI Redesign Progress

---

## 9. License
This project is open-source under the [MIT License](./LICENSE).


