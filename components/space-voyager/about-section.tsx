"use client";

import { Card } from "@/components/ui/card";
import { HelpCircle, Newspaper, MessageCircle, GraduationCap } from "lucide-react";

const journeySteps = [
  {
    icon: HelpCircle,
    title: "宇宙クイズで興味を持つ",
    description: "毎日配信されるクイズで宇宙の面白さに触れる",
  },
  {
    icon: Newspaper,
    title: "ニュースやイベントで知る",
    description: "最新の宇宙ニュースやイベントで知識を広げる",
  },
  {
    icon: MessageCircle,
    title: "コミュニティで対話する",
    description: "宇宙好きの仲間と交流し、学びを深める",
  },
  {
    icon: GraduationCap,
    title: "検定で知識を体系化",
    description: "Space Voyager検定で学びを可視化する",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1428] via-[#0f1830] to-[#101a35]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-cyan-400 text-sm font-medium mb-4 tracking-wider">
            ABOUT
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            検定の位置づけ
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed text-pretty">
            この検定は単独の資格制度ではなく、
            <span className="text-cyan-400">Cosmo Baseの学びの流れ</span>の中にあるものです。
          </p>
        </div>

        {/* Journey visualization */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4 md:gap-6">
            {journeySteps.map((step, index) => (
              <div key={step.title} className="relative">
                {/* Connector line */}
                {index < journeySteps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-cyan-400/30 to-transparent" />
                )}
                
                <Card className="glass-card p-6 rounded-2xl h-full group hover:border-cyan-400/30 transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="w-7 h-7 text-cyan-400" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0d1428] border border-cyan-400/30 flex items-center justify-center text-xs text-cyan-400 font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <h3 className="text-white font-semibold mb-2 text-sm md:text-base">
                      {step.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mt-16 max-w-3xl mx-auto text-left">
          <Card className="glass-card p-8 md:p-10 rounded-3xl">
            <p className="text-gray-300 leading-relaxed mb-6">
              Space Voyager検定は、天文学から宇宙開発、宇宙ビジネスまで、
              宇宙に関する幅広い知識を体系的に学べる検定制度です。
            </p>
            <p className="text-gray-400 leading-relaxed">
              「宇宙を、楽しむ。」という文脈のもと、受験を急かすのではなく、
              <span className="text-cyan-400">宇宙との接点を広げる入口</span>
              として設計されています。初心者にも親しみやすく、知的で未来感のある体験を提供します。
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
