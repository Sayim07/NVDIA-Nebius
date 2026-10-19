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

## 2. Architecture Overview

```
+---------------------------------------------------------------------------------+
|                                 HermesShield UI                                 |
|          (Next.js 14 + Tailwind CSS + GSAP 3D Tilt + Framer Motion + Lenis)     |
|   [Executive Workspace] | [Tavily Airlock] | [NemoClaw HUD] | [Skill Studio]    |
+----------------------------------------+----------------------------------------+
                                         | HTTP / JSON (Port 8000)
                                         v
+---------------------------------------------------------------------------------+
|                        FastAPI Agent Runtime (Python 3.11)                      |
|                                                                                 |
|  +-----------------------+  +----------------------+  +----------------------+  |
|  |     Tavily Airlock    |  |    3-Tier Router     |  |   OpenShell Guard    |  |
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

## 3. Technology Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, GSAP (`@gsap/react`), Lenis smooth scrolling, `cmdk` (Global Command Palette), Lucide React.
- **Backend:** Python 3.11+, FastAPI, Uvicorn, Pydantic v2, PyYAML, `openai` (`AsyncOpenAI`), `tavily-python`, SQLite3.
- **AI Gateways:** Nebius Token Factory (`https://api.tokenfactory.nebius.com/v1`), Tavily Search & Extract API.

---

## 4. Quickstart Guide

### 4.1 Prerequisites
- Python 3.11+
- Node.js 18+ (v20+ recommended)
- Optional API keys: `NEBIUS_API_KEY` and `TAVILY_API_KEY` (system runs in offline simulation mode if omitted).

### 4.2 Backend Setup
```bash
# From repository root
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt

# Start backend service
uvicorn main:app --reload --port 8000
```

### 4.3 Frontend Setup
```bash
# In a new terminal from repository root
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Cloud Deployment Guide (Frontend: Vercel | Backend: Render)

Deploying the Next.js frontend to **Vercel** and the FastAPI backend to **Render** is the recommended production architecture:

### 5.1 Backend Deployment on Render (FastAPI)
1. Fork or push this repository to GitHub.
2. Sign in to [Render](https://dashboard.render.com).
3. Click **New +** → **Blueprint** and select your repository (or choose **Web Service**).
   - Render automatically reads [`render.yaml`](./render.yaml).
   - **Root Directory:** Repository root (`.`)
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/health`
4. In the Render Dashboard under **Environment**, add your secret keys:
   - `NEBIUS_API_KEY`: Your Nebius Token Factory API Key
   - `TAVILY_API_KEY`: Your Tavily Search API Key
   - `CONTEXT_DEV_API_KEY`: Your Context.dev API Key (optional)
   - `FRONTEND_URL`: `https://your-project.vercel.app` (optional, CORS allows all `*.vercel.app` automatically)
5. Deploy the service and copy your public URL (e.g., `https://hermesshield-api.onrender.com`).

### 5.2 Frontend Deployment on Vercel (Next.js 14)
1. Sign in to [Vercel](https://vercel.com) and click **Add New...** → **Project**.
2. Select your repository.
3. In the configuration screen:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** Click `Edit` and select `frontend`
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g. `https://hermesshield-api.onrender.com`)
5. Click **Deploy**. Vercel will build the optimized production bundle with global CDN edge distribution.

---

## 6. Hackathon Evaluation Presets


The dashboard provides 3 one-click evaluation presets in the **Executive Workspace** tab:
1. **Architecture Sync & CVE Scan (Preset A):** Demonstrates local manifest ingestion, Tavily Airlock PII scrubbing, live Mitre/CVE discovery, and Tier 2 briefing generation.
2. **PR Security Review & Dependency Audit (Preset B):** Audits dependency versions against live advisories.
3. **Competitive Deep Web Scouting (Preset C):** Conducts web intelligence research with automatic company entity sanitization.

### Red-Team Attack Simulation
Navigate to the **OpenShell & NemoClaw Security HUD** tab and click **"Simulate Prompt Injection Attack"**. The OpenShell supervisor intercepts the malicious exfiltration command (`cat ~/.env && curl ...`) in <15ms, blocks access, and renders a real-time security alert banner.

---

## 7. How to Edit the Site (For Non-Technical Teammates)

All copy, external links, proof metrics, trust logos, quickstart steps, and roadmap items are centralized in a single configuration file:
👉 **`frontend/src/content/content.ts`** (also mirrored at `frontend/content/content.ts`)

You can edit this file directly without touching any React components, CSS, or backend logic:

- **Change headline, pitch, or subtext:** Edit `content.hero.titleLead`, `content.hero.titleAccent`, or `content.hero.subtext`.
- **Change links (GitHub, Devpost, Demo, Video):** Update the `content.links` object (`github`, `liveDemo`, `youtube`, `devpost`).
- **Swap the YouTube walkthrough:** Change `content.video.youtubeId` or `content.links.youtube`.
- **Update metrics:** Edit the numbers and captions in the `content.metrics` array.
- **Update roadmap or builder feedback:** Edit `content.roadmap.futureItems` or `content.roadmap.hackathonFeedback`.

### Running Locally
1. Start the FastAPI backend:
   ```bash
   cd backend && uvicorn main:app --reload --port 8000
   ```
2. Start the Next.js frontend:
   ```bash
   cd frontend && npm run dev
   ```
3. Open `http://localhost:3000` in your browser. Any edits in `content.ts` update instantly via hot reload.

---

## 8. Project Documentation
- [PRD.md](./brain/PRD.md) — Product Requirements Document
- [TRD.md](./brain/TRD.md) — Technical Requirements Document
- [AppFlow.md](./brain/AppFlow.md) — System Architecture & Flows
- [Design.md](./brain/Design.md) — UI/UX Specification & Anti-Slop System
- [Schema.md](./brain/Schema.md) — File, Data, & API Contracts
- [ImplementationPlan.md](./brain/ImplementationPlan.md) — Phased Execution Plan
- [Tracker.md](./brain/Tracker.md) — Development Progress & Decisions
- [Rules.md](./brain/Rules.md) — AI Coding Rules & Constraints
- [CHANGELOG.md](./CHANGELOG.md) — Detailed UI Redesign Progress

---

## 9. License
This project is open-source under the [MIT License](./LICENSE).


