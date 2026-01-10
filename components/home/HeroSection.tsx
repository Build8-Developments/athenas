"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/shared/Button";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("hero");
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight - 100, behavior: "smooth" });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
          loop
          src="/hero/hero.webm"
        />
      </div>

      {/* Overlay with blur */}
      <div className="absolute inset-0 bg-light/75 backdrop-blur-xs" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center px-6 max-w-7xl mx-auto">
        <div className="text-left max-w-3xl rtl:text-right">
          {/* Welcome Text */}
          <div
            className={`flex items-center gap-3 mb-4 transition-all duration-700 delay-100 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="w-12 h-px bg-primary"></div>
            <p className="text-primary text-sm md:text-base font-medium tracking-wide uppercase">
              {t("welcome")}
            </p>
          </div>

          {/* Main Heading */}
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary mb-6 leading-tight transition-all duration-700 delay-200 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p
            className={`text-base md:text-lg lg:text-xl text-primary/80 mb-8 leading-relaxed transition-all duration-700 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {t("subtitle")}
          </p>

          {/* CTA Button */}
          <div
            className={`transition-all duration-700 delay-500 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Button href="/contact">{t("cta")}</Button>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={scrollToContent}
        className={`absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-primary/70 hover:text-primary transition-all duration-500 delay-700 cursor-pointer ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        aria-label="Scroll to content"
      >
        <span className="text-xs font-medium tracking-wider uppercase">
          {t("scrollDown") || "Scroll"}
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
}
