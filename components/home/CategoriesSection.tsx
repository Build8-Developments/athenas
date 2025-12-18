"use client";

import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { CategoryData } from "@/lib/data";

// Default images for categories (fallback)
const categoryImages: Record<string, string> = {
  vegetables: "https://placehold.co/800x600?text=Vegetables",
  fruits: "https://placehold.co/600x400?text=Fruits",
  fries: "https://placehold.co/600x400?text=Fries",
  herbs: "https://placehold.co/600x400?text=Herbs",
  mixes: "https://placehold.co/800x600?text=Mixes",
};

// Grid layout config for 5 categories
const gridLayouts = [
  "col-span-2 row-span-2", // Large left
  "col-span-2 row-span-1", // Top right
  "col-span-2 row-span-2", // Middle right
  "col-span-2 row-span-1", // Bottom center
  "col-span-4 md:col-span-2 row-span-1", // Bottom span
];

interface CategoriesSectionProps {
  categories: CategoryData[];
}

export default function CategoriesSection({
  categories,
}: CategoriesSectionProps) {
  const t = useTranslations("categories");
  const locale = useLocale();
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>({
    threshold: 0.15,
  });

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-accent/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {t("title")}
          </h2>
          <p
            className={`text-primary/70 text-lg max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Bento Grid - Categories */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[160px] lg:auto-rows-[200px]">
          {categories.slice(0, 5).map((category, index) => (
            <CategoryCard
              key={category._id}
              category={category}
              image={
                categoryImages[category.slug] ||
                `https://placehold.co/600x400?text=${encodeURIComponent(
                  category.name
                )}`
              }
              className={gridLayouts[index] || "col-span-2 row-span-1"}
              isVisible={isVisible}
              delay={index * 100}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  image,
  className,
  isVisible,
  delay,
  locale,
}: {
  category: CategoryData;
  image: string;
  className: string;
  isVisible: boolean;
  delay: number;
  locale: string;
}) {
  return (
    <Link
      href={`/${locale}/products?category=${category.slug}`}
      className={`${className} relative group rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={category.name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        unoptimized
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent group-hover:from-primary/90 transition-all duration-300" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
            {category.icon}
          </div>
          <span className="text-white font-bold text-lg md:text-xl lg:text-2xl drop-shadow-lg">
            {category.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
