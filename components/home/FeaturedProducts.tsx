"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Button from "@/components/shared/Button";

interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Frozen Green Peas",
    category: "Vegetables",
    image: "https://placehold.co/400x400?text=Green+Peas",
    description:
      "Premium quality IQF green peas, freshly harvested and frozen.",
  },
  {
    id: "2",
    name: "Frozen Strawberries",
    category: "Fruits",
    image: "https://placehold.co/400x400?text=Strawberries",
    description: "Sweet and juicy frozen strawberries, perfect for desserts.",
  },
  {
    id: "3",
    name: "French Fries",
    category: "Fries",
    image: "https://placehold.co/400x400?text=French+Fries",
    description: "Crispy pre-fried French fries, ready to cook.",
  },
  {
    id: "4",
    name: "Mixed Vegetables",
    category: "Vegetables",
    image: "https://placehold.co/400x400?text=Mixed+Veggies",
    description: "A colorful blend of carrots, peas, corn, and green beans.",
  },
  {
    id: "5",
    name: "Frozen Mango Chunks",
    category: "Fruits",
    image: "https://placehold.co/400x400?text=Mango+Chunks",
    description: "Ripe Egyptian mangoes, cut and frozen at peak freshness.",
  },
  {
    id: "6",
    name: "Frozen Green Beans",
    category: "Vegetables",
    image: "https://placehold.co/400x400?text=Green+Beans",
    description: "Tender green beans, carefully selected and IQF frozen.",
  },
  {
    id: "7",
    name: "Frozen Corn Kernels",
    category: "Vegetables",
    image: "https://placehold.co/400x400?text=Corn+Kernels",
    description: "Sweet golden corn kernels, perfect for any dish.",
  },
  {
    id: "8",
    name: "Frozen Okra",
    category: "Vegetables",
    image: "https://placehold.co/400x400?text=Okra",
    description: "Traditional Egyptian okra, carefully processed and frozen.",
  },
];

export default function FeaturedProducts() {
  const t = useTranslations("products");
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

    const handleResize = () => setVisibleItems(getVisibleItems());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
  }, [isAutoPlaying, visibleItems]);

  // Save wishlist to localStorage
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
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-colors duration-200 border border-accent/30"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-colors duration-200 border border-accent/30"
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden" ref={sliderRef}>
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / visibleItems)
                }%)`,
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-2 md:px-3"
                  style={{ width: `${100 / visibleItems}%` }}
                >
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-accent/30 h-full">
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors duration-200"
                        aria-label={
                          wishlist.includes(product.id)
                            ? t("removeFromWishlist")
                            : t("addToWishlist")
                        }
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors duration-200 ${
                            wishlist.includes(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-primary"
                          }`}
                        />
                      </button>
                      {/* Category Badge */}
                      <span className="absolute bottom-4 left-4 px-3 py-1 bg-secondary/90 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                        {product.category}
                      </span>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-primary mb-2">
                        {product.name}
                      </h3>
                      <p className="text-primary/60 text-sm line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
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
