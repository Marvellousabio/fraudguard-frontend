import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { LiveFeedTracker } from '@/features/live-feed/LiveFeedTracker'
import { GeoHeatmap } from '@/features/geo-heatmap/GeoHeatmap'
import { SummaryStats } from '@/features/dashboard/SummaryStats'
import { TimeSeriesChart } from '@/features/dashboard/TimeSeriesChart'
import { useLiveFeed } from '@/features/live-feed/useLiveFeed'
import type { FilterState } from '@/shared/types/transaction'
import { Activity, Map, BarChart3, Shield } from 'lucide-react'

export default function AnalystDashboard() {
  const [filter, setFilter] = useState<FilterState>({})
  const { transactions, isLoading } = useLiveFeed(filter)

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
              <p className="text-xs text-muted-foreground">Real-Time Detection Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="ai" className="animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              LIVE
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="feed" className="gap-2">
              <Activity className="w-4 h-4" />
              Live Feed
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <Map className="w-4 h-4" />
              Geographic View
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            <SummaryStats />
            <Separator />
            <LiveFeedTracker filter={filter} onFilterChange={setFilter} transactions={transactions} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Geographic Fraud Density</CardTitle>
              </CardHeader>
              <CardContent>
                <GeoHeatmap transactions={transactions} onZoneSelect={(zoneId) => setFilter(prev => ({ ...prev, zoneId }))} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
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
                  <CardTitle className="text-lg">Rule Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Rule breakdown chart (pie) - implement with Recharts
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
