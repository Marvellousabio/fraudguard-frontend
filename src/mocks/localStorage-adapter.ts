const DB_KEY = 'fraudguard_mock_db'

export function loadMockDb() {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        transactions: parsed.transactions || [],
        confirmedIds: new Set(parsed.confirmedIds || []),
      }
    }
  } catch { /* ignore */ }
  return null
}

export function saveMockDb(db: { transactions: unknown[]; confirmedIds: Set<string> }) {
  localStorage.setItem(DB_KEY, JSON.stringify({
    transactions: db.transactions,
    confirmedIds: Array.from(db.confirmedIds),
  }))
}

export function clearMockDb() {
  localStorage.removeItem(DB_KEY)
}
