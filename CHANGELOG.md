# Changelog — HermesShield UI Redesign

## [Phase 1: Sections 1 & 2 (Navbar + Hero) & Foundation Architecture] — 2026-10-19

### Added
- **Centralized Content Store (`frontend/src/content/content.ts` & `frontend/content/content.ts`):**
  - Single source of truth for all copy, links, metrics, presets, and roadmap items so non-technical teammates can edit text in one place.
- **Section 1: Navbar (`frontend/src/components/sections/Navbar.tsx`):**
  - High-density single-line layout aligned with the 1200px container.
  - Logo with green status dot, navigation links (*Overview*, *How it works*, *Airlock*, *Cost*, *Live demo*), `⌘K` search trigger, and primary *"Launch console"* button.
  - Relocated *"Offline Simulation / Nemotron Live"* status indicator out of the navbar and directly into the live interactive console panel.
  - Glassmorphic blur on scroll (`scrollY > 20`).
  - Accessible mobile hamburger navigation drawer with AnimatePresence transition.
- **Section 2: Hero (`frontend/src/components/sections/Hero.tsx`):**
  - High-contrast 2-line headline in Space Grotesk: *"Personal AI that stays private."* with *"private."* styled as an italic serif accent in NVIDIA Green (`#76B900`).
  - Plain-English 2-sentence subtext with >=16px text and >=75% contrast.
  - Dual CTAs: Primary magnetic *"Launch console"* (NVIDIA Green with hover glow) and Ghost *"Simulate an attack"* (with subtle cyber-red hint).
  - Trust row highlighting NVIDIA NemoClaw, Nebius Token Factory, NVIDIA Nemotron, and Tavily Search.
- **Lightweight Hero Mesh (`frontend/src/components/ui/HeroMesh.tsx`):**
  - Canvas-based particle/mesh background featuring subtle NVIDIA Green and Cyan ambient light nodes.
  - Fully supports `prefers-reduced-motion` with an automatic static gradient fallback.

### Changed
- **Design Tokens & Theme (`frontend/tailwind.config.js` & `frontend/src/app/globals.css`):**
  - Base canvas switched to near-black (`#07090D`) with a subtle 28px dot grid pattern.
  - Primary accent standardized to NVIDIA Green (`#76B900`), secondary to Cyan (`#22D3EE`), threat to Red (`#EF4444`), and warning to Amber (`#F59E0B`).
  - Typography updated to Space Grotesk for headings, Inter for UI body text, Geist Mono for code/metrics, and Instrument Serif for italic emphasis.
  - Eliminated `[ SQUARE BRACKET ]` styling in favor of modern pill badges.
- **Root Layout (`frontend/src/app/layout.tsx`):**
  - Added preconnected Google Font stylesheets for Space Grotesk, Inter, Instrument Serif, and Geist Mono.

## [Deployment Readiness: Vercel (Frontend) & Render (Backend)] — 2026-10-19

### Added
- **Render Deployment Blueprint (`render.yaml`):**
  - Pre-configured Render Blueprint with Python 3.11, auto-installation of `backend/requirements.txt`, dynamic `$PORT` binding with `uvicorn`, and health check pointing to `/health`.
- **404 Route (`frontend/src/app/not-found.tsx`):**
  - Styled with zero-trust cyber aesthetic, Space Grotesk headline, and navigation fallback.
- **Frontend Environment Specification (`frontend/.env.example`):**
  - Documents `NEXT_PUBLIC_API_URL` pointing to Render backend for Vercel builds.

### Changed
- **Backend CORS & Health Endpoints (`backend/main.py`):**
  - Expanded CORS middleware to dynamically authorize all Vercel domains via `allow_origin_regex=r"https://.*\.vercel\.app"` and optional `FRONTEND_URL`.
  - Added explicit root `GET /` and `GET /health` routes returning HTTP 200 for cloud health checks and load balancers.
  - Enabled dynamic `PORT` environment variable support for cloud PaaS runtimes.
- **Root Layout SEO Metadata (`frontend/src/app/layout.tsx`):**
  - Configured complete OpenGraph, Twitter card, and search engine metadata for hackathon showcase.

