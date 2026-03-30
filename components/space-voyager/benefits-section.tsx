"use client";

import { Card } from "@/components/ui/card";
import { benefits } from "@/lib/voyagerdata";
import { Award, BarChart, UserCheck, MessageCircle, Target, Users } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Award,
  BarChart,
  UserCheck,
  MessageCircle,
  Target,
  Users,
};

export function BenefitsSection() {
  return (
    <section id="benefits" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e1630] via-[#101a38] to-[#0c1428]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-cyan-400 text-sm font-medium mb-4 tracking-wider">
            WHAT YOU GET
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            得られるもの
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            権威的な資格ではなく、
            <span className="text-cyan-400">学びの可視化と参加価値</span>
            を大切にしています
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {benefits.map((benefit) => {
            const IconComponent = iconMap[benefit.icon] || Award;
            return (
              <Card
                key={benefit.id}
                className="glass-card p-6 rounded-2xl group hover:border-cyan-400/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Message */}
        <div className="mt-16 text-center">
          <Card className="inline-block glass-card px-8 py-5 rounded-2xl">
            <p className="text-gray-400">
              検定を通じて、
              <span className="text-white font-medium">Cosmo Baseでの会話や参加がより深く</span>
              なります
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
