import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface GeoMiniMapProps {
  location: { latitude: number; longitude: number }
  height?: string
}

export function GeoMiniMap({ location, height = '200px' }: GeoMiniMapProps) {
  return (
    <MapContainer
      center={[location.latitude, location.longitude]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height, width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.latitude, location.longitude]}>
        <Popup>
          <div className="text-sm">
            <p className="font-semibold">Transaction Location</p>
            <p className="text-muted-foreground">
              {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  )
}
