import { describe, it, expect } from 'vitest'
import { createTimeBuckets } from '@/shared/utils/time-buckets'

describe('createTimeBuckets', () => {
  it('creates 24 hourly buckets', () => {
    const data = [
      { timestamp: new Date().toISOString(), count: 5 },
    ]
    const buckets = createTimeBuckets(data)
    expect(buckets).toHaveLength(24)
  })

  it('fills missing hours with 0 count', () => {
    const data: Array<{ timestamp: string; count: number }> = []
    const buckets = createTimeBuckets(data)
    expect(buckets.every(b => b.count === 0)).toBe(true)
  })

  it('distributes counts to correct hours', () => {
    const now = new Date()
    const currentHour = new Date(now)
    currentHour.setMinutes(0, 0, 0)

    const data = [
      { timestamp: currentHour.toISOString(), count: 10 },
    ]

    const buckets = createTimeBuckets(data)
    const currentBucket = buckets[buckets.length - 1]
    expect(currentBucket.count).toBe(10)
  })
})
