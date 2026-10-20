# Changelog — HermesShield UI Redesign

## [Phase 2: "Paper & Forest" Light Theme & Stripe/Linear Aesthetic Redesign] — 2026-10-20

### Added
- **Paper & Forest Design System Tokens (`frontend/tailwind.config.js` & `frontend/src/app/globals.css`):**
  - Warm paper canvas (`#F7F7F4`), clean surfaces (`#FFFFFF`, `#EEF1EC`), deep ink typography (`#0F1A17`, muted `#56625E`), and Forest Green primary (`#0B6E4F`, hover `#095A41`).
  - NVIDIA Lime (`#76B900`) reserved for dots, badges, and status indicators.
  - Dark container token (`#0E1F1A`) reserved exclusively for the Live Console and Get Started code block.
  - Soft multi-stop shadows (`0 1px 2px rgba(15,26,23,.06)` and `0 8px 24px rgba(15,26,23,.06)`) replacing dark glow effects.
  - Thin scroll progress bar in Forest Green (`#0B6E4F`) fixed at the top of the viewport.
- **Paper & Forest Navbar (`frontend/src/components/sections/Navbar.tsx`):**
  - Single-line non-wrapping header with white glassmorphic blur on scroll (`scrollY > 16`).
  - Shield mark icon + "HermesShield" logo (removed "°").
  - Clean sentence-case navigation links (*How it works*, *Features*, *Airlock*, *Savings*, *Live demo*).
  - Compact `[⌘K]` search icon button and Forest Green *"Try the demo"* primary CTA.
- **Paper & Forest Hero (`frontend/src/components/sections/Hero.tsx`):**
  - Pill badge with lime dot: *"Nebius x NVIDIA Global AI Hackathon · Personal AI track"*.
  - Sentence-case headline in Inter Tight: *"A personal AI assistant that keeps your secrets secret."* with a single italic Instrument Serif accent word (*secret.*).
  - Plain-English 2-sentence subtext with max 65 characters per line (WCAG AA compliant contrast).
  - Dual CTAs: Magnetic *"Try the demo"* and *"Watch the attack get blocked"*.
  - Real browser window mockup with window controls and side-by-side privacy diff (*"What your AI wanted to search"* vs *"Cleaned query sent to Tavily"*).
  - Clean trust row highlighting NVIDIA NemoClaw, Nebius Token Factory, NVIDIA Nemotron, and Tavily.
- **SEO & Social Assets:**
  - Dynamic OpenGraph generator (`frontend/src/app/opengraph-image.tsx`) in Paper & Forest theme.
  - SVG shield favicon (`frontend/src/app/icon.svg`).
  - Canonical URL set to `https://nvdia-nebius.vercel.app`.

### Removed (Anti-Slop Cleanup)
- Removed all `[ SQUARE BRACKET ]` labels and `01 //` numbering.
- Removed neon green on black, heavy drop-shadows, and background text gradients.
- Removed repetitive layer tags and AI jargon across all copy.
- Removed the "°" degree symbol from the brand name.

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

