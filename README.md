# Teyzix Analytics — Executive Intelligence Suite

Teyzix Analytics is a high-performance, responsive executive business intelligence (BI) and analytics platform. Built using a robust full-stack containerized architecture, it combines corporate-grade interactive data visualizations with a secure, server-side **Teyzix Intelligence Engine** to offer real-time financial auditing, cohort analysis, and trend reporting.

The application features a sleek, user-friendly interface optimized with precise layout grids, subtle ambient animations, and custom corporate telemetry graphics.

---

### 1. Install NPM Dependencies

Execute the following package manager command to restore all dependencies defined in `package.json`:

```bash
npm install
npm install --save-dev @types/react @types/react-dom

```

### 2. Configure Your Server-Side API Key (Under the Hood Execution)

The Teyzix Intelligence Engine is built around a secure server-to-server operational flow. **The client web browser is never prompted to input or expose API keys.** Instead, the backend reads your API key directly from corporate environment variables.

To configure your API Key:

1. Create a file named `.env` in the root directory.
2. Define your API key exactly like this:
   ```env
   GEMINI_API_KEY="your-private-api-key-here"
   ```
3. When the application boots, `server.ts` will pick up this key automatically from `process.env.GEMINI_API_KEY` to authenticate with the internal parsing engine.
4. _Security Notice_: This architecture ensures complete containment. Your API key remains safe on the server side and is never leaked to client browsers.

### 3. Launch the Development Server

Initiate the Express proxy backend and Vite frontend pipelines simultaneously:

```bash
npm run dev
```

Open your browser and navigate to **`http://localhost:3000`**.

---

## 💎 Feature Outline & Application Architecture

Teyzix Analytics is divided into several highly polished visual modules:

### 1. Unified Brand Experience

- **Aesthetic Splash Screen**: A premium brand entrance utilizing dynamic status milestones (e.g., executing secure handshakes, syncing regional indexes, decrypting key corporate parameters) configured to run asynchronously with background active cache loads.
- **Custom Symmetrical 3D Logo**: A mathematically perfect 3D isometric vector rendering of the interlocking "T" brand logo, featuring glowing laser paths and state pulses.
- **Double-Pane Company Info Modal**: Provides immediately accessible corporate parameters, shipment weights, operational statuses, and legal documentation with custom animated scale transitions.

### 2. High-Performance Dashboard Screens

- **Tactical Scorecards**: Tracks KPI metrics including overall Revenue, Operating Margins, Account Conversions, and Retention rates with custom color-coded status micro-indicators.
- **Recharts & D3 Visualization Suite**:
  - _Quarterly Revenue Columns_: Multi-dimensional bar charts separating division segments.
  - _System Margin Flow Chart_: Fluid line charts describing temporal developments of enterprise cash-flows.
  - _Regional Market Breakdown_: Radial candlestick segment representation pinpointing global segment concentrations.
- **Dynamic Data Tables**: Search indexing, alphabetical sorting, country categorization, pagination wrappers, and slide-out detail drawers.

### 3. Integrated Utilities & Control Panel

- **Teyzix Intelligence Copilot (AI)**: An internal chat system executing real-time analytical evaluation of performance graphs and company stats. It includes:
  - _Robust Server-Side Proxying_: Excludes CORS blockages and shields keys.
  - _Self-Healing Retry Mechanics_: Automatic double-exponential backoffs handling upstream transient 503/429 hiccups.
  - _Offline Resilience_: Graceful automatic switchover to high-fidelity logical responses when no upstream credentials are set.
- **Executive Language Translation System**: Immersive, instant translations supporting **English (Global)**, **English (India)**, **Hindi (🇮🇳 हिन्दी)**, **Japanese (🇯🇵 日本語)**, **Chinese (🇨🇳 中文)**, **German (DE)**, **French (FR)**, and **Spanish (ES)**.
- **Multi-Format Document Exports**:
  - _Excel-ready CSV Exports_: Formatted lists downloaded instantly filtered by user configurations.
  - _Bespoke Print Stylesheets (PDF/Print)_: Triggered on-demand, using custom CSS directives to hide screen layouts, sidebars, interactive controls, and optimizing layouts for physical presentation slides.
