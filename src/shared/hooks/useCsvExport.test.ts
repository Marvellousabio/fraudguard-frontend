import { describe, it, expect, vi, beforeEach } from 'vitest'
import { exportToCsv } from '@/shared/hooks/useCsvExport'

describe('useCsvExport', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:test'),
      revokeObjectURL: vi.fn(),
    })
    document.createElement = vi.fn(() => ({
      href: '',
      download: '',
      click: vi.fn(),
    })) as unknown as typeof document.createElement
  })

  it('exports data to CSV and triggers download', () => {
    const mockData = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]

    exportToCsv(mockData, 'test-export')

    expect(document.createElement).toHaveBeenCalledWith('a')
  })
})
