// app/CBMD/facility/[id]/linked-events.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { TagBadge } from "@/components/tag-badge"
import { Button } from "@/components/ui/button"

export function LinkedEvents({ events }: { events: any[] }) {
  const [showPast, setShowPast] = useState(false)

  const parseDate = (dStr: string) => {
    if (!dStr) return null;
    const match = dStr.match(/(\d{4})[-/年\.]\s*(\d{1,2})[-/月\.]\s*(\d{1,2})/);
    if (!match) return null;
    return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
  }

  const today = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter(e => {
    const end = parseDate(e.endDate) || parseDate(e.date);
    if (!end) return true;
    return end >= today;
  });

  const pastEvents = events.filter(e => {
    const end = parseDate(e.endDate) || parseDate(e.date);
    if (!end) return false;
    return end < today;
  });

  if (events.length === 0) return null;

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-semibold text-foreground">連携イベント情報</h2>
      </div>
      <div className="space-y-4">
        {upcomingEvents.map((event, index) => (
          <Link href={`/CBED/${event.id}`} key={`upcoming-${index}`}>
            <div className="glass-strong rounded-xl p-4 hover:bg-primary/10 transition-colors cursor-pointer mb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-foreground mb-1 group-hover:text-primary">{event.title}</h3>
                </div>
                <TagBadge variant="accent">{event.date}</TagBadge>
              </div>
            </div>
          </Link>
        ))}

        {upcomingEvents.length === 0 && (
          <p className="text-sm text-muted-foreground px-2">現在予定されているイベントはありません。</p>
        )}

        {pastEvents.length > 0 && (
          <div className="pt-2">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={() => setShowPast(!showPast)}
            >
              {showPast ? (
                <><ChevronUp className="w-4 h-4 mr-2" /> 過去のイベントを隠す</>
              ) : (
                <><ChevronDown className="w-4 h-4 mr-2" /> 過去のイベントを表示する ({pastEvents.length}件)</>
              )}
            </Button>

            {showPast && (
              <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                {pastEvents.map((event, index) => (
                  <Link href={`/CBED/${event.id}`} key={`past-${index}`}>
                    <div className="glass-strong rounded-xl p-4 hover:bg-primary/10 transition-colors cursor-pointer mb-3 opacity-60 hover:opacity-100">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-foreground mb-1 group-hover:text-primary">{event.title}</h3>
                        </div>
                        <TagBadge variant="default">{event.date}</TagBadge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  )
}
