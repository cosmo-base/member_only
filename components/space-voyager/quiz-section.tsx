"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { quizQuestion } from "@/lib/voyagerdata";
import { HelpCircle, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuizSection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedIndex(index);
    setHasAnswered(true);
  };

  const handleReset = () => {
    setSelectedIndex(null);
    setHasAnswered(false);
  };

  const isCorrect = selectedIndex === quizQuestion.correctIndex;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c1428] via-[#0e1632] to-[#0c1428]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block text-cyan-400 text-sm font-medium mb-4 tracking-wider">
            TRY QUIZ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
            宇宙クイズに挑戦
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            検定ではこのような問題が出題されます
          </p>
        </div>

        {/* Quiz card */}
        <Card className="glass-card p-6 md:p-8 rounded-3xl max-w-2xl mx-auto">
          {/* Question */}
          <div className="flex items-start gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-white text-lg font-medium leading-relaxed">
              {quizQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {quizQuestion.options.map((option, index) => {
              const isSelected = selectedIndex === index;
              const isCorrectOption = index === quizQuestion.correctIndex;
              
              let optionClass = "glass hover:border-white/20";
              if (hasAnswered) {
                if (isCorrectOption) {
                  optionClass = "bg-green-500/10 border-green-500/30";
                } else if (isSelected && !isCorrectOption) {
                  optionClass = "bg-red-500/10 border-red-500/30";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(index)}
                  disabled={hasAnswered}
                  className={cn(
                    "w-full p-4 rounded-xl text-left transition-all duration-300 flex items-center gap-3 border",
                    optionClass,
                    !hasAnswered && "cursor-pointer hover:scale-[1.02]",
                    hasAnswered && "cursor-default"
                  )}
                >
                  <span className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium shrink-0",
                    hasAnswered && isCorrectOption
                      ? "bg-green-500/20 text-green-400"
                      : hasAnswered && isSelected && !isCorrectOption
                      ? "bg-red-500/20 text-red-400"
                      : "bg-white/10 text-gray-400"
                  )}>
                    {hasAnswered && isCorrectOption ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : hasAnswered && isSelected && !isCorrectOption ? (
                      <XCircle className="w-5 h-5" />
                    ) : (
                      String.fromCharCode(65 + index)
                    )}
                  </span>
                  <span className={cn(
                    "text-sm",
                    hasAnswered && isCorrectOption
                      ? "text-green-400"
                      : hasAnswered && isSelected && !isCorrectOption
                      ? "text-red-400"
                      : "text-gray-300"
                  )}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Result & Explanation */}
          {hasAnswered && (
            <div className={cn(
              "p-5 rounded-xl mb-4",
              isCorrect ? "bg-green-500/10" : "bg-cyan-400/5"
            )}>
              <p className={cn(
                "font-semibold mb-2",
                isCorrect ? "text-green-400" : "text-cyan-400"
              )}>
                {isCorrect ? "正解です！" : "残念、不正解です"}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                {quizQuestion.explanation}
              </p>
            </div>
          )}

          {/* Reset button */}
          {hasAnswered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              もう一度挑戦
            </button>
          )}
        </Card>

        <p className="mt-6 text-center text-xs text-gray-600">
          ※ このクイズは実際の検定問題の一例です
        </p>
      </div>
    </section>
  );
}
