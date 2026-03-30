// components/event-map.tsx
"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { SpaceEvent } from "@/data/CBED"

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})
L.Marker.prototype.options.icon = DefaultIcon

function MapController({ 
  center, 
  onBoundsChange 
}: { 
  center: [number, number], 
  onBoundsChange: (bounds: {n: number, s: number, e: number, w: number}) => void 
}) {
  const map = useMapEvents({
    moveend() {
      const b = map.getBounds()
      onBoundsChange({ n: b.getNorth(), s: b.getSouth(), e: b.getEast(), w: b.getWest() })
    },
  })

  useEffect(() => {
    map.flyTo(center, map.getZoom())
    const b = map.getBounds()
    onBoundsChange({ n: b.getNorth(), s: b.getSouth(), e: b.getEast(), w: b.getWest() })
  }, [center, map]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

export default function EventMap({
  events,
  center,
  onBoundsChange
}: {
  events: SpaceEvent[]
  center: [number, number]
  onBoundsChange: (bounds: {n: number, s: number, e: number, w: number}) => void
}) {
  return (
    <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%", zIndex: 0 }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapController center={center} onBoundsChange={onBoundsChange} />
      {events.map((event) => (
        <Marker key={event.id} position={[event.lat, event.lng]}>
          <Popup>
            <div className="font-sans">
              <strong className="text-primary block mb-1">{event.title}</strong>
              <span className="text-xs text-muted-foreground block">{event.location}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}