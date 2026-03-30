"use client";

import { Card } from "@/components/ui/card";
import { examLevels, navigatorLevel } from "@/lib/voyagerdata";
import { Rocket, Users, ChevronRight, Star, Shield } from "lucide-react";

export function LevelsSection() {
  return (
    <section id="levels" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#101a35] via-[#0c1628] to-[#0a1220]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-cyan-400 text-sm font-medium mb-4 tracking-wider">
            LEVELS & CERTIFICATIONS
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            級・認定について
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            2つのレーンで構成される認定制度
          </p>
        </div>

        {/* Two lane structure */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Lane A: Exam levels */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">宇宙に関する検定</h3>
                <p className="text-gray-500 text-sm">知識を体系的に深める</p>
              </div>
            </div>

            <div className="space-y-3">
              {examLevels.map((level, index) => (
                <Card
                  key={level.id}
                  className={`glass-card p-4 rounded-xl group hover:border-cyan-400/30 transition-all duration-300 ${
                    level.id === "explorer" ? "border-cyan-400/20 bg-gradient-to-r from-cyan-400/5 to-transparent" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      level.id === "explorer"
                        ? "bg-gradient-to-br from-cyan-400/30 to-purple-500/20"
                        : "bg-white/5"
                    }`}>
                      {level.id === "explorer" ? (
                        <Star className="w-6 h-6 text-cyan-400" />
                      ) : (
                        <span className="text-lg font-bold text-gray-400">{level.name}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-semibold">
                          {level.name}
                        </h4>
                        <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-white/5">
                          {level.subtitle}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                        {level.description}
                      </p>
                      <p className="text-cyan-400/70 text-xs">
                        {level.requirement}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors shrink-0" />
                  </div>
                </Card>
              ))}
            </div>

            {/* Flow indicator */}
            <div className="mt-4 pl-6 border-l border-dashed border-gray-700">
              <p className="text-gray-500 text-sm">
                5級 → 4級 → 3級 → 2級 → 1級 → Space Explorer
              </p>
            </div>
          </div>

          {/* Lane B: Community certification */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">コミュニティ活性化認定</h3>
                <p className="text-gray-500 text-sm">仲間をつなぎ、学びの輪を広げる</p>
              </div>
            </div>

            <Card className="glass-card p-6 rounded-2xl border-purple-400/20 bg-gradient-to-br from-purple-400/5 to-transparent h-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400/30 to-cyan-400/10 flex items-center justify-center shrink-0">
                  <Shield className="w-8 h-8 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xl mb-1">
                    {navigatorLevel.name}
                  </h4>
                  <span className="text-purple-400/80 text-sm">
                    {navigatorLevel.subtitle}
                  </span>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                {navigatorLevel.description}
              </p>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-purple-400/80 text-sm">
                  {navigatorLevel.requirement}
                </p>
              </div>
            </Card>

            {/* Dual certification note */}
            <Card className="glass-card p-5 rounded-xl mt-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-400/20 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h5 className="text-white font-medium text-sm mb-1">
                    両方の認定を得ると
                  </h5>
                  <p className="text-gray-500 text-sm">
                    Space ExplorerとSpace Navigator両方の認定を持つ方には、コミュニティ内での権限拡張があります。
                  </p>
                </div>
              </div>
            </Card>

            {/* Requirements summary */}
            <div className="mt-6 space-y-2">
              <h5 className="text-gray-400 text-sm font-medium mb-3">受験資格まとめ</h5>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5">
                  <span className="text-gray-400">2級〜5級</span>
                  <span className="text-gray-300">どなたでも受験可能</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5">
                  <span className="text-gray-400">1級</span>
                  <span className="text-gray-300">2級認定者が対象</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5">
                  <span className="text-gray-400">Space Explorer</span>
                  <span className="text-gray-300">1級認定者が対象</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5">
                  <span className="text-gray-400">Space Navigator</span>
                  <span className="text-gray-300">1つ以上の認定者が対象</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
