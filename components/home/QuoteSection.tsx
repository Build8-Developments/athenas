"use client";

import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";

export default function QuoteSection() {
  const t = useTranslations("quote");

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center">
          {/* Quote Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-8">
            <Quote className="w-8 h-8 text-white" />
          </div>

          {/* Quote Text */}
          <blockquote className="text-xl md:text-2xl lg:text-3xl text-white font-medium leading-relaxed mb-8 italic">
            &ldquo;{t("text")}&rdquo;
          </blockquote>

          {/* Author */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white/20 mb-4 overflow-hidden">
              <img
                src="https://placehold.co/100x100?text=CEO"
                alt={t("author")}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white font-bold text-lg">{t("author")}</p>
            <p className="text-white/70 text-sm">{t("role")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
