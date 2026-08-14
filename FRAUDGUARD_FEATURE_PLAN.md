# FraudGuard — Feature Implementation Plan

> Phased plan to add hackathon-winning fraud prevention features to the FraudGuard frontend.
> Built on existing architecture: React + TypeScript + Vite, mock backend via offlineBypass.ts/MSW, React Query, WebSocket live feed, React Flow network graph.

## Current State Audit

### Existing Features

| Feature | Location | Status |
|---------|----------|--------|
| Analyst Dashboard | src/features/analyst-dashboard/ | ✅ Implemented |
| Transaction Table | src/features/analyst-dashboard/TransactionTable.tsx | ✅ Implemented |
| Analytics Charts | src/features/analyst-dashboard/AnalyticsCharts.tsx | ✅ Implemented |
| Risk Distribution Bar | src/features/analyst-dashboard/RiskDistributionBar.tsx | ✅ Implemented |
| Network Graph | src/features/network-dashboard/FraudNetworkGraph.tsx | ✅ Implemented (React Flow) |
| Live Feed | src/features/live-feed/useLiveFeed.ts | ✅ Implemented (WebSocket + React Query) |
| Geo Heatmap | src/features/analyst-dashboard/LeafletHeatmap.tsx | ✅ Implemented |
| Rule Engine Manager | src/features/analyst-dashboard/RuleEngineManager.tsx | ✅ Implemented |
| Vector Feedback | src/features/vector-feedback/ | ✅ Implemented |
| Mock Backend (MSW) | src/mocks/handlers.ts | ✅ Implemented |
| Offline Bypass | src/mocks/offlineBypass.ts | ✅ Implemented |
| API Contract | API_CONTRACT.md | ✅ Documented |
| Shared Types | src/shared/types/fraud.ts, transaction.ts | ✅ Defined |

### Gaps vs. Winning Hackathon Ideas

| Idea | Gap |
|------|-----|
| Progressive Friction (APPROVE/FLAG/BLOCK) | No decision labels on transactions |
| Pre-Transaction Scoring | No risk score computed before API response |
| Traffic Light Framework | No Green/Yellow/Red classification UI |
| Explainable Reason Codes | aiExplanation is optional/null in types |
| Feedback Loop | No analyst feedback UI for false positives |
| ONNX Client-Side Scoring | No ML model loading in browser |
| Mule Account Detection | No flow visualization or mule-specific logic |
| Behavioral Profiling | No behavioral signal collection |

## Phase 1 - Frontend-Only Enhancements (Week 1)

**Goal:** Add fraud prevention decision framework and UI layers without touching backend or mock server.

### 1.1 Extend Shared Types

**Files:** src/shared/types/fraud.ts, src/shared/types/transaction.ts

Add new type RiskAction = APPROVE | FLAG | BLOCK | REVIEW.

Add interface PreTransactionScore with riskScore, riskAction, reasonCodes, scoredAt, modelVersion.

Update Transaction interface to include preTransactionScore?, blockedReason?, stepUpRequired?.

### 1.2 Add Traffic Light + Progressive Friction to TransactionTable

**File:** src/features/analyst-dashboard/TransactionTable.tsx

- Add riskAction column with colored badges: Green (APPROVE), Yellow (FLAG), Red (BLOCK), Orange (REVIEW)
- Add expandable row detail panel showing reasonCodes array
- Add stepUpRequired indicator (OTP/MFA prompt simulated)
- Red rows show blockedReason in the detail panel

**File:** src/features/analyst-dashboard/RiskDistributionBar.tsx

- Extend from 4-segment (LOW/MED/HIGH/CRITICAL) to include action-based segments
- Add Traffic Light legend: Green / Yellow / Red counts

### 1.3 Add Pre-Transaction Scoring Panel to AnalystDashboard

**File:** src/features/analyst-dashboard/AnalystDashboard.tsx

- Add new card component: PreTransactionScoringPanel
- Shows real-time scoring pipeline status: model version, average scoring latency, last N transactions scored vs blocked
- Uses mock data from offlineBypass.ts to simulate scores
- Displays a mini histogram of recent risk scores

### 1.4 Add Explainable Reason Codes to Mock Data

**File:** src/mocks/offlineBypass.ts

Extend mockResponse() to include preTransactionScore in /api/transactions and /api/transactions/flagged responses.

Add deterministic scoring logic based on transaction properties:
- amount > 5000 -> high_value flag
- isInternational && !isCardNotPresent -> geo_velocity flag
- deviceFingerprint changes between transactions -> new_device flag
- timeDiffSecondsFromLastTx < 60 -> velocity_spike flag

