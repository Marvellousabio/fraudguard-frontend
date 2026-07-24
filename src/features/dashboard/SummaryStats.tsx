import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Activity, TrendingUp, Zap } from 'lucide-react'

export function SummaryStats() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const res = await fetch('/api/analytics/summary')
      if (!res.ok) throw new Error('Failed')
      return res.json() as Promise<{
        totalFlaggedToday: number
        breakdownByRule: Record<string, number>
        averageRiskScore: number
        ahnlichP99Latency: number
      }>
    },
    refetchInterval: 10000,
  })

  if (isLoading || !summary) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const aiCount = summary.breakdownByRule.INTELLIGENT_ANOMALY || 0

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Flagged Today</p>
              <p className="text-2xl font-bold">{summary.totalFlaggedToday}</p>
            </div>
            <Activity className="w-8 h-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Risk Score</p>
              <p className="text-2xl font-bold">{(summary.averageRiskScore * 100).toFixed(0)}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">AI Flagged</p>
              <p className="text-2xl font-bold">{aiCount}</p>
            </div>
            <Badge variant="ai">AI</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ahnlich P99</p>
              <p className="text-2xl font-bold">{summary.ahnlichP99Latency}ms</p>
            </div>
            <Zap className="w-8 h-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
