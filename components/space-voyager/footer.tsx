"use client";

import Link from "next/link";
import Image from "next/image"; // ← Imageコンポーネントのインポートを追加
import { footerLinks } from "@/lib/voyagerdata";
import { Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <>
      <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-4">
          <Image
            src="/member-only/images/cosmo-base-logo.png"
            alt="Cosmo Base"
            width={150}
            height={40}
            className="h-8 w-auto opacity-70"
          />
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Cosmo Base. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* <footer className="relative bg-[#060a10] border-t border-white/5">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20" />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#0d1520] to-[#1a2535] border border-cyan-400/30 flex items-center justify-center">
                    <span className="text-cyan-400 font-bold text-sm">SV</span>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-white">Space Voyager</span>
                  <span className="text-cyan-400/80 text-xs block -mt-0.5">検定</span>
                </div>
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Cosmo Base発、宇宙をもっと身近にするための検定制度。
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="#"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-400/10 hover:text-cyan-400 transition-colors text-gray-500"
                >
                  <Twitter className="w-4 h-4" />
                </Link>
                <Link
                  href="#"
                  aria-label="Discord"
                  className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-400/10 hover:text-cyan-400 transition-colors text-gray-500"
                >
                  <MessageCircle className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-white mb-4 text-sm">検定について</h4>
              <ul className="space-y-2">
                {footerLinks.about.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-500 text-sm hover:text-cyan-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-4 text-sm">サポート</h4>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-500 text-sm hover:text-cyan-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-white mb-4 text-sm">Cosmo Base</h4>
              <ul className="space-y-2">
                {footerLinks.cosmoBase.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-500 text-sm hover:text-cyan-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-600 text-sm">
                Powered by Cosmo Base
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-gray-600 text-xs">
                <Link href="#" className="hover:text-gray-400 transition-colors">
                  利用規約
                </Link>
                <Link href="#" className="hover:text-gray-400 transition-colors">
                  プライバシーポリシー
                </Link>
                <Link href="#" className="hover:text-gray-400 transition-colors">
                  特定商取引法表記
                </Link>
              </div>
            </div>
            <div className="text-center text-gray-700 text-xs mt-6">
              © 2026 Space Voyager検定
            </div>
          </div>
        </div>
      </footer> 
      */}
    </>
  );
}
