"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";

// Seeded random for consistent SSR/client rendering
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function generateStars(count: number, seed: number) {
  return Array.from({ length: count }).map((_, i) => ({
    left: seededRandom(seed + i * 1) * 100,
    top: seededRandom(seed + i * 2) * 100,
    size: seededRandom(seed + i * 3) * 2 + 1,
    isCyan: seededRandom(seed + i * 4) > 0.7,
    opacity: seededRandom(seed + i * 5) * 0.6 + 0.2,
    delay: seededRandom(seed + i * 6) * 4,
  }));
}

const heroStars = generateStars(80, 42);

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080c14] via-[#0a1020] to-[#0d1428]" />
      
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {heroStars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.isCyan ? '#4FD1FF' : '#ffffff',
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Orbital rings */}
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] border border-cyan-400/5 rounded-full animate-orbit" style={{ animationDuration: '120s' }} />
        <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-purple-400/5 rounded-full animate-orbit" style={{ animationDuration: '90s', animationDirection: 'reverse' }} />
        <div className="absolute w-[200px] h-[200px] md:w-[400px] md:h-[400px] border border-cyan-400/10 rounded-full" />
      </div>

      {/* Gradient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-400/90 text-sm">Cosmo Base発の検定制度</span>
          </div>

          {/* Title */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up text-balance"
            style={{ animationDelay: '0.1s' }}
          >
            Space Voyager検定
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl sm:text-2xl md:text-3xl text-cyan-400/90 font-medium mb-6 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            宇宙への一歩を、ここから。
          </p>

          {/* Description */}
          <p 
            className="text-base sm:text-lg text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto animate-fade-in-up text-pretty"
            style={{ animationDelay: '0.3s' }}
          >
            Cosmo Base発、宇宙をもっと身近にするための検定制度。
            <br className="hidden sm:block" />
            学び、楽しみ、つながる体験の中で、自分の理解を確かめられます。
          </p>

          {/* CTAs */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Link
              href="#about"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-[#0a1020] font-semibold text-base shadow-lg shadow-cyan-400/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-105"
            >
              検定概要を見る
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#cosmo-base"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full glass-button text-gray-300 font-medium text-base hover:text-white"
            >
              Cosmo Baseとのつながり
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <span className="text-xs">Scroll</span>
            <div className="w-5 h-8 rounded-full border border-gray-600 flex justify-center pt-2">
              <div className="w-1 h-2 bg-gray-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
