"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AboutHero() {
  const t = useTranslations("aboutPage.hero");

  return (
    <section className="relative w-full h-[33vh] min-h-[250px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero/hero-bg-3.jpg"
          alt="About hero background"
          fill
          priority
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/60" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 rtl:font-arabic">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg lg:text-xl text-white/90 rtl:font-arabic">
            {t("subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}