- **System Diagnostics Console**: Built-in debugging dial panels allowing live emulation of:
  - _Network latency profiles_: Broadband, Corporate LAN, and slow mobile 3G.
  - _Data State Extrema_: Simulated null-states (to check empty layouts) and simulated 500 server-error downloops.

---

## 🛠️ The Tech Stack

The application employs a professional full-stack stack designed for high throughput, type safety, and real-time responsiveness:

- **Frontend Framework**: React 18+ powered by **Vite** (for sub-millisecond bundling and cold starts).
- **Backend Server**: Node.js with **Express** (written in pure TypeScript and launched natively via `tsx`). Fully serves as an index-level API proxy for the LLM to eliminate CORS limitations and hide API keys.
- **Type Safety**: Strict **TypeScript 5.x** structure capturing shared domain types, KPI schemas, and translation structures.
- **Styling Engine**: **Tailwind CSS** utilizing direct layout classes, responsive breakpoints, light/dark transition cycles, and bespoke print layout styling rules.
- **Vector Icons**: **Lucide React** for dynamic, lightweight, scalable interface symbology.
- **Animation System**: **Motion** (React) coordinates entering/exiting micro-animations (such as the polished Teyzix Brand Splash Screen and Company Info sliding dialogs).
- **Data Visualizations**: **Recharts** & **D3** components rendering interactive multi-dimensional revenue columns, financial lines, custom sparklines, market demand metrics, and regional candlesticks.
- **AI Integration**: Official `@google/genai` TypeScript SDK for advanced reasoning models.

---

## 📐 Technical Trade-offs & Decisions

During the development of Teyzix Analytics, several intentional engineering choices were made to optimize speed, developer experience, and system security:

### 1. Server-Side API Proxying vs. Client-Side API Communication

- **Decision**: We rejected making direct Gemini API requests inside `App.tsx` or other client components. Instead, all intelligence queries are proxied via `/api/copilot` inside `server.ts`.
- **Trade-off**: This adds slight complexity (requires running an Express server alongside the frontend in production).
- **Rationale**: Protecting intellectual property and API keys is critical. Direct client-side SDK integration leaks your API key straight into the browser's Network inspector, making the app vulnerable to malicious scrapers and billing spikes.

### 2. Bundled production backend via `esbuild` vs. Raw ts-node Execution

- **Decision**: Production-ready builds use `esbuild` to package the TypeScript Express system into a single self-contained CommonJS (`dist/server.cjs`) file.
- **Trade-off**: Requires a small build complication phase when executing `npm run build`.
- **Rationale**: Bypasses slow run-time file resolution, avoids relative import path mismatches inside complex container formats, and achieves cold start times of virtually zero on production platforms like Cloud Run.

### 3. Responsive Recharts SVG Containers over Fixed Canvas Sizing

- **Decision**: Applied fluid `ResponsiveContainer` blocks wrapped in ResizeObserver-aware grids instead of hardcoded pixel sizes.
- **Trade-off**: Recharts may experience minor rendering flickering on extremely fast window resizing.
- **Rationale**: The app stays visually proportional on all screen heights, ultra-wide desktop setups, tablet monitors, and compact phone displays.

### 4. Client-Persistent Store vs. Isolated Prop Drilling

- **Decision**: Utilized a lightweight global hook state (`useDashboardStore`) to manage UI tabs, languages, chosen analytics profiles, and error overrides.
- **Trade-off**: Store state requires explicit reset controls during unit test isolation.
- **Rationale**: Completely eliminates prop-drilling across the nested component tree (modal popups, table drawers, sidebars, charts), guaranteeing 100% predictable application flows and faster rendering cycles.

---

## ⚙️ Build and Production Commands

| Command         | Action / Environment                                                                   |
| :-------------- | :------------------------------------------------------------------------------------- |
| `npm install`   | Restores local packages into `node_modules`                                            |
| `npm run dev`   | Spins up the Express API + Hot-Reload Vite interface on port 3000                      |
| `npm run build` | Bundles static frontend to `/dist` and compiles standalone server to `dist/server.cjs` |
| `npm run start` | Launches compiled production server using native lightweight Node                      |
| `npm run lint`  | Runs the TypeScript compiler check to verify code integrity                            |
