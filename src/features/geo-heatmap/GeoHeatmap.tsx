import { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { FlaggedTransaction } from '@/shared/types/transaction'

interface GeoHeatmapProps {
  transactions: FlaggedTransaction[]
  onZoneSelect?: (zoneId: string) => void
}

export function GeoHeatmap({ transactions, onZoneSelect }: GeoHeatmapProps) {
  const clusters = useMemo(() => {
    const map = new Map<string, { lat: number; lng: number; count: number; avgRisk: number }>()

    transactions.forEach(tx => {
      const key = `${tx.location.latitude.toFixed(2)},${tx.location.longitude.toFixed(2)}`
      const existing = map.get(key)
      if (existing) {
        existing.count++
        existing.avgRisk = (existing.avgRisk + tx.riskScore) / 2
      } else {
        map.set(key, {
          lat: tx.location.latitude,
          lng: tx.location.longitude,
          count: 1,
          avgRisk: tx.riskScore,
        })
      }
    })

    return Array.from(map.values())
  }, [transactions])

  const getColor = (count: number, avgRisk: number): string => {
    if (avgRisk >= 0.8 || count >= 5) return '#dc2626'
    if (avgRisk >= 0.6 || count >= 3) return '#eab308'
    return '#22c55e'
  }

  const getRadius = (count: number): number => {
    return Math.min(10 + count * 5, 50)
  }

  if (transactions.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        No transaction data available
      </div>
    )
  }

  const center = clusters[0] || { lat: 0, lng: 0 }

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={2}
      style={{ height: '500px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {clusters.map((cluster, idx) => (
        <CircleMarker
          key={idx}
          center={[cluster.lat, cluster.lng]}
          radius={getRadius(cluster.count)}
          pathOptions={{
            fillColor: getColor(cluster.count, cluster.avgRisk),
            fillOpacity: 0.6,
            color: getColor(cluster.count, cluster.avgRisk),
            weight: 1,
          }}
          eventHandlers={{
            click: () => onZoneSelect?.(`${cluster.lat.toFixed(2)},${cluster.lng.toFixed(2)}`),
          }}
        >
          <Tooltip>
            <div className="text-sm">
              <p className="font-semibold">Zone: {cluster.lat.toFixed(2)}, {cluster.lng.toFixed(2)}</p>
              <p>Transactions: {cluster.count}</p>
              <p>Avg Risk: {(cluster.avgRisk * 100).toFixed(0)}%</p>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
