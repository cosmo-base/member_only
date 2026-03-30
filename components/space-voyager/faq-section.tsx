"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { faqItems } from "@/lib/voyagerdata";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, HelpCircle } from "lucide-react";

export function FaqSection() {
  return (
    <section id="faq" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080c18] via-[#0a1020] to-[#0c1428]" />
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block text-cyan-400 text-sm font-medium mb-4 tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
            よくある質問
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            検定について、よくいただく質問をまとめました
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-16">
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card rounded-2xl border-white/5 overflow-hidden data-[state=open]:border-cyan-400/20"
              >
                <AccordionTrigger className="px-6 py-5 text-left font-medium text-white hover:no-underline hover:text-cyan-400 [&[data-state=open]]:text-cyan-400 [&>svg]:text-gray-500 [&[data-state=open]>svg]:text-cyan-400">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 shrink-0 mt-0.5 text-gray-500" />
                    <span>{item.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-gray-400 leading-relaxed">
                  <div className="pl-8">
                    {item.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div id="contact" className="max-w-xl mx-auto">
          <Card className="glass-card p-8 rounded-3xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center mx-auto mb-5">
              <Mail className="w-7 h-7 text-cyan-400" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-3">
              その他のご質問
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              上記以外のご質問やお問い合わせは、
              下記フォームよりお気軽にご連絡ください。
            </p>
            <a
              href="https://fsifofficial.github.io/CosmoBase/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-[#0a1020] font-semibold hover:shadow-lg hover:shadow-cyan-400/25 transition-all duration-300 hover:scale-105"
            >
              お問い合わせフォーム
            </a>
          </Card>
        </div>
      </div>
    </section>
  );
}
