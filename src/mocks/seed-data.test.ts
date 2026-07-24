import { describe, it, expect } from 'vitest'
import { generateTransaction, seedTransactions, generateExplanationForTransaction } from '@/mocks/seed-data'

describe('seed-data', () => {
  it('generates a valid transaction', () => {
    const tx = generateTransaction(1)
    expect(tx.id).toBe('tx-1')
    expect(tx.transactionId).toMatch(/^TXN-/)
    expect(tx.userId).toMatch(/^(USR|CUST|ACCT|MEM)_/)
    expect(tx.reason).toMatch(/^(HIGH_VELOCITY|DAILY_LIMIT_EXCEEDED|GEO_VELOCITY|INTELLIGENT_ANOMALY)$/)
    expect(tx.riskScore).toBeGreaterThanOrEqual(0)
    expect(tx.riskScore).toBeLessThanOrEqual(1)
    expect(tx.amount).toBeGreaterThan(0)
    expect(tx.location.latitude).toBeDefined()
    expect(tx.location.longitude).toBeDefined()
    expect(tx.vectorFeedbackStatus).toBe('PENDING')
  })

  it('generates AI confidence score for INTELLIGENT_ANOMALY only', () => {
    const tx = generateTransaction(2)
    if (tx.reason === 'INTELLIGENT_ANOMALY') {
      expect(tx.aiConfidenceScore).not.toBeNull()
      expect(tx.aiConfidenceScore!).toBeGreaterThanOrEqual(0.85)
      expect(tx.aiConfidenceScore!).toBeLessThanOrEqual(0.99)
    } else {
      expect(tx.aiConfidenceScore).toBeNull()
    }
  })

  it('generates initial null explanation', () => {
    const tx = generateTransaction(3)
    expect(tx.aiExplanation).toBeNull()
  })

  it('seeds multiple transactions', () => {
    const txs = seedTransactions(10)
    expect(txs).toHaveLength(10)
    expect(new Set(txs.map(t => t.id)).size).toBe(10)
  })

  it('generates explanation for transaction', () => {
    const tx = generateTransaction(4)
    const explanation = generateExplanationForTransaction(tx)
    expect(explanation.length).toBeGreaterThan(50)
  })
})
