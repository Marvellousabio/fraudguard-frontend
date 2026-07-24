export function createTimeBuckets(data: { timestamp: string; count: number }[]): { hour: string; count: number }[] {
  const now = new Date()
  const buckets: { hour: string; count: number }[] = []

  for (let i = 23; i >= 0; i--) {
    const hourStart = new Date(now)
    hourStart.setHours(now.getHours() - i, 0, 0, 0)
    const hourLabel = hourStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    const bucket = data.find(d => {
      const ts = new Date(d.timestamp)
      return ts.getFullYear() === hourStart.getFullYear() &&
        ts.getMonth() === hourStart.getMonth() &&
        ts.getDate() === hourStart.getDate() &&
        ts.getHours() === hourStart.getHours()
    })

    buckets.push({
      hour: hourLabel,
      count: bucket?.count ?? 0,
    })
  }

  return buckets
}