Risk action mapping:
- riskScore >= 0.8 -> BLOCK
- riskScore >= 0.5 -> FLAG
- riskScore >= 0.2 -> REVIEW
- riskScore < 0.2 -> APPROVE

### 1.5 Add Analyst Feedback UI

**File:** src/features/analyst-dashboard/TransactionTable.tsx

- Add action buttons per row: Confirm Fraud / False Positive
- On click, call existing POST /api/transactions/:id/confirm-fraud
- Update local state to reflect feedback
- Show feedback count in dashboard header

## Phase 2 - Client-Side ML Scoring & Behavioral Profiling (Week 2)

**Goal:** Add lightweight ML inference and behavioral signal collection in the browser.

### 2.1 Add ONNX Runtime Client-Side Scoring

**New dependency:** onnxruntime-web (add to package.json)

**New file:** src/lib/ml/scoringEngine.ts

- Load a pre-trained LightGBM or XGBoost model exported to ONNX format
- Expose scoreTransaction(tx): PreTransactionScore
- Run inference in a Web Worker to avoid blocking the UI thread
- Cache model in IndexedDB so it does not re-download on refresh

**New file:** src/lib/ml/worker.ts

- Initialize ONNX runtime in worker
- Listen for transaction data via postMessage
- Return risk score + action + reason codes

**Integration:** src/features/analyst-dashboard/usePreTransactionScore.ts

- React Query mutation that sends transaction to worker and returns score
- Cache scores for 30 seconds to avoid re-scoring identical transactions
- Fall back to mock deterministic scoring if worker is unavailable

### 2.2 Behavioral Profiling Collector

**New file:** src/lib/behavioral/collector.ts

Collect passive signals from the frontend session:
- Typing cadence: timestamps between keydown events
- Mouse dynamics: speed, angle, click pressure (via PointerEvents)
- Session context: pages visited, time on page, copy-paste events, autofill usage
- Device fingerprint: screen resolution, timezone, language, user agent hash

Expose getBehavioralProfile(): BehavioralProfile

**New file:** src/lib/behavioral/types.ts

interface BehavioralProfile {
  typingCadence: number[]
  mouseDynamics: MouseEvent[]
  sessionFlow: SessionEvent[]
  deviceFingerprint: string
  riskIndicators: string[]
}

### 2.3 Enhance RiskDistributionBar with ML Overlay

**File:** src/features/analyst-dashboard/RiskDistributionBar.tsx

- Add toggle: Rule-Based vs ML-Scored
- When ML-Scored is active, fetch scores from scoringEngine and overlay the distribution
- Show delta between rule-based and ML-based classifications

## Phase 3 - Network Graph Enhancements & Mule Detection (Week 3)

**Goal:** Upgrade the existing FraudNetworkGraph to detect fraud rings and mule accounts.

### 3.1 Add Fraud Ring Detection Algorithm

**New file:** src/lib/graph/fraudRingDetector.ts

Implement on the frontend using existing transaction data:
- Louvain community detection to cluster connected accounts
- Identify accounts with high fan-out (one account sending to many others)
- Detect rhythmic patterns (regular deposits followed by rapid withdrawals)
- Flag accounts that appear in multiple clusters

Expose detectFraudRings(transactions: Transaction[]): FraudRing[]

interface FraudRing {
  id: string
  accounts: string[]
  merchants: string[]
  riskScore: number
  ringType: MULE_RING | SYNTHETIC_RING | CARDING_RING
  confidence: number
}

### 3.2 Enhance FraudNetworkGraph Visualization

**File:** src/features/network-dashboard/FraudNetworkGraph.tsx

- Color-code nodes by ring membership:
  - Red border = member of detected fraud ring
  - Yellow border = suspicious but not confirmed
  - Blue border = normal
- Add ring overlay: when a ring is selected, highlight all connected nodes and edges
- Add minimap for large graphs
- Add time-scrubber to animate graph evolution over last 24 hours
- Add legend showing ring types and counts

### 3.3 Add Mule Account Flow Visualization

**New file:** src/features/network-dashboard/MuleFlowPanel.tsx

- Sankey diagram showing money flow from source accounts through mule accounts to destination
- Uses d3-sankey or similar lightweight library
- Highlights accounts with rhythmic deposit-withdrawal patterns
- Shows time-series of transaction amounts per account to reveal mule behavior

## Phase 4 - Advanced Prevention Features (Week 4)

**Goal:** Add deepfake simulation, alternate data enrichment, and continuous learning feedback loop.

### 4.1 Alternate Data Enrichment Panel

**New file:** src/lib/enrichment/alternateData.ts

