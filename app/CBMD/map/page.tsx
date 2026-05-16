// app/CBMD/map/page.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps"
import useSupercluster from "use-supercluster"
import { MapPin, X, ExternalLink, Filter, Loader2, Home, Map as MapIcon, Search, Database, Navigation } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ContentPageLayout } from "@/components/content-page-layout"
import { GlassCard } from "@/components/glass-card"
import { TagBadge } from "@/components/tag-badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { fetchFacilitiesData, regions, facilityTypes, Facility } from "@/lib/CBMD"

const JAPAN_TOPO_JSON = "https://raw.githubusercontent.com/dataofjapan/land/master/japan.topojson"
const IMPERIAL_PALACE: [number, number] = [139.7528, 35.6852]

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const prefectureCoordinates: Record<string, [number, number]> = {
  "北海道": [141.3469, 43.0642], "青森県": [140.7402, 40.8246], "岩手県": [141.1527, 39.7036],
  "宮城県": [140.8720, 38.2688], "秋田県": [140.1026, 39.7186], "山形県": [140.3634, 38.2404],
  "福島県": [140.4676, 37.7503], "茨城県": [140.4466, 36.3419], "栃木県": [139.8836, 36.5657],
  "群馬県": [139.0607, 36.3911], "埼玉県": [139.6489, 35.8570], "千葉県": [140.1233, 35.6073],
  "東京都": [139.6917, 35.6895], "神奈川県": [139.6423, 35.4478], "新潟県": [139.0237, 37.9025],
  "富山県": [137.2114, 36.6959], "石川県": [136.6256, 36.5947], "福井県": [136.2219, 36.0652],
  "山梨県": [138.5684, 35.6642], "長野県": [138.1813, 36.6513], "岐阜県": [136.7223, 35.3912],
  "静岡県": [138.3831, 34.9769], "愛知県": [136.9066, 35.1802], "三重県": [136.5086, 34.7303],
  "滋賀県": [136.0563, 35.0045], "京都府": [135.7681, 35.0116], "大阪府": [135.5198, 34.6864],
  "兵庫県": [135.1830, 34.6912], "奈良県": [135.8328, 34.6853], "和歌山県": [135.1675, 34.2260],
  "鳥取県": [134.2378, 35.5039], "島根県": [133.0505, 35.4723], "岡山県": [133.9345, 34.6618],
  "広島県": [132.4596, 34.3963], "山口県": [131.4714, 34.1858], "徳島県": [134.5595, 34.0658],
  "香川県": [134.0434, 34.3401], "愛媛県": [132.7657, 33.8417], "高知県": [133.5311, 33.5597],
  "福岡県": [130.4181, 33.6064], "佐賀県": [130.2987, 33.2494], "長崎県": [129.8737, 32.7503],
  "熊本県": [130.7417, 32.7898], "大分県": [131.6126, 33.2382], "宮崎県": [131.4239, 31.9111],
  "鹿児島県": [130.5581, 31.5602], "沖縄県": [127.6809, 26.2124],
}

