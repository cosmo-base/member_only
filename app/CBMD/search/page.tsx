"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search, MapPin, Star, Calendar, X } from "lucide-react"
import { StarField } from "@/components/star-field"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GlassCard } from "@/components/glass-card"
import { TagBadge } from "@/components/tag-badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { sampleFacilities, spacecraftTags, categoryTags, regions, facilityTypes } from "@/lib/data"

function SearchContent() {
  const searchParams = useSearchParams()
  const initialTag = searchParams.get("tag") || ""
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTag ? [initialTag] : [])
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const allTags = [...spacecraftTags, ...categoryTags]

  const filteredFacilities = useMemo(() => {
    return sampleFacilities.filter((facility) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = facility.name.toLowerCase().includes(query)
        const matchesDescription = facility.description.toLowerCase().includes(query)
        const matchesTags = facility.tags.some((tag) => tag.toLowerCase().includes(query))
        const matchesLocation = facility.prefecture.includes(query) || facility.city.includes(query)
        if (!matchesName && !matchesDescription && !matchesTags && !matchesLocation) return false
      }

      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some((tag) => facility.tags.includes(tag))
        if (!hasMatchingTag) return false
      }

      if (selectedRegion && facility.region !== selectedRegion) return false
      if (selectedPrefecture && facility.prefecture !== selectedPrefecture) return false
      if (selectedCategory && facility.category !== selectedCategory) return false

      return true
    })
  }, [searchQuery, selectedTags, selectedRegion, selectedPrefecture, selectedCategory])

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedTags([])
    setSelectedRegion(null)
    setSelectedPrefecture(null)
    setSelectedCategory(null)
  }

  const hasActiveFilters = searchQuery || selectedTags.length > 0 || selectedRegion || selectedPrefecture || selectedCategory

  return (
    <div className="min-h-screen relative">
      <StarField />
      <Header />

      <main className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">検索で探す</h1>
            <p className="text-muted-foreground mb-8">地域、カテゴリ、タグで施設を検索</p>

            {/* Main Search Input */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="施設名、地域、探査機名で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-6 text-lg glass border-border/30 rounded-2xl focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <GlassCard className="mb-8">
            <div className="space-y-6">
              {/* Region Filter */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">地方で絞り込み</h3>
                <div className="flex flex-wrap gap-2">
                  {regions.map((region) => (
                    <button
                      key={region.name}
                      onClick={() => {
                        setSelectedRegion(selectedRegion === region.name ? null : region.name)
                        setSelectedPrefecture(null)
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedRegion === region.name
                          ? "bg-primary/20 text-primary glow"
                          : "bg-secondary/50 text-muted-foreground hover:bg-secondary/70"
                      }`}
                    >
                      {region.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prefecture Filter */}
              {selectedRegion && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">都道府県で絞り込み</h3>
                  <div className="flex flex-wrap gap-2">
                    {regions
                      .find((r) => r.name === selectedRegion)
                      ?.prefectures.map((pref) => (
                        <button
                          key={pref}
                          onClick={() => setSelectedPrefecture(selectedPrefecture === pref ? null : pref)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            selectedPrefecture === pref
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary/50 text-muted-foreground hover:bg-secondary/70"
                          }`}
                        >
                          {pref}
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">施設カテゴリ</h3>
                <div className="flex flex-wrap gap-2">
                  {facilityTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedCategory(selectedCategory === type ? null : type)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        selectedCategory === type
                          ? "bg-accent/20 text-accent"
                          : "bg-secondary/50 text-muted-foreground hover:bg-secondary/70"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag Search */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">タグで検索</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedTags.includes(tag)
                          ? "bg-primary text-primary-foreground glow"
                          : "bg-secondary/50 text-muted-foreground hover:bg-secondary/70"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 pt-4 border-t border-border/30">
                  <span className="text-sm text-muted-foreground">適用中:</span>
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <TagBadge variant="primary">
                        「{searchQuery}」
                        <button onClick={() => setSearchQuery("")} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </TagBadge>
                    )}
                    {selectedTags.map((tag) => (
                      <TagBadge key={tag} variant="primary">
                        {tag}
                        <button onClick={() => handleTagToggle(tag)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </TagBadge>
                    ))}
                    {selectedRegion && (
                      <TagBadge variant="accent">
                        {selectedRegion}
                        <button onClick={() => { setSelectedRegion(null); setSelectedPrefecture(null); }} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </TagBadge>
                    )}
                    {selectedPrefecture && (
                      <TagBadge variant="accent">
                        {selectedPrefecture}
                        <button onClick={() => setSelectedPrefecture(null)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </TagBadge>
                    )}
                    {selectedCategory && (
                      <TagBadge>
                        {selectedCategory}
                        <button onClick={() => setSelectedCategory(null)} className="ml-1">
                          <X className="w-3 h-3" />
                        </button>
                      </TagBadge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground ml-auto">
                    すべてクリア
                  </Button>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-muted-foreground">
              <span className="text-primary font-semibold text-xl">{filteredFacilities.length}</span> 件の施設が見つかりました
            </p>
          </div>

          {/* Results Grid */}
          {filteredFacilities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility) => (
                <Link key={facility.id} href={`/facility/${facility.id}`}>
                  <GlassCard hover className="h-full">
                    <div className="aspect-video rounded-xl bg-secondary/30 mb-4 overflow-hidden flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <TagBadge variant="primary">{facility.category}</TagBadge>
                          {facility.hasPlanetarium && (
                            <TagBadge variant="accent">
                              <Star className="w-3 h-3 mr-1" />
                              プラネタリウム
                            </TagBadge>
                          )}
                        </div>
                        <h3 className="font-semibold text-foreground line-clamp-2">{facility.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {facility.prefecture} {facility.city}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{facility.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {facility.tags.slice(0, 4).map((tag) => (
                          <TagBadge key={tag}>{tag}</TagBadge>
                        ))}
                      </div>
                      {facility.hasEvent && (
                        <div className="flex items-center gap-1 text-xs text-accent">
                          <Calendar className="w-3 h-3" />
                          イベント開催中
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          ) : (
            <GlassCard className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">該当する施設が見つかりませんでした</h3>
              <p className="text-muted-foreground mb-4">検索条件を変更してお試しください</p>
              <Button onClick={clearAllFilters} className="bg-primary/20 text-primary hover:bg-primary/30">
                フィルターをクリア
              </Button>
            </GlassCard>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">読み込み中...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
