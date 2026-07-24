# FraudGuard Frontend

Real-time fraud detection dashboard built with React, TypeScript, and modern frontend tooling. Designed to connect to the FraudGuard NestJS backend for production use, with a full MSW mock layer for standalone frontend development.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | TanStack Query v5 + Zustand |
| Real-time | Socket.io-client |
| Charts | Recharts |
| Maps | React-Leaflet |
| Animations | Framer Motion |
| Mock Backend | MSW v2 (Mock Service Worker) |
| Testing | Vitest + React Testing Library |
| Routing | React Router v6 |

---

## Features

### PRD-Compliant Dashboard Views

- **Live Feed Tracker** — Real-time WebSocket cards showing flagged transactions with rule badges, risk scores, and AI indicators. Supports filtering by rule type and minimum risk score.
- **Interactive Analyst Drawer** — Side drawer with animated skeleton-to-content AI explanation, geo mini-map, metadata viewer, and vector feedback confirmation.
- **Geographic Heatmap** — Leaflet canvas rendering high-density fraud zones with color-coded intensity (green → yellow → red). Click zones to filter the feed.
- **Analyst Summary Dashboard** — Aggregate metrics cards, 24-hour time-series chart, rule distribution breakdown, and CSV export.

### Personas

| Role | Route | Access |
|------|-------|--------|
| Fraud Analyst | `/dashboard/analyst` | Full dashboard with all views |
| Compliance Officer | `/dashboard/compliance` | Audit metrics, CSV export, efficacy reports |
| Backend Developer | `/dashboard/developer` | API contracts, WebSocket events, config viewer |

### Demo Accounts

| Email | Role | Password |
|-------|------|----------|
| `admin@fraudguard.com` | Compliance Officer | any |
| `analyst@fraudguard.com` | Fraud Analyst | any |
| `dev@fraudguard.com` | Backend Developer | any |

---

## Project Structure

```
src/
├── app/
│   ├── router.tsx                  # Route definitions with role guards
│   └── providers.tsx               # Query, Socket, MSW providers
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx           # Email/password login
│   │   └── useAuthStore.ts         # Zustand auth state (persisted)
│   ├── dashboard/
│   │   ├── AnalystDashboard.tsx    # Main analyst view with tabs
│   │   ├── ComplianceDashboard.tsx # Compliance metrics & export
│   │   ├── DeveloperDashboard.tsx  # API contracts & config viewer
│   │   ├── SummaryStats.tsx        # Aggregate metric cards
│   │   └── TimeSeriesChart.tsx     # 24h detection volume chart
│   ├── live-feed/
│   │   ├── LiveFeedTracker.tsx     # WebSocket-powered card list
│   │   └── useLiveFeed.ts          # Socket.io + TanStack Query hook
│   ├── transaction-drawer/
│   │   ├── AnalystDrawer.tsx       # Side drawer with full context
│   │   ├── AiExplanationField.tsx  # Animated skeleton → text reveal
│   │   └── GeoMiniMap.tsx          # Leaflet mini-map
│   ├── geo-heatmap/
│   │   └── GeoHeatmap.tsx          # Density cluster map
│   └── vector-feedback/
│       └── ConfirmFraudButton.tsx  # True-positive confirmation flow
├── shared/
│   ├── components/
│   │   ├── AlertBadge.tsx          # Rule type badge with AI indicator
│   │   ├── RiskScoreGauge.tsx      # Visual risk score bar
│   │   └── ExportButton.tsx        # CSV download utility
│   ├── hooks/
│   │   ├── useWebSocket.ts         # Socket.io connection + reconnection
│   │   └── useCsvExport.ts         # Blob download helper
│   ├── types/
│   │   ├── transaction.ts          # Core domain types
│   │   ├── api.ts                  # API request/response types
│   │   └── socket.ts               # Socket event payload types
│   └── utils/
│       ├── risk-calculator.ts      # Risk score → color/level mapping
│       └── time-buckets.ts         # 24h time-series bucketing
├── mocks/
│   ├── browser.ts                  # MSW worker setup
│   ├── handlers.ts                 # All REST mock handlers
│   ├── seed-data.ts                # Deterministic fake transaction generator
│   ├── localStorage-adapter.ts     # Persist mock data across refreshes
│   └── worker.ts                   # MSW worker initialization
├── components/ui/                  # shadcn/ui base components
└── main.tsx                        # App entry point with MSW init
```

---

## Setup

### Prerequisites

- Node.js 22+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`. Login with any demo account.

### With Backend

When the NestJS backend is running on port 3000, the Vite proxy forwards requests automatically. Set the environment variable to disable mock mode:

```env
VITE_MOCK_MODE=false
```

### Production Build

```bash
npm run build
```

### Testing

```bash
npm run test          # Watch mode
npm run test -- --run # Single run
```

### Lint & Typecheck

```bash
npm run lint
npm run typecheck
```

---

## Backend API Contract

See [API_CONTRACT.md](./API_CONTRACT.md) for the full API contract between the frontend and backend, including all endpoints, request/response shapes, and WebSocket event definitions.

---

## MSW Mock Layer

The MSW (Mock Service Worker) layer enables full frontend development without the backend running. It simulates:

- **Auth**: `/auth/login`, `/auth/me`
- **Transactions**: CRUD for flagged transactions with filtering and pagination
- **Analytics**: Summary metrics and time-series data
- **CSV Export**: Downloadable fraud reports
- **WebSocket**: Simulated `fraud.detected` and `ai_explanation.updated` events

Mock data persists in `localStorage` under key `fraudguard_mock_db` across page refreshes.

To disable mocking and connect to a live backend, set `VITE_MOCK_MODE=false` in `.env.local`.

---

## PRD Reference

This frontend implements the requirements from [FraudDetection_PRD_v1_2](./FraudDetection_PRD_v1_2.docx), specifically:

- §10 Frontend UI Requirements (Live Feed, Analyst Drawer, Geo Heatmap, Summary Dashboard)
- §6 Functional Requirements (ingestion, hybrid detection, WebSocket telemetry)
- §7 Data Models (FlaggedTransaction entity)
- §10 User Personas (Fraud Analyst, Compliance Officer, Backend Developer)

---

## Deployment

The frontend is designed for deployment to Netlify (as specified in the PRD). Build output goes to `dist/`.
