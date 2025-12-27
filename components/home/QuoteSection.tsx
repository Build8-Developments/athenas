"use client";

import { useTranslations } from "next-intl";
import { Quote, User } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function QuoteSection() {
  const t = useTranslations("quote");
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>({
    threshold: 0.3,
  });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-linear-to-br from-primary/40 to-secondary/80 relative overflow-hidden"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center">
          {/* Quote Icon */}
          <div
            className={`inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            <Quote className="w-8 h-8 text-white" />
          </div>

          {/* Quote Text */}
          <blockquote
            className={`text-xl md:text-2xl lg:text-3xl text-white font-medium leading-relaxed mb-8 italic transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            &ldquo;{t("text")}&rdquo;
          </blockquote>

          {/* Author */}
          <div
            className={`flex flex-col items-center transition-all duration-700 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <p className="text-white font-bold text-lg">{t("author")}</p>
            <p className="text-white/70 text-sm">{t("role")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
