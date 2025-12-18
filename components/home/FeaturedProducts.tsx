"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/shared/Button";
import ProductCard from "@/components/products/ProductCard";
import type { ProductData } from "@/lib/data";

interface FeaturedProductsProps {
  products: ProductData[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const t = useTranslations("products");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [visibleItems, setVisibleItems] = useState(3);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Number of visible items based on screen size
  useEffect(() => {
    const getVisibleItems = () => {
      if (typeof window === "undefined") return 3;
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setVisibleItems(getVisibleItems());
      }, 100);
    };

    setVisibleItems(getVisibleItems());
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("athenas-wishlist");
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

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

  // Toggle wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("athenas-wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

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
          <div className="overflow-hidden" ref={sliderRef}>
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
                  className="shrink-0 px-2 md:px-3"
                  style={{ width: `${100 / visibleItems}%` }}
                >
                  <ProductCard
                    product={product}
                    wishlist={wishlist}
                    onToggleWishlist={toggleWishlist}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Slider Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: products.length - visibleItems + 1 }).map(
              (_, index) => (
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
              )
            )}
          </div>
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
