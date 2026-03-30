import { Header } from "@/components/space-voyager/header";
import { HeroSection } from "@/components/space-voyager/hero-section";
import { AboutSection } from "@/components/space-voyager/about-section";
import { LevelsSection } from "@/components/space-voyager/levels-section";
import { ThemesSection } from "@/components/space-voyager/themes-section";
import { BenefitsSection } from "@/components/space-voyager/benefits-section";
import { CosmoBaseSection } from "@/components/space-voyager/cosmo-base-section";
import { QuizSection } from "@/components/space-voyager/quiz-section";
import { FaqSection } from "@/components/space-voyager/faq-section";
import { Footer } from "@/components/space-voyager/footer";

export default function SpaceVoyagerPage() {
  return (
    <div className="min-h-screen bg-[#080c14]">
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-cyan-400 focus:text-[#080c14] focus:rounded-lg focus:shadow-lg"
      >
        メインコンテンツへスキップ
      </a>

      <Header />

      <main id="main-content">
        {/* 1. Hero - 宇宙への一歩を、ここから */}
        <HeroSection />

        {/* 2. About - 検定の位置づけ */}
        <AboutSection />

        {/* 3. Levels - 級・認定について（2レーン構成） */}
        <LevelsSection />

        {/* 4. Themes - 出題テーマ & 試験概要 */}
        <ThemesSection />

        {/* 5. Benefits - 得られるもの */}
        <BenefitsSection />

        {/* 6. Cosmo Base Connection */}
        <CosmoBaseSection />

        {/* 7. Quiz - 宇宙クイズに挑戦 */}
        <QuizSection />

        {/* 8. FAQ */}
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
}
