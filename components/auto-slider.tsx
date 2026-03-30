"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const slides = [
  {
    id: 0,
    title: "Cosmo Baseへようこそ",
    description: "宇宙をさらに身近にしていくコミュニティーです。\nCosmo Baseで宇宙を楽しみましょう。",
    image: "/member-only/images/slider-welcome.jpg",
    href: "/",
  },
  {
    id: 1,
    title: "オープニング企画実施中",
    description: "Cosmo Base参加者ページのオープンを記念して、様々な企画を実施中です。ぜひご参加ください！",
    image: /member-only"/images/slider-opening.jpg",
    href: "/shittoku",
  },
  {
    id: 2,
    title: "おすすめのイベント",
    description: "今月注目の宇宙イベントをピックアップ。見逃せない観測会や講演会をチェック！",
    image: "/member-only/images/slider-events.jpg",
    href: "/ittoide",
  },
  {
    id: 3,
    title: "パートナーからのお知らせ",
    description: "Cosmo Baseのパートナー企業・団体からの最新情報をお届けします。",
    image: "/member-only/images/slider-partner.jpg",
    href: "https://fsifofficial.github.io/CosmoBase/partners",
  },
  {
    id: 4,
    title: "意見箱",
    description: "Cosmo Baseへのご意見・ご要望をお聞かせください。より良いコミュニティーづくりにご協力ください。",
    image: "/member-only/images/slider-feedback.jpg",
    href: "/shittoku/request",
  },
]

export function AutoSlider() {
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const extendedSlides = [
    slides[slides.length - 1],
    ...slides,
    slides[0],
  ]

  const goToNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
  }, [isTransitioning])

  const goToPrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
  }, [isTransitioning])

  useEffect(() => {
    const timer = setInterval(goToNext, 5000)
    return () => clearInterval(timer)
  }, [goToNext])

  useEffect(() => {
    if (!isTransitioning) return

    const timer = setTimeout(() => {
      setIsTransitioning(false)
      
      if (currentIndex === extendedSlides.length - 1) {
        setCurrentIndex(1)
      }
      if (currentIndex === 0) {
        setCurrentIndex(slides.length)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [currentIndex, isTransitioning, extendedSlides.length])

  const goToSlide = (realIndex: number) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(realIndex + 1)
  }

  const actualIndex = currentIndex === 0 
    ? slides.length - 1 
    : currentIndex === extendedSlides.length - 1 
    ? 0 
    : currentIndex - 1

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <div
        className={`flex ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {extendedSlides.map((slide, index) => (
          <Link
            key={`${slide.id}-${index}`}
            href={slide.href}
            className="min-w-full relative block group"
          >
            <div className="relative aspect-[1280/670] overflow-hidden rounded-xl">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={index === 0 || index === 1}
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
              
              <div className="absolute inset-0 flex items-center p-6 md:p-12">
                <div className="max-w-xl">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {slide.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base whitespace-pre-line">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80 backdrop-blur-sm"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === actualIndex
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
