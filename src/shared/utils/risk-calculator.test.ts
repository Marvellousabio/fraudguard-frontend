import { describe, it, expect } from 'vitest'
import { getRiskLevel, getRiskColor, getRiskLabel } from '@/shared/utils/risk-calculator'

describe('risk-calculator', () => {
  it('returns CRITICAL for scores >= 0.9', () => {
    expect(getRiskLevel(0.9)).toBe('CRITICAL')
    expect(getRiskLevel(0.95)).toBe('CRITICAL')
    expect(getRiskLevel(1.0)).toBe('CRITICAL')
  })

  it('returns HIGH for scores >= 0.75 and < 0.9', () => {
    expect(getRiskLevel(0.75)).toBe('HIGH')
    expect(getRiskLevel(0.85)).toBe('HIGH')
  })

  it('returns MEDIUM for scores >= 0.5 and < 0.75', () => {
    expect(getRiskLevel(0.5)).toBe('MEDIUM')
    expect(getRiskLevel(0.6)).toBe('MEDIUM')
  })

  it('returns LOW for scores < 0.5', () => {
    expect(getRiskLevel(0.3)).toBe('LOW')
    expect(getRiskLevel(0.0)).toBe('LOW')
  })

  it('returns correct colors for risk levels', () => {
    expect(getRiskColor(0.95)).toBe('#dc2626')
    expect(getRiskColor(0.8)).toBe('#ef4444')
    expect(getRiskColor(0.6)).toBe('#eab308')
    expect(getRiskColor(0.3)).toBe('#22c55e')
  })

  it('getRiskLabel returns same as getRiskLevel', () => {
    expect(getRiskLabel(0.9)).toBe('CRITICAL')
    expect(getRiskLabel(0.5)).toBe('MEDIUM')
  })
})
