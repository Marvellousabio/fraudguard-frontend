declare module 'leaflet.heat' {
  import type { Layer } from 'leaflet'

  interface HeatmapOptions {
    minOpacity?: number
    maxZoom?: number
    max?: number
    radius?: number
    blur?: number
    gradient?: Record<number, string>
  }

  interface LatLngTuple {
    lat: number
    lng: number
    intensity?: number
  }

  export function heatLayer(
    latlngs: Array<[number, number, number?] | LatLngTuple>,
    options?: HeatmapOptions
  ): Layer
}
