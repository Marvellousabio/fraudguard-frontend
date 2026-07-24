import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExportButton } from '@/shared/components/ExportButton'
import { TimeSeriesChart } from '@/features/dashboard/TimeSeriesChart'
import type { FlaggedTransaction } from '@/shared/types/transaction'
import { BarChart3, FileText, Shield, TrendingUp } from 'lucide-react'

export default function ComplianceDashboard() {
  const { data: summary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: async () => {
      const res = await fetch('/api/analytics/summary')
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
  })

  const { data: transactions } = useQuery({
    queryKey: ['flagged-transactions'],
    queryFn: async () => {
      const res = await fetch('/api/transactions/flagged?pageSize=100')
      if (!res.ok) throw new Error('Failed')
      const json = await res.json()
      return json.data as FlaggedTransaction[]
    },
    refetchInterval: 30000,
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">FraudGuard</h1>
              <p className="text-xs text-muted-foreground">Compliance Dashboard</p>
            </div>
          </div>
          <Badge variant="secondary">Compliance Officer</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Flagged Today</p>
                  <p className="text-2xl font-bold">{summary?.totalFlaggedToday ?? '-'}</p>
                </div>
                <Shield className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Risk Score</p>
                  <p className="text-2xl font-bold">
                    {summary?.averageRiskScore ? `${(summary.averageRiskScore * 100).toFixed(0)}%` : '-'}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {summary?.breakdownByRule?.INTELLIGENT_ANOMALY ?? '-'}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ahnlich P99</p>
                  <p className="text-2xl font-bold">{summary?.ahnlichP99Latency ?? '-'}ms</p>
                </div>
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">24-Hour Detection Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <TimeSeriesChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Export flagged transactions for audit and compliance reporting.
              </p>
              <ExportButton data={transactions ?? []} filename="fraudguard-audit" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Platform Efficacy Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Detection Path Latency</p>
                <p className="text-xl font-bold">&lt; 100ms p99</p>
                <p className="text-xs text-muted-foreground">APM distributed tracing</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">Vector Query Latency</p>
                <p className="text-xl font-bold">&lt; 8ms p99</p>
                <p className="text-xs text-muted-foreground">AhnlichVectorService</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground">AI Explanation Delivery</p>
                <p className="text-xl font-bold">&lt; 2.5s</p>
                <p className="text-xs text-muted-foreground">E2E from fraud.detected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
