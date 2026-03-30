// components/event-map.tsx
"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { SpaceEvent } from "@/data/CBED"

// アイコンの設定
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
    <div className="w-full h-full relative" style={{ minHeight: "300px" }}>
      {/* ★ 修正ポイント：
        1. MapContainerを直接ではなく、divで包んで最小高さを保証します。
        2. zIndex を 1 以上（10程度）に設定します。0だと背景に隠れます。
        3. スマホのタッチ操作が効くようにします。
      */}
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: "100%", width: "100%", zIndex: 10 }}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapController center={center} onBoundsChange={onBoundsChange} />
        {events.map((event) => (
          <Marker key={event.id} position={[event.lat, event.lng]}>
            <Popup>
              <div className="font-sans text-slate-900">
                <strong className="text-primary block mb-1">{event.title}</strong>
                <span className="text-xs block">{event.location}</span>
                <a 
                  href={`./${event.id}`} 
                  className="text-[10px] text-blue-600 underline block mt-2"
                >
                  詳細を見る
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
