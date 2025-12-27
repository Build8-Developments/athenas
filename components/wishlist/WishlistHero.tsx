"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function WishlistHero() {
  const t = useTranslations("wishlist.hero");

  return (
    <section className="relative w-full h-[33vh] min-h-[250px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero/hero-bg-2.jpg"
          alt="Wishlist hero background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/60" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            {t("title")}
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </div>
    </section>
  );
}