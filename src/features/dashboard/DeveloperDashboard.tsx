import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Code, Server, Zap, AlertTriangle } from 'lucide-react'

export default function DeveloperDashboard() {
  const [mockMode, setMockMode] = useState(true)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">FraudGuard</h1>
              <p className="text-xs text-muted-foreground">Developer Dashboard</p>
            </div>
          </div>
          <Badge variant="secondary">Backend Developer</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Mock Mode</p>
                  <p className="text-lg font-bold">{mockMode ? 'Active' : 'Inactive'}</p>
                </div>
                <Server className="w-8 h-8 text-muted-foreground" />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => setMockMode(!mockMode)}
              >
                {mockMode ? 'Disable Mock' : 'Enable Mock'}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ahnlich Latency</p>
                  <p className="text-lg font-bold">6.2ms p99</p>
                </div>
                <Zap className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Circuit Breaker</p>
                  <p className="text-lg font-bold">Healthy</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="api">
          <TabsList>
            <TabsTrigger value="api">API Contracts</TabsTrigger>
            <TabsTrigger value="websocket">WebSocket Events</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
          </TabsList>
          <TabsContent value="api" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>REST API Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm">
                  <div className="p-2 bg-muted rounded">
                    <span className="text-green-600">POST</span> /api/auth/login
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="text-blue-600">GET</span> /api/transactions/flagged
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="text-blue-600">GET</span> /api/transactions/flagged/:id
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="text-green-600">POST</span> /api/transactions/:id/confirm-fraud
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="text-blue-600">GET</span> /api/analytics/summary
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="text-blue-600">GET</span> /api/analytics/timeseries
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="text-blue-600">GET</span> /api/export/csv
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="websocket" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>WebSocket Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm">
                  <div className="p-2 bg-muted rounded">
                    <span className="text-purple-600">Server → Client</span> fraud.detected
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="text-purple-600">Server → Client</span> ai_explanation.updated
                  </div>
                  <div className="p-2 bg-muted rounded">
                    <span className="text-orange-600">Client → Server</span> client:filter
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="config" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm">
                  <div className="p-2 bg-muted rounded">
                    AHNLICH_MOCK_MODE={mockMode ? 'true' : 'false'}
                  </div>
                  <div className="p-2 bg-muted rounded">
                    AHNLICH_MOCK_SEED=42
                  </div>
                  <div className="p-2 bg-muted rounded">
                    FRAUD_SIMILARITY_THRESHOLD=0.88
                  </div>
                  <div className="p-2 bg-muted rounded">
                    AI_EXPLANATION_QUEUE_CONCURRENCY=2
                  </div>
                  <div className="p-2 bg-muted rounded">
                    VECTOR_FEEDBACK_QUEUE_CONCURRENCY=1
                  </div>
                  <div className="p-2 bg-muted rounded">
                    VECTOR_FEEDBACK_MAX_RETRIES=3
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