Simulate alternate data sources in the mock layer:
- IP geolocation lookup (mock GeoIP database)
- Device fingerprint consistency check
- Session context scoring (direct navigation to checkout = suspicious)
- Public data scoring (email domain reputation, phone number validation)

Expose enrichTransaction(tx): EnrichedTransaction

**New component:** src/features/analyst-dashboard/EnrichmentPanel.tsx

- Shows alternate data sources used for each transaction
- Displays confidence scores per enrichment source
- Highlights discrepancies (e.g., IP country != billing country)

### 4.2 Deepfake / Synthetic Identity Detection Simulation

**New file:** src/lib/deepfake/syntheticIdentityScanner.ts

Simulate deepfake detection for identity verification flows:
- Liveness score based on interaction timing (too perfect = bot, too erratic = deepfake)
- Document authenticity check (mock OCR + pixel analysis)
- Face-liveness heuristics (eye-blink rate, head movement variance)

**New component:** src/features/analyst-dashboard/SyntheticIdentityPanel.tsx

- Shows synthetic identity risk score for user onboarding events
- Displays detection breakdown per modality

### 4.3 Continuous Learning Feedback Loop

**New file:** src/lib/learning/feedbackLoop.ts

- Capture analyst decisions (Confirm Fraud / False Positive)
- Store feedback in localStorage for demo purposes
- Compute model accuracy drift over time
- Simulate automatic model retraining when feedback threshold is reached

**New component:** src/features/analyst-dashboard/ModelAccuracyPanel.tsx

- Shows precision/recall over time based on analyst feedback
- Displays number of feedback samples collected
- Shows next retraining countdown

## Phase 5 - Integration, Testing & Demo Polish (Week 5)

**Goal:** Wire everything together, add tests, and prepare for demo.

### 5.1 API Contract Updates

**File:** API_CONTRACT.md

Add new endpoints to the contract:
- POST /api/transactions/:id/confirm-fraud (already exists in contract, verify implementation)
- GET /api/model/accuracy (mock: returns precision, recall, feedbackCount)
- GET /api/enrichment/:transactionId (mock: returns alternate data)
- POST /api/scoring/pre-transaction (mock: returns PreTransactionScore)

### 5.2 Mock Data Seeding

**File:** src/mocks/seed-data.ts

- Add fraud ring seed data (pre-defined ring members)
- Add mule account patterns (rhythmic deposit/withdrawal sequences)
- Add synthetic identity test cases
- Add behavioral profile templates for different user personas

### 5.3 End-to-End Demo Flow

Create a demo script that showcases the prevention pipeline:
1. User logs in with test email (mock session)
2. Live feed shows incoming transactions
3. Pre-transaction scoring panel highlights a high-risk transaction in red
4. Analyst clicks row, sees expandable reason codes (velocity_spike, new_device, location_mismatch)
5. Analyst clicks Confirm Fraud, feedback is recorded
6. Network graph highlights the fraud ring
7. Model accuracy panel updates with new feedback
8. Mule flow panel shows money movement pattern

### 5.4 Testing

**New files:**
- src/lib/ml/scoringEngine.test.ts
- src/lib/behavioral/collector.test.ts
- src/lib/graph/fraudRingDetector.test.ts
- src/features/analyst-dashboard/TransactionTable.test.tsx (add new column tests)

Run vitest + playwright e2e for the demo flow.

## File Change Summary

### New Files to Create

| File | Purpose | Phase |
|------|---------|-------|
| src/shared/types/fraud.ts (extend) | Add RiskAction, PreTransactionScore | 1 |
| src/shared/types/transaction.ts (extend) | Add preTransactionScore fields | 1 |
| src/lib/ml/scoringEngine.ts | ONNX client-side scoring engine | 2 |
| src/lib/ml/worker.ts | Web Worker for ML inference | 2 |
| src/lib/behavioral/collector.ts | Passive behavioral signal collection | 2 |
| src/lib/behavioral/types.ts | Behavioral profile types | 2 |
| src/lib/graph/fraudRingDetector.ts | Frontend fraud ring detection | 3 |
| src/lib/enrichment/alternateData.ts | Alternate data enrichment simulation | 4 |
| src/lib/deepfake/syntheticIdentityScanner.ts | Deepfake/synthetic identity heuristics | 4 |
| src/lib/learning/feedbackLoop.ts | Feedback loop and accuracy tracking | 4 |
| src/features/analyst-dashboard/usePreTransactionScore.ts | React hook for ML scoring | 2 |
| src/features/analyst-dashboard/EnrichmentPanel.tsx | Enrichment data panel | 4 |
| src/features/analyst-dashboard/SyntheticIdentityPanel.tsx | Synthetic identity risk panel | 4 |
| src/features/analyst-dashboard/ModelAccuracyPanel.tsx | Model accuracy dashboard | 4 |
| src/features/network-dashboard/MuleFlowPanel.tsx | Mule flow Sankey diagram | 3 |
| src/lib/ml/scoringEngine.test.ts | ML scoring tests | 5 |
| src/lib/behavioral/collector.test.ts | Behavioral collector tests | 5 |
| src/lib/graph/fraudRingDetector.test.ts | Graph detection tests | 5 |

