"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/shared/Button";
import ProductCard from "@/components/products/ProductCard";
import { useSwipe } from "@/hooks/useSwipe";
import type { ProductData } from "@/lib/data";

interface FeaturedProductsProps {
  products: ProductData[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations("products");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleItems, setVisibleItems] = useState(3); // Default to 3 for SSR
  const [hasMounted, setHasMounted] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Calculate visible items based on window width
  const getVisibleItems = useCallback(() => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }, []);

  // Set mounted state and initial visible items on client
  useEffect(() => {
    setHasMounted(true);
    setVisibleItems(getVisibleItems());
  }, [getVisibleItems]);

  // Handle resize
  useEffect(() => {
    if (!hasMounted) return;

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => setVisibleItems(getVisibleItems()), 100);
    };

    window.addEventListener("resize", debouncedResize, { passive: true });
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(resizeTimeout);
    };
  }, [hasMounted, getVisibleItems]);

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev >= products.length - visibleItems ? 0 : prev + 1
      );
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, visibleItems, products.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) =>
      prev >= products.length - visibleItems ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) =>
      prev <= 0 ? products.length - visibleItems : prev - 1
    );
  };

  // Touch gestures (RTL-aware)
  const swipeHandlers = useSwipe({
    onSwipeLeft: isRTL ? prevSlide : nextSlide,
    onSwipeRight: isRTL ? nextSlide : prevSlide,
  });

  return (
    <section className="py-16 md:py-24 bg-light">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            {t("title")}
          </h2>
          <p className="text-primary/70 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Products Slider */}
        <div className="relative px-8 md:px-14">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute start-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-colors duration-200 border border-accent/30"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 rtl:rotate-180" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute end-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-colors duration-200 border border-accent/30"
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 rtl:rotate-180" />
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden" ref={sliderRef} {...swipeHandlers}>
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(${isRTL ? "" : "-"}${
                  currentIndex * (100 / visibleItems)
                }%)`,
              }}
            >
              {products.map((product) => (
                <div
                  key={product._id}
                  className="shrink-0 px-2 md:px-3 py-2 md:py-3"
                  style={{ width: `${100 / visibleItems}%` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>

          {/* Slider Indicators */}
          {hasMounted && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({
                length: Math.max(1, products.length - visibleItems + 1),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-primary/30 w-2 hover:bg-primary/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button href="/products" variant="secondary">
            {t("viewAll")}
          </Button>
        </div>
      </div>
    </section>
  );
}
