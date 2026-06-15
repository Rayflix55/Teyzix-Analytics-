# Teyzix Analytics — Executive Intelligence Suite

Teyzix Analytics is a high-performance, responsive executive business intelligence (BI) and analytics platform. Built using a robust full-stack containerized architecture, it combines Power BI-grade data visualization with a server-side **Google Gemini AI** copilot to offer real-time financial auditing, cohort analysis, and trend reporting.

The application features a sleek, user-friendly interface optimized with precise layout grids, subtle ambient animations, and custom corporate telemetry graphics.

---

## 🚀 How to Export and Open in VSCode Locally

### 1. Launch in VSCode

1. Open **Visual Studio Code**.
2. Go to `File` > `Open Folder...` (or `Open...` on macOS) and choose your extracted project directory.
3. Open a new terminal session within VSCode by pressing `` Ctrl + ` `` (or `` Cmd + ` `` on macOS).

### 2. Install NPM Dependencies

Execute the following package manager command to restore all dependencies defined in `package.json`:

```bash
npm install
npm install --save-dev @types/react @types/react-dom
```

### 3. Create Local Environment Variables

Teyzix Analytics utilizes a server-side proxy route to keep your Google Gemini API tokens fully hidden from client web inspect.

1. Create a file named `.env` in the root directory.
2. Define your **Gemini API Key**:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```
   _(Note: If no API key is specified, the server-side controller will automatically fall back to an internal analytics agent dictionary to preserve system functionality)._

### 5. Launch the Development Server

Initiate the Express proxy backend and Vite frontend pipelines simultaneously:

```bash
npm run dev
```

Open your browser and navigate to **`http://localhost:3000/`**.

---

## 🛠️ The Tech Stack

The application employs a professional full-stack stack designed for high throughput, type safety, and real-time responsiveness:

- **Frontend Framework**: React 18+ powered by **Vite** (for sub-millisecond bundling and cold starts).
- **Backend Server**: Node.js with **Express** (written in pure TypeScript and launched natively via `tsx`). Fully serves as an index-level API proxy for the LLM to eliminate CORS limitations and hide API keys.F
- **Type Safety**: Strict **TypeScript 5.x** structure capturing shared domain types, KPI schemas, and translation structures.
- **Styling Engine**: **Tailwind CSS** utilizing direct layout classes, responsive breakpoints, light/dark transition cycles, and bespoke print layout styling rules.
- **Vector Icons**: **Lucide React** for dynamic, lightweight, scalable interface symbology.
- **Animation System**: **Motion** (React) coordinates entering/exiting micro-animations (such as the polished Teyzix Brand Splash Screen and Company Info sliding dialogs).
- **Data Visualizations**: **Recharts** & **D3** components rendering interactive multi-dimensional revenue columns, financial lines, custom sparklines, market demand metrics, and regional candlesticks.
- **AI Integration**: Official `@google/genai` TypeScript SDK for advanced reasoning models.

---

## 💎 Key Features Implemented

1.  **Professional Splash Screen**: Implemented a modern, non-blocking pre-loader with real-time status handshakes (e.g., verifying SSL nodes, caching indexes, decrypting key corporate vectors) matching the elegant Teyzix brand language.
2.  **Sleek Branding & Identifiers**: Features a customizable 3D isometric interlocking geometric SVG logo representation matching high-end tech platforms.
3.  **Detailed Company Info Modal**: Provides immediate access to specific contract values, shipment counters, health metrics, corporate info, and direct links to isolated analytical deep-dives.
4.  **Multi-Language Controller**: Full language toggle capability across **English (EN)**, **Deutsch (DE)**, **Français (FR)**, and **Español (ES)**.
5.  **Data Table Controls**: Deep search indexing, sorting, regional filters, visual page pagination, and an isolated multi-attribute drawer.
6.  **Executive Exports**:
    - **CSV Spreadsheet Export**: Downloads filtered lists of accounts into raw CSVs formatted for Microsoft Excel.
    - **PDF/HTML Document Layouts**: Triggers beautifully styled print rendering setups, adjusting paddings, page margins, and hiding interactive sidebar widgets automatically.
7.  **Simulated Operations Panel**: Built-in executive dials to test real-world scenarios: simulated network latencies (Broadband, LAN, 3G), simulated empty-data displays, and simulated 500 server-error mockdowns.

---

## 📐 Technical Trade-offs & Decisions

During the development of Teyzix Analytics, several intentional engineering choices were made to optimize speed, developer experience, and system security:

### 1. Server-Side API Proxying vs. Client-Side API Communication

- **Decision**: We rejected making direct Gemini API requests inside `App.tsx` or other client components. Instead, all intelligence queries are proxied via `/api/copilot` inside `server.ts`.
- **Trade-off**: This adds slight complexity (requires running an Express server alongside the frontend in production).
- **Rationale**: Protecting intellectual property and API keys is critical. Direct client-side SDK integration leaks the `GEMINI_API_KEY` straight into the browser's Network inspector, making the app vulnerable to malicious scrapers and billing spikes.

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
# Teyzix-Analytics-