### Existing Files to Modify

| File | Changes | Phase |
|------|---------|-------|
| src/mocks/offlineBypass.ts | Add preTransactionScore to mock responses, add deterministic scoring logic | 1 |
| src/mocks/seed-data.ts | Add fraud ring, mule, and synthetic identity seed data | 5 |
| src/features/analyst-dashboard/TransactionTable.tsx | Add riskAction column, expandable reason codes, feedback buttons | 1 |
| src/features/analyst-dashboard/RiskDistributionBar.tsx | Add Traffic Light segments, ML toggle | 1-2 |
| src/features/analyst-dashboard/AnalystDashboard.tsx | Add PreTransactionScoringPanel | 1 |
| src/features/network-dashboard/FraudNetworkGraph.tsx | Add ring highlighting, minimap, time-scrubber | 3 |
| API_CONTRACT.md | Add new endpoint definitions | 5 |
| package.json | Add onnxruntime-web dependency | 2 |

## Implementation Order & Dependencies

`
Phase 1 (Week 1)
  |
  +---> Phase 2 (Week 2) --+---> Phase 3 (Week 3) --+---> Phase 4 (Week 4) --+---> Phase 5 (Week 5)
`

**Critical path:**
1. Types must be extended before any UI component can consume new fields
2. Mock data must include preTransactionScore before TransactionTable can display it
3. ML scoring engine depends on ONNX model availability (can use mock weights for demo)
4. Fraud ring detection depends on graph data being available in the frontend
5. Feedback loop depends on Confirm Fraud endpoint being implemented in mock

**Parallel work streams:**
- Frontend UI (TransactionTable, RiskDistributionBar, AnalystDashboard) can proceed in parallel with mock backend changes
- ONNX model training can happen offline while UI is being built
- Behavioral collector can be developed independently of ML scoring engine

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ONNX model file too large for browser | Medium | High | Use quantized model, lazy load, fall back to deterministic scoring |
| Web Worker communication overhead | Low | Medium | Batch transactions, use transferable ArrayBuffers |
| React Flow performance with 1000+ nodes | Medium | Medium | Virtualize nodes, limit visible edges, use WebGL renderer |
| Behavioral profiling privacy concerns | High | High | Collect only with consent, hash all PII, never store raw keystrokes |
| Mock data not realistic enough for demo | Low | Low | Use real transaction patterns from seed-data.ts |

## Success Metrics

| Metric | Target |
|--------|--------|
| Time to score a transaction | < 50ms client-side |
| False positive rate (demo) | < 15% |
| Analyst feedback loop latency | < 2 seconds |
| Network graph render time | < 100ms for 500 nodes |
| Dashboard load time | < 2 seconds |
| Mobile responsiveness | Fully responsive on 320px+ |

## Summary

This plan adds five categories of fraud prevention features to FraudGuard, building on the existing frontend architecture:

1. **Decision Framework (Phase 1)** - Progressive friction (APPROVE/FLAG/BLOCK), traffic light UI, explainable reason codes. Zero backend changes. Delivered in Week 1.

2. **Client-Side ML Scoring (Phase 2)** - ONNX-based inference in the browser, behavioral profiling, Web Worker offloading. Requires one new dependency. Delivered in Week 2.

3. **Network Graph & Mule Detection (Phase 3)** - Fraud ring detection algorithm, enhanced React Flow visualization, Sankey mule flow panel. Uses existing network-dashboard component. Delivered in Week 3.

4. **Advanced Prevention (Phase 4)** - Alternate data enrichment, deepfake/synthetic identity simulation, continuous learning feedback loop. Mostly new components with mock data. Delivered in Week 4.

5. **Integration & Polish (Phase 5)** - API contract updates, seed data, e2e demo flow, tests. Delivered in Week 5.

**Key principle:** Every feature is designed to work with the existing mock backend (offlineBypass.ts + MSW). No real backend is required to demo the full prevention pipeline. When the backend is ready, swap VITE_MOCK_MODE=false and connect to real endpoints.

**Next action:** Start Phase 1 by extending src/shared/types/fraud.ts with RiskAction and PreTransactionScore.

