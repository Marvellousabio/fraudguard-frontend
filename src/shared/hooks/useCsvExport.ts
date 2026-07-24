export function exportToCsv(data: unknown[], filename: string) {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0] as Record<string, unknown>)
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = (row as Record<string, unknown>)[h]
        if (typeof val === 'string' && val.includes(',')) return `"${val.replace(/"/g, '""')}"`
        return val ?? ''
      }).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}
