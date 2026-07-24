# FraudGuard Frontend — Backend API Contract

This document defines the API contract between the FraudGuard frontend and backend.
When the backend is ready, the frontend will connect to these endpoints directly.
The MSW mock layer (src/mocks/) simulates these endpoints for frontend-only development.

---

## Base URLs

| Environment | Base URL |
|-------------|----------|
| Development (Vite dev) | `/` (proxied via Vite config) |
| Production | `/` (served from same origin) |

Vite proxy forwards `/auth/*` and `/api/*` to `http://localhost:3000`.

---

## Authentication

### POST /auth/login

Request body:
```json
{
  "email": "analyst@fraudguard.com",
  "password": "any-password"
}
```

Success response (200):
```json
{
  "accessToken": "jwt-token-string",
  "refreshToken": "jwt-refresh-token",
  "user": {
    "id": "uuid",
    "email": "analyst@fraudguard.com",
    "name": "Analyst",
    "role": "FRAUD_ANALYST"
  }
}
```

Error response (401):
```json
{ "message": "Invalid credentials" }
```

### GET /auth/me

Headers: `Authorization: Bearer <accessToken>`

Success response (200):
```json
{
  "id": "uuid",
  "email": "analyst@fraudguard.com",
  "name": "Analyst",
  "role": "FRAUD_ANALYST"
}
```

Error response (401):
```json
{ "message": "Unauthorized" }
```

### POST /auth/refresh

Request body:
```json
{ "refreshToken": "jwt-refresh-token" }
```

Success response (200):
```json
{
  "accessToken": "new-jwt-token",
  "refreshToken": "new-refresh-token"
}
```

### POST /auth/logout

Headers: `Authorization: Bearer <accessToken>`

Success response (200):
```json
{ "message": "Logged out successfully" }
```

---

## Flagged Transactions

### GET /api/transactions/flagged

Query params:
- `page` (number, default: 1)
- `pageSize` (number, default: 20)
- `ruleType` (string, optional) — one of `HIGH_VELOCITY`, `DAILY_LIMIT_EXCEEDED`, `GEO_VELOCITY`, `INTELLIGENT_ANOMALY`
- `minRiskScore` (number, optional) — minimum risk score filter (0.0–1.0)

Success response (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "transactionId": "TXN-xxx",
      "userId": "USR_xxxxxx",
      "reason": "HIGH_VELOCITY",
      "riskScore": 0.85,
      "aiConfidenceScore": null,
      "aiExplanation": null,
      "metadata": {},
      "vectorFeedbackStatus": "PENDING",
      "timestamp": "2026-07-24T12:00:00.000Z",
      "amount": 1500.00,
      "merchant": "Amazon",
      "location": { "latitude": 40.7128, "longitude": -74.0060 }
    }
  ],
  "total": 50,
  "page": 1,
  "pageSize": 20
}
```

### GET /api/transactions/flagged/:id

Success response (200): Same single transaction object as above.
Error response (404): `{ "message": "Not found" }`

### POST /api/transactions/:id/confirm-fraud

Headers: `Authorization: Bearer <accessToken>`

Success response (200):
```json
{ "success": true, "status": "SUBMITTED" }
```

Error response (404): `{ "message": "Not found" }`

---

## Analytics

### GET /api/analytics/summary

Success response (200):
```json
{
  "totalFlaggedToday": 12,
  "breakdownByRule": {
    "HIGH_VELOCITY": 3,
    "DAILY_LIMIT_EXCEEDED": 2,
    "GEO_VELOCITY": 1,
    "INTELLIGENT_ANOMALY": 6
  },
  "averageRiskScore": 0.82,
  "ahnlichP99Latency": 6.2
}
```

### GET /api/analytics/timeseries

Success response (200):
```json
[
  { "timestamp": "2026-07-24T00:00:00.000Z", "count": 2 },
  { "timestamp": "2026-07-24T01:00:00.000Z", "count": 0 },
  ...
]
```

### GET /api/export/csv

Query params:
- `startDate` (ISO date string, optional)
- `endDate` (ISO date string, optional)

Success response (200): `text/csv` file download

---

## WebSocket Events

### Server → Client

#### fraud.detected

Emitted when a new fraud transaction is detected.

```json
{
  "id": "uuid",
  "transactionId": "TXN-xxx",
  "userId": "USR_xxxxxx",
  "reason": "INTELLIGENT_ANOMALY",
  "riskScore": 0.92,
  "aiConfidenceScore": 0.95,
  "aiExplanation": null,
  "metadata": {},
  "vectorFeedbackStatus": "PENDING",
  "timestamp": "2026-07-24T12:00:00.000Z",
  "amount": 2500.00,
  "merchant": "Amazon",
  "location": { "latitude": 40.7128, "longitude": -74.0060 }
}
```

#### ai_explanation.updated

Emitted when the async AI explanation is ready for a flagged transaction.

```json
{
  "transactionId": "tx-1",
  "aiExplanation": "Semantic similarity analysis via Ahnlich vector engine detected a 92.3% match against known fraud cluster patterns..."
}
```

### Client → Server

#### client:filter

Sent by the frontend to filter the live feed stream.

```json
{
  "ruleType": "INTELLIGENT_ANOMALY",
  "minRiskScore": 0.7,
  "zoneId": "40.71,-74.01"
}
```

---

## Vector Feedback (Dynamic Update Pipeline)

When an analyst confirms a transaction as true-positive fraud:

1. Frontend calls `POST /api/transactions/:id/confirm-fraud`
2. Backend enqueues a `VectorFeedbackJob` in BullMQ
3. Backend extracts embedding from transaction context
4. Backend submits embedding to Ahnlich index
5. Backend updates `vectorFeedbackStatus` to `SUBMITTED` or `FAILED`
6. Frontend receives updated transaction via WebSocket or refetch

---

## Environment Variables (Frontend .env)

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
VITE_MOCK_MODE=true
```

When `VITE_MOCK_MODE=true`, MSW intercepts all API calls.
When `VITE_MOCK_MODE=false`, requests go directly to the real backend.

---

## Error Handling

All error responses follow this shape:
```json
{ "message": "Error description" }
```

HTTP status codes:
- `401` — Unauthorized (invalid/missing token)
- `404` — Not found
- `500` — Internal server error

The frontend should handle errors gracefully:
- Show toast notifications for network errors
- Retry failed requests with exponential backoff
- Fall back to mock data when backend is unavailable (in dev mode)
