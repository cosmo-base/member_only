// app/CBMD/map/page.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import { Map, Overlay } from "pigeon-maps"
import useSupercluster from "use-supercluster"
import { MapPin, X, ExternalLink, Filter, Loader2, Home, Map as MapIcon, Search, Database, Navigation, Plus, Minus, List as ListIcon } from "lucide-react"
import Link from "next/link"
import { ContentPageLayout } from "@/components/content-page-layout"
import { GlassCard } from "@/components/glass-card"
import { TagBadge } from "@/components/tag-badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { fetchFacilitiesData, regions, facilityTypes, Facility } from "@/lib/CBMD"

const IMPERIAL_PALACE_LATLNG: [number, number] = [35.6852, 139.7528]

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function MapPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [center, setCenter] = useState<[number, number]>(IMPERIAL_PALACE_LATLNG)
  const [mapZoom, setMapZoom] = useState(5)
  // ★マップの現在の表示範囲（Bounds）を管理
  const [mapBounds, setMapBounds] = useState<[number, number, number, number] | null>(null)
  
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [hasPlanetarium, setHasPlanetarium] = useState(false)
  const [hasEvent, setHasEvent] = useState(false)
  
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [clusterFacilities, setClusterFacilities] = useState<Facility[]>([])
  
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
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude]
          setUserLocation(loc)
          setCenter(loc)
          setMapZoom(12)
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

  // 1. フィルターや検索条件で絞り込まれたベースの施設リスト
  const filteredFacilities = useMemo(() => {
    const filtered = facilities.filter((facility) => {
      if (!facility.lat || !facility.lng) return false
      
      if (selectedRegion && facility.region !== selectedRegion) return false
      if (selectedPrefecture && facility.prefecture !== selectedPrefecture) return false
      if (selectedCategories.length > 0 && !selectedCategories.includes(facility.category)) return false
      if (hasPlanetarium && !facility.hasPlanetarium) return false
      if (hasEvent && !facility.hasEvent) return false
      return true
    })

    if (userLocation) {
      return filtered.map(facility => {
        const dist = calculateDistance(userLocation[0], userLocation[1], facility.lat!, facility.lng!)
        return { ...facility, _distance: dist }
      }).sort((a, b) => (a._distance || 0) - (b._distance || 0))
    }
    return filtered
  }, [facilities, selectedRegion, selectedPrefecture, selectedCategories, hasPlanetarium, hasEvent, userLocation])

  // ★追加：地図の表示範囲（画面内）にある施設だけを抽出するリスト
  const visibleFacilities = useMemo(() => {
    if (!mapBounds) return filteredFacilities;
    
    // mapBounds = [westLng, southLat, eastLng, northLat]
    const [westLng, southLat, eastLng, northLat] = mapBounds;
    
    return filteredFacilities.filter(f => {
      if (!f.lat || !f.lng) return false;
      return f.lat >= southLat && f.lat <= northLat && f.lng >= westLng && f.lng <= eastLng;
    });
  }, [filteredFacilities, mapBounds]);

  const points = useMemo(() => {
    return filteredFacilities.map(facility => ({
      type: "Feature" as const,
      properties: { cluster: false, facilityId: facility.id, facility },
      geometry: { type: "Point" as const, coordinates: [facility.lng!, facility.lat!] }
    }))
  }, [filteredFacilities])

  const bounds = mapBounds || [120, 20, 150, 50]

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: mapZoom,
    options: { radius: 50, maxZoom: 16 }
  })

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category])
  }

  const clearFilters = () => {
    setSelectedRegion(null); setSelectedPrefecture(null); setSelectedCategories([]); setHasPlanetarium(false); setHasEvent(false);
  }

  const handleZoomIn = () => setMapZoom(prev => Math.min(prev + 1, 18))
  const handleZoomOut = () => setMapZoom(prev => Math.max(prev - 1, 1))

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
            <Link href="/CBMD"><Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"><Home className="w-4 h-4 mr-2" /> トップ</Button></Link>
            <Link href="/CBMD/map"><Button variant="ghost" size="sm" className="bg-primary/20 text-primary hover:bg-primary/30 font-bold"><MapIcon className="w-4 h-4 mr-2" /> マップ</Button></Link>
            <Link href="/CBMD/search"><Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"><Search className="w-4 h-4 mr-2" /> 検索</Button></Link>
            <Link href="/CBMD/database"><Button variant="outline" size="sm" className="bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"><Database className="w-4 h-4 mr-2" /> データベース一覧</Button></Link>
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
                <Filter className="w-4 h-4 mr-2" /> フィルター・リスト表示
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
                        <button key={region.name} onClick={() => { setSelectedRegion(selectedRegion === region.name ? null : region.name); setSelectedPrefecture(null) }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedRegion === region.name ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground hover:bg-secondary/70"}`}>{region.name}</button>
                      ))}
                    </div>
                  </div>
                  {selectedRegion && (
                    <div>
                      <Label className="text-sm font-medium text-foreground mb-2 block">都道府県</Label>
                      <div className="flex flex-wrap gap-2">
                        {regions.find((r) => r.name === selectedRegion)?.prefectures.map((pref) => (
                          <button key={pref} onClick={() => setSelectedPrefecture(selectedPrefecture === pref ? null : pref)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedPrefecture === pref ? "bg-primary/20 text-primary" : "bg-secondary/50 text-muted-foreground hover:bg-secondary/70"}`}>{pref}</button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-foreground mb-2 block">カテゴリ</Label>
                    <div className="space-y-2">
                      {facilityTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox id={type} checked={selectedCategories.includes(type)} onCheckedChange={() => handleCategoryToggle(type)} />
                          <Label htmlFor={type} className="text-sm text-muted-foreground cursor-pointer">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* ★ここが変更点: filteredFacilities ではなく visibleFacilities をマッピング */}
              <GlassCard className="h-[400px] flex flex-col">
                <h3 className="font-semibold text-foreground mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2"><ListIcon className="w-4 h-4 text-primary" /> 表示エリア内の施設</span>
                  <span className="text-xs font-normal text-muted-foreground">{visibleFacilities.length}件</span>
                </h3>
                <div className="space-y-2 overflow-y-auto pr-2 flex-1">
                  {visibleFacilities.map(facility => (
                    <div 
                      key={facility.id} 
                      onClick={() => { 
                        setSelectedFacility(facility); 
                        setCenter([facility.lat!, facility.lng!]); 
                        setMapZoom(14); 
                        setClusterFacilities([]); 
                      }} 
                      className="block group"
                    >
                      <div className={`p-3 rounded-lg border transition-colors cursor-pointer relative ${selectedFacility?.id === facility.id ? 'bg-primary/10 border-primary/30' : 'border-border/50 hover:bg-secondary/50'}`}>
                        <h4 className="font-medium text-sm text-foreground mb-1 group-hover:text-primary transition-colors pr-5 line-clamp-1">
                          {facility.name}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                          <span className="line-clamp-1 mr-2">{facility.prefecture} {facility.city}</span>
                          {userLocation && (
                            <span className="text-accent font-medium shrink-0">
                              {((facility as any)._distance || 0) < 1 ? Math.round((facility as any)._distance * 1000) + 'm' : ((facility as any)._distance || 0).toFixed(1) + 'km'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {visibleFacilities.length === 0 && (
                     <div className="text-center py-8 text-muted-foreground text-sm">画面内に該当する施設がありません</div>
                  )}
                </div>
              </GlassCard>
            </aside>

            <div className="relative">
              {isLoading ? (
                <GlassCard className="p-2 sm:p-4 flex flex-col items-center justify-center min-h-[400px]">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                  <p>地図を読み込み中...</p>
                </GlassCard>
              ) : (
                <GlassCard className="p-2 sm:p-4 h-[600px] relative overflow-hidden">
                  
                  <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                    <Button onClick={handleZoomIn} size="icon" className="glass bg-background/60 hover:bg-primary/20 text-foreground border-border/40 w-10 h-10 rounded-xl shadow-lg">
                      <Plus className="w-5 h-5" />
                    </Button>
                    <Button onClick={handleZoomOut} size="icon" className="glass bg-background/60 hover:bg-primary/20 text-foreground border-border/40 w-10 h-10 rounded-xl shadow-lg">
                      <Minus className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* マップのラッパー */}
                  <div className="w-full h-full rounded-xl overflow-hidden bg-background/50 relative">
                    <Map 
                      center={center} 
                      zoom={mapZoom} 
                      onBoundsChanged={({ center, zoom, bounds }) => {
                        setCenter(center)
                        setMapZoom(zoom)
                        // bounds: { ne: [lat, lng], sw: [lat, lng] } -> [westLng, southLat, eastLng, northLat]
                        setMapBounds([bounds.sw[1], bounds.sw[0], bounds.ne[1], bounds.ne[0]])
                      }}
                      mouseEvents={true}
                      touchEvents={true}
                    >
                      {clusters.map((cluster) => {
                        const [lng, lat] = cluster.geometry.coordinates;
                        const { cluster: isCluster, point_count: pointCount } = cluster.properties as any;

                        if (isCluster) {
                          const size = 30 + (pointCount / points.length) * 20;
                          return (
                            <Overlay key={`cluster-${cluster.id}`} anchor={[lat, lng]} offset={[size / 2, size / 2]}>
                              <div 
                                className="bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-background cursor-pointer hover:bg-primary hover:scale-110 transition-all"
                                style={{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.max(12, size/3)}px` }}
                                onClick={() => {
                                  if (!supercluster) return;
                                  const leaves = supercluster.getLeaves(cluster.id as number, Infinity);
                                  const facilityList = leaves.map((f: any) => f.properties.facility);
                                  setClusterFacilities(facilityList);
                                  setSelectedFacility(null);

                                  const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id as number), 18);
                                  setCenter([lat, lng]);
                                  setMapZoom(expansionZoom);
                                }}
                              >
                                {pointCount}
                              </div>
                            </Overlay>
                          );
                        }

                        const facility = (cluster.properties as any).facility;
                        const isSelected = selectedFacility?.id === facility.id;

                        return (
                          <Overlay key={`facility-${facility.id}`} anchor={[lat, lng]} offset={[16, 32]}>
                            <div 
                              className={`cursor-pointer transition-all ${isSelected ? 'scale-125 z-10' : 'hover:scale-110'}`}
                              onClick={() => { setSelectedFacility(facility); setClusterFacilities([]); }}
                            >
                              <MapPin className={`w-8 h-8 ${isSelected ? 'text-accent drop-shadow-xl' : 'text-primary drop-shadow-md'}`} fill="var(--background)" strokeWidth={1.5} />
                            </div>
                          </Overlay>
                        )
                      })}

                      {userLocation && (
                        <Overlay anchor={userLocation} offset={[10, 10]}>
                          <div className="w-5 h-5 bg-blue-500 border-2 border-white rounded-full animate-pulse shadow-lg" />
                        </Overlay>
                      )}
                    </Map>

                    {/* ★UI崩れ修正ポイント1：詳細カードを「左下(left-6)」に移動し、クレジット表記と被らないように。さらにz-indexを30に */}
                    {selectedFacility && (
                      <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-80 z-30">
                        <GlassCard className="glass-strong shadow-2xl backdrop-blur-md border border-border/50">
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

                    {/* ★UI崩れ修正ポイント2：Flexboxのスクロール領域に min-h-0 を付与してカードからはみ出すバグを解消 */}
                    {clusterFacilities.length > 0 && (
                      <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-80 z-30">
                        <GlassCard className="glass-strong shadow-2xl backdrop-blur-md border border-border/50 max-h-[320px] flex flex-col p-4">
                          <div className="flex items-center justify-between mb-3 border-b border-border/30 pb-2 shrink-0">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                              <ListIcon className="w-4 h-4 text-primary" />
                              <span>エリア内の施設 ({clusterFacilities.length}件)</span>
                            </div>
                            <button onClick={() => setClusterFacilities([])} className="text-muted-foreground hover:text-foreground transition-colors">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
                            {clusterFacilities.map((facility) => (
                              <div key={facility.id} className="p-2 rounded-lg border border-border/40 hover:bg-primary/10 transition-all flex items-center justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-semibold text-foreground truncate">{facility.name}</h4>
                                  <p className="text-[10px] text-muted-foreground truncate">{facility.city || facility.prefecture}</p>
                                </div>
                                <Link href={`/CBMD/facility/${facility.id}`} className="shrink-0">
                                  <Button size="icon" variant="ghost" className="w-7 h-7 text-primary hover:text-primary/80">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </Button>
                                </Link>
                              </div>
                            ))}
                          </div>
                        </GlassCard>
                      </div>
                    )}
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
    </ContentPageLayout>
  )
}
