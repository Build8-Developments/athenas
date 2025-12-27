"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Button from "@/components/shared/Button";
import { ChevronDown } from "lucide-react";
import { useSwipe } from "@/hooks/useSwipe";

export default function HeroSection() {
  const t = useTranslations("hero");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Local hero background images
  const slides = [
    "/hero/hero-bg-1.jpg",
    "/hero/hero-bg-2.jpg",
    "/hero/hero-bg-3.jpg",
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Touch gestures
  const swipeHandlers = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
  });

  // Trigger entrance animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight - 100, behavior: "smooth" });
  };

  return (
    <section
      className="relative w-full h-screen overflow-hidden"
      {...swipeHandlers}
    >
      {/* Background Image Slider */}
      {slides.map((slide, index) => (
        <div
          key={slide}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide}
            alt={`Hero background ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
            unoptimized
          />
        </div>
      ))}

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

      {/* Slider Indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-primary/30 hover:bg-primary/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={scrollToContent}
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-primary/70 hover:text-primary transition-all duration-500 delay-700 cursor-pointer ${
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
