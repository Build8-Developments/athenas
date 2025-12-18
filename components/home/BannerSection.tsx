"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/shared/Button";

export default function BannerSection() {
  const t = useTranslations("banner");

  return (
    <section className="py-16 md:py-24 bg-light">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center bg-white rounded-3xl overflow-hidden shadow-xl border border-accent/30">
          {/* Left Content */}
          <div className="p-8 md:p-12 lg:p-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
              {t("title")}
            </h2>
            <p className="text-primary/70 text-lg mb-8 leading-relaxed">
              {t("subtitle")}
            </p>
            <Button href="/contact">{t("cta")}</Button>
          </div>

          {/* Right Image */}
          <div className="relative h-64 md:h-80 lg:h-full min-h-[400px]">
            <img
              src="https://placehold.co/800x600?text=Premium+Products"
              alt="Premium frozen products"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Decorative Overlay */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
