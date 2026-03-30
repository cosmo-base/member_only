"use client";

import { Card } from "@/components/ui/card";
import { examThemes, examOverview } from "@/lib/voyagerdata";
import { Star, Rocket, Briefcase, History, Scale, Compass, BookOpen, Clock, FileText, CheckCircle, Calendar } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Star,
  Rocket,
  Briefcase,
  History,
  Scale,
  Compass,
  BookOpen,
};

export function ThemesSection() {
  return (
    <section id="themes" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1220] via-[#0c1428] to-[#0e1630]" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-cyan-400/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-cyan-400 text-sm font-medium mb-4 tracking-wider">
            EXAM THEMES
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            出題テーマ
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            7つのテーマから宇宙を多角的に学ぶ
          </p>
        </div>

        {/* Theme cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
          {examThemes.map((theme, index) => {
            const IconComponent = iconMap[theme.icon] || Star;
            return (
              <Card
                key={theme.id}
                className="glass-card p-5 rounded-2xl group hover:border-cyan-400/30 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-white font-semibold mb-1">{theme.name}</h3>
                <p className="text-gray-500 text-sm">{theme.description}</p>
              </Card>
            );
          })}

          {/* Total card */}
          <Card className="glass-card p-5 rounded-2xl bg-gradient-to-br from-cyan-400/10 to-purple-500/5 border-cyan-400/20 col-span-2 md:col-span-1">
            <div className="flex flex-col h-full justify-center items-center text-center">
              <span className="text-4xl font-bold text-cyan-400 mb-2">7</span>
              <span className="text-gray-400 text-sm">テーマ</span>
            </div>
          </Card>
        </div>

        {/* Exam overview */}
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card p-8 md:p-10 rounded-3xl">
            <h3 className="text-white font-bold text-xl mb-6 text-center">試験概要</h3>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-gray-500 text-xs mb-1">出題形式</p>
                <p className="text-white font-medium text-sm">4択問題</p>
                <p className="text-gray-600 text-xs mt-1">Explorer: 4択＋記述</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-gray-500 text-xs mb-1">問題数</p>
                <p className="text-white font-medium text-sm">5テーマ × 10問</p>
                <p className="text-gray-600 text-xs mt-1">合計50問</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-gray-500 text-xs mb-1">試験時間</p>
                <p className="text-white font-medium text-sm">50分</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                <span className="text-cyan-400">•</span>
                <p className="text-gray-400">
                  毎回7テーマの中から5テーマを選択して出題されます
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                <span className="text-cyan-400">•</span>
                <p className="text-gray-400">
                  Space Explorerは4択問題に加えて記述を含む総合問題となります
                </p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                <span className="text-cyan-400">•</span>
                <p className="text-gray-400">
                  オンライン/オフライン両対応を予定しています（詳細は今後公開）
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
