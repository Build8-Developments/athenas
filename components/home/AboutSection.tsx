"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSwipe } from "@/hooks/useSwipe";

export default function AboutSection() {
  const t = useTranslations("about");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>({
    threshold: 0.2,
  });

  // Portrait images for the slider
  const slides = [
    "https://placehold.co/600x800?text=Portrait%201",
    "https://placehold.co/600x800?text=Portrait%202",
    "https://placehold.co/600x800?text=Portrait%203",
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Touch gestures
  const swipeHandlers = useSwipe({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
  });

  // Auto-advance slides every 4 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const qualityPoints = [
    t("points.0"),
    t("points.1"),
    t("points.2"),
    t("points.3"),
    t("points.4"),
  ];

  return (
    <section
      ref={sectionRef}
      className="relative z-10 w-full -mt-8 sm:-mt-6 md:-mt-16 "
    >
      {/* Container */}
      <div className="mx-auto rounded-tl-3xl rounded-tr-3xl md:rounded-tl-[64px] md:rounded-tr-[64px] bg-light  overflow-hidden">
        <div className="grid max-w-7xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12 grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Side - Content */}
          <div className="p-2 sm:p-4 md:p-6 flex flex-col justify-center">
            {/* Title */}
            <h2
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6 md:mb-8 leading-tight transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              {t("title")}
            </h2>

            {/* Subtitle */}
            <p
              className={`text-base sm:text-lg md:text-xl text-primary font-semibold mb-4 sm:mb-6 md:mb-8 transition-all duration-700 delay-100 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
            >
              {t("subtitle")}
            </p>

            {/* Quality Points - Enhanced Cards */}
            <div className="space-y-2 sm:space-y-3">
              {qualityPoints.map((point, index) => (
                <div
                  key={index}
                  className={`group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/50 hover:bg-white/80 border border-accent/30 hover:border-secondary/50 transition-all duration-500 hover:shadow-md ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-6"
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-br from-secondary to-primary/50 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-sm">
                    {index + 1}
                  </span>
                  <span className="text-sm sm:text-base text-primary/90 leading-relaxed pt-0.5 sm:pt-1">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image Slider */}
          <div
            className={`relative w-full h-87.5 sm:h-112.5 md:h-137.5 lg:h-162.5 xl:h-175 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-12 scale-95"
            }`}
            {...swipeHandlers}
          >
            {slides.map((slide, index) => (
              <div
                key={slide}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={slide}
                  alt={`About image ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}

            {/* Slider Indicators */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 sm:gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-light w-6 sm:w-8"
                      : "bg-light/50 hover:bg-light/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
