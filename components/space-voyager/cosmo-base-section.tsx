"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cosmoBaseFeatures } from "@/lib/voyagerdata";
import { HelpCircle, Newspaper, Lightbulb, Calendar, Library, GraduationCap, ArrowRight, Sparkles } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  HelpCircle,
  Newspaper,
  Lightbulb,
  Calendar,
  Library,
  GraduationCap,
};

const keywords = [
  { text: "学ぶ", color: "text-cyan-400" },
  { text: "つながる", color: "text-purple-400" },
  { text: "体験する", color: "text-cyan-300" },
  { text: "知識を体系化する", color: "text-white" },
];

export function CosmoBaseSection() {
  return (
    <section id="cosmo-base" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1428] via-[#0a1220] to-[#080c18]" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-cyan-400 text-sm font-medium mb-4 tracking-wider">
            COSMO BASE CONNECTION
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            Cosmo Baseとのつながり
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            検定だけで完結せず、Cosmo Base全体の体験の一部として
          </p>
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {keywords.map((keyword, index) => (
            <div
              key={keyword.text}
              className="flex items-center gap-2 px-5 py-2 rounded-full glass"
            >
              <Sparkles className={`w-4 h-4 ${keyword.color}`} />
              <span className={`font-medium ${keyword.color}`}>{keyword.text}</span>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-12">
          {cosmoBaseFeatures.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || HelpCircle;
            const isExam = feature.id === "exam";
            
            return (
              <Card
                key={feature.id}
                className={`p-6 rounded-2xl group transition-all duration-300 ${
                  isExam
                    ? "glass-card border-cyan-400/30 bg-gradient-to-br from-cyan-400/10 to-purple-500/5"
                    : "glass-card hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                    isExam
                      ? "bg-gradient-to-br from-cyan-400/30 to-purple-500/20"
                      : "bg-white/5"
                  }`}>
                    <IconComponent className={`w-6 h-6 ${isExam ? "text-cyan-400" : "text-gray-400"}`} />
                  </div>
                  <div>
                    <h3 className={`font-semibold mb-1 ${isExam ? "text-cyan-400" : "text-white"}`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{feature.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Message card */}
        <Card className="glass-card p-8 md:p-10 rounded-3xl max-w-3xl mx-auto text-center">
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            Space Voyager検定は、Cosmo Baseでの
            <span className="text-cyan-400">「学ぶ・つながる・体験する」</span>
            の流れを体系化し、知識を確かめる機会を提供します。
          </p>
          <p className="text-gray-500 leading-relaxed">
            クイズやニュースで興味を深め、コミュニティで仲間と対話し、
            検定で自分の理解度を可視化する。
            そんな循環の中で、宇宙をより身近に感じてください。
          </p>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://fsifofficial.github.io/CosmoBase/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-button text-cyan-400 hover:text-white font-medium transition-all"
          >
            Cosmo Baseを見る
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
