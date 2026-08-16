import { useQuery } from '@tanstack/react-query'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { createTimeBuckets } from '@/shared/utils/time-buckets'
import { apiFetch } from '@/lib/api'

export function TimeSeriesChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-timeseries'],
    queryFn: async () => {
      const res = await apiFetch('/api/analytics/timeseries')
      if (!res.ok) throw new Error('Failed')
      return res.json() as Promise<Array<{ timestamp: string; count: number }>>
    },
    refetchInterval: 30000,
  })

  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading chart...</div>
      </div>
    )
  }

  const chartData = createTimeBuckets(data ?? [])

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
