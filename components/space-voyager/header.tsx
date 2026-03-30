"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { navItems } from "@/lib/voyagerdata";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#0a0f1a]/90 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/voyager" className="flex items-center gap-3 group">
            <img src={`/member-only/CBvoyager_logo.png`} alt="Space Voyager 検定" className="h-16"/>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="#cosmo-base"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cosmo Baseを知る
            </Link>
            <Link
              href="#about"
              className="glass-button px-5 py-2.5 rounded-full text-sm font-medium text-cyan-400 hover:text-white"
            >
              検定概要を見る
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label={isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0f1a]/98 backdrop-blur-xl border-t border-white/5">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
              <Link
                href="#cosmo-base"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-gray-400 hover:text-white transition-colors"
              >
                Cosmo Baseを知る
              </Link>
              <Link
                href="#about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block mx-4 py-3 glass-button rounded-xl text-center text-cyan-400 font-medium"
              >
                検定概要を見る
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