export default function MapPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [center, setCenter] = useState<[number, number]>(IMPERIAL_PALACE)
  const [mapZoom, setMapZoom] = useState(1)
  const [mapBounds, setMapBounds] = useState<[number, number, number, number] | null>(null)
  
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [hasPlanetarium, setHasPlanetarium] = useState(false)
  const [hasEvent, setHasEvent] = useState(false)
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function loadData() {
      const data = await fetchFacilitiesData()
      setFacilities(data)
      setIsLoading(false)
    }
    loadData()
  }, [])

  const handleGetLocation = () => {
    setIsLocating(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.longitude, position.coords.latitude]
          setUserLocation(loc)
          setCenter(loc)
          setMapZoom(4)
          setIsLocating(false)
        },
        () => {
          alert("現在地を取得できませんでした。ブラウザの位置情報許可を確認してください。")
          setIsLocating(false)
        }
      )
    } else {
      alert("お使いのブラウザは位置情報に対応していません。")
      setIsLocating(false)
    }
  }

  const filteredFacilities = useMemo(() => {
    const filtered = facilities.filter((facility) => {
      if (selectedRegion && facility.region !== selectedRegion) return false
      if (selectedPrefecture && facility.prefecture !== selectedPrefecture) return false
      if (selectedCategories.length > 0 && !selectedCategories.includes(facility.category)) return false
      if (hasPlanetarium && !facility.hasPlanetarium) return false
      if (hasEvent && !facility.hasEvent) return false
      return true
    })

    if (userLocation) {
      return filtered.map(facility => {
        const coords = prefectureCoordinates[facility.prefecture] || IMPERIAL_PALACE
        const dist = calculateDistance(userLocation[1], userLocation[0], coords[1], coords[0])
        return { ...facility, _distance: dist }
      }).sort((a, b) => (a._distance || 0) - (b._distance || 0))
    }
    return filtered
  }, [facilities, selectedRegion, selectedPrefecture, selectedCategories, hasPlanetarium, hasEvent, userLocation])

  const points = useMemo(() => {
    return filteredFacilities.map(facility => {
      const baseCoords = prefectureCoordinates[facility.prefecture] || IMPERIAL_PALACE
      const hash = facility.id.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)
      const offsetLng = (hash % 100) * 0.0005
      const offsetLat = ((hash / 100) % 100) * 0.0005
      
      // ★修正1: as const と型アサーションを使ってTypeScriptを納得させる
      return {
        type: "Feature" as const,
        properties: { cluster: false, facilityId: facility.id, facility },
        geometry: { type: "Point" as const, coordinates: [baseCoords[0] + offsetLng, baseCoords[1] + offsetLat] }
      }
    })
  }, [filteredFacilities])

  const bounds = mapBounds || [120, 20, 150, 50]

  const { clusters } = useSupercluster({
    points,
    bounds,
    zoom: mapZoom,
    options: { radius: 40, maxZoom: 20 }
  })

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category])
  }

  const clearFilters = () => {
    setSelectedRegion(null); setSelectedPrefecture(null); setSelectedCategories([]); setHasPlanetarium(false); setHasEvent(false);
  }

  return (
    <ContentPageLayout
      title="Cosmo Base Museum Database"
      level={3}
      levelTitle="リアル体験"
      logo="CBMD"
    >
    <div className="min-h-screen relative">
      <main className="relative z-10 pt-8 pb-12 px-4">
        
        <div className="max-w-7xl mx-auto mb-8 border-b border-border/30 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/CBMD">
              <Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground">
                <Home className="w-4 h-4 mr-2" /> トップ
              </Button>
            </Link>
            <Link href="/CBMD/map">
              <Button variant="ghost" size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 font-bold">
                <MapIcon className="w-4 h-4 mr-2" /> マップ
              </Button>
            </Link>
            <Link href="/CBMD/search">
              <Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground">
                <Search className="w-4 h-4 mr-2" /> 検索
              </Button>
            </Link>
            <Link href="/CBMD/database">
              <Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground">
                <Database className="w-4 h-4 mr-2" /> データベース一覧
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">地図から探す</h1>
              <p className="text-muted-foreground">日本地図上で宇宙関連施設を探索</p>
            </div>
            <Button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="bg-primary/20 text-primary hover:bg-primary/30 font-bold"
            >
              <Navigation className={`w-4 h-4 mr-2 ${isLocating ? "animate-pulse" : ""}`} />
              現在地から探す
            </Button>
          </div>

          <div className="lg:grid lg:grid-cols-[320px_1fr] gap-6">
            <div className="lg:hidden mb-4">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full glass border-border/30">
                <Filter className="w-4 h-4 mr-2" /> フィルター {filteredFacilities.length}件
              </Button>
            </div>

            <aside className={`${showFilters ? "block" : "hidden"} lg:block space-y-6 mb-6 lg:mb-0`}>
              <GlassCard>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-foreground">検索フィルター</h2>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">クリア</Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">地方</Label>
                    <div className="flex flex-wrap gap-2">
                      {regions.map((region) => (
                        <button
                          key={region.name}
                          onClick={() => { setSelectedRegion(selectedRegion === region.name ? null : region.name); setSelectedPrefecture(null) }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedRegion === region.name ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground hover:bg-secondary/70"}`}
                        >
                          {region.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedRegion && (
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2 block">都道府県</Label>
                      <div className="flex flex-wrap gap-2">
                        {regions.find((r) => r.name === selectedRegion)?.prefectures.map((pref) => (
                          <button
                            key={pref}
                            onClick={() => setSelectedPrefecture(selectedPrefecture === pref ? null : pref)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedPrefecture === pref ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground hover:bg-secondary/70"}`}
                          >
                            {pref}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">展示カテゴリ</Label>
                    <div className="space-y-2">
                      {facilityTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox id={type} checked={selectedCategories.includes(type)} onCheckedChange={() => handleCategoryToggle(type)} />
                          <Label htmlFor={type} className="text-sm text-muted-foreground cursor-pointer">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="planetarium" checked={hasPlanetarium} onCheckedChange={(checked) => setHasPlanetarium(checked === true)} />
                      <Label htmlFor="planetarium" className="text-sm text-muted-foreground cursor-pointer">プラネタリウムあり</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="event" checked={hasEvent} onCheckedChange={(checked) => setHasEvent(checked === true)} />
                      <Label htmlFor="event" className="text-sm text-muted-foreground cursor-pointer">イベント開催中</Label>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground"><span className="text-primary font-semibold">{filteredFacilities.length}</span> 件の施設が見つかりました</p>
                </div>
              </GlassCard>

              {userLocation && (
                 <GlassCard className="h-[400px] flex flex-col">
                   <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                     <MapPin className="w-4 h-4 text-accent" />
                     近い順 ({filteredFacilities.length}件)
                   </h3>
                   <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                     {filteredFacilities.map(facility => (
                       <Link href={`/CBMD/facility/${facility.id}`} key={facility.id} className="block group">
                         <div className="p-3 rounded-lg border border-border/50 hover:bg-primary/10 transition-colors cursor-pointer relative">
                           <h4 className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors pr-5">
                             {facility.name}
                           </h4>
                           <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                             <span className="line-clamp-1 mr-2">{facility.city}</span>
                             <span className="text-accent font-medium shrink-0">
                               {((facility as any)._distance || 0) < 1 ? Math.round((facility as any)._distance * 1000) + 'm' : ((facility as any)._distance || 0).toFixed(1) + 'km'}
                             </span>
                           </div>
                         </div>
                       </Link>
                     ))}
                   </div>
                 </GlassCard>
              )}
            </aside>

            <div className="relative">
              {isLoading ? (
                <GlassCard className="p-2 sm:p-4 flex flex-col items-center justify-center min-h-[400px]">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                  <p>地図を読み込み中...</p>
                </GlassCard>
              ) : (
                <GlassCard className="p-2 sm:p-4 h-[600px] relative">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-background/50 relative">
                    <ComposableMap projection="geoMercator" projectionConfig={{ center, scale: mapZoom * 1800 }} style={{ width: "100%", height: "100%" }}>
                      <ZoomableGroup 
                        center={center}
                        zoom={mapZoom}
                        onMoveEnd={(position) => {
                          setMapZoom(position.zoom)
                          setCenter(position.coordinates)
                        }}
                      >
                        <Geographies geography={JAPAN_TOPO_JSON}>
                          {({ geographies }) =>
                            geographies.map((geo) => (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="oklch(0.2 0.03 260)"
                                stroke="oklch(0.35 0.04 260 / 0.5)"
                                strokeWidth={0.5 / mapZoom}
                                style={{ default: { outline: "none" }, hover: { fill: "oklch(0.25 0.04 260)", outline: "none" }, pressed: { outline: "none" } }}
                              />
                            ))
                          }
                        </Geographies>

                        {clusters.map((cluster) => {
                          const [longitude, latitude] = cluster.geometry.coordinates;
                          const { cluster: isCluster, point_count: pointCount } = cluster.properties as any; // ★修正2: anyを使って回避

                          if (isCluster) {
                            const size = 16 + (pointCount / points.length) * 10;
                            return (
                              <Marker key={`cluster-${cluster.id}`} coordinates={[longitude, latitude]}>
                                <g style={{ transform: `scale(${1 / mapZoom})` }}>
                                  <circle r={size} fill="oklch(0.7 0.15 220)" stroke="oklch(0.9 0.05 220)" strokeWidth={2} />
                                  <text textAnchor="middle" y={4} fill="#000" fontSize={12} fontWeight="bold">
                                    {pointCount}
                                  </text>
                                </g>
                              </Marker>
                            );
                          }

                          const facility = (cluster.properties as any).facility; // ★修正2: anyを使って回避
                          return (
                            <Marker key={`facility-${facility.id}`} coordinates={[longitude, latitude]} onClick={() => setSelectedFacility(facility)}>
                              <g style={{ transform: `scale(${1 / mapZoom})` }}>
                                <g className="cursor-pointer transition-transform hover:scale-125" style={{ transform: "translate(-12px, -24px)" }}>
                                  <circle r={8} cx={12} cy={20} fill="oklch(0.7 0.15 220)" stroke="oklch(0.9 0.05 220)" strokeWidth={2} className="drop-shadow-lg" />
                                  <circle r={3} cx={12} cy={20} fill="oklch(0.95 0.01 260)" />
                                </g>
                              </g>
                            </Marker>
                          )
                        })}

                        {userLocation && (
                          <Marker coordinates={userLocation}>
                            <g style={{ transform: `scale(${1 / mapZoom})` }}>
                              <circle r={6} fill="#3b82f6" stroke="#fff" strokeWidth={2} className="animate-pulse" />
                            </g>
                          </Marker>
                        )}
                      </ZoomableGroup>
                    </ComposableMap>
                  </div>
                </GlassCard>
              )}

              {selectedFacility && (
                <div className="absolute bottom-8 left-8 right-8 sm:left-auto sm:right-8 sm:w-80">
                  <GlassCard className="glass-strong">
                    <div className="flex items-start justify-between mb-3">
                      <TagBadge variant="primary">{selectedFacility.category}</TagBadge>
                      <button onClick={() => setSelectedFacility(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{selectedFacility.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3 inline mr-1" />{selectedFacility.address}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {selectedFacility.tags.slice(0, 4).map((tag) => <TagBadge key={tag}>{tag}</TagBadge>)}
                    </div>
                    <Link href={`/CBMD/facility/${selectedFacility.id}`}>
                      <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30">
                        詳細を見る <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </GlassCard>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </ContentPageLayout>
  )
}