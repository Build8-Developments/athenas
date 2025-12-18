"use client";

import { useTranslations } from "next-intl";
import { Carrot, Cherry, Leaf, Layers, Salad } from "lucide-react";
import Image from "next/image";

export default function CategoriesSection() {
  const t = useTranslations("categories");

  const categories = [
    {
      key: "vegetables",
      icon: Carrot,
      image: "https://placehold.co/800x600?text=Vegetables",
    },
    {
      key: "fruits",
      icon: Cherry,
      image: "https://placehold.co/600x400?text=Fruits",
    },
    {
      key: "fries",
      icon: Salad,
      image: "https://placehold.co/600x400?text=Fries",
    },
    {
      key: "herbs",
      icon: Leaf,
      image: "https://placehold.co/600x400?text=Herbs",
    },
    {
      key: "mixes",
      icon: Layers,
      image: "https://placehold.co/800x600?text=Mixes",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-accent/30">
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

        {/* Bento Grid - 5 Categories */}
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[160px] lg:auto-rows-[200px]">
          {/* Vegetables - Large Left */}
          <CategoryCard
            category={categories[0]}
            label={t(categories[0].key)}
            className="col-span-2 row-span-2"
          />
          
          {/* Fruits - Top Right */}
          <CategoryCard
            category={categories[1]}
            label={t(categories[1].key)}
            className="col-span-2 row-span-1"
          />
          
          {/* Fries - Middle Right */}
          <CategoryCard
            category={categories[2]}
            label={t(categories[2].key)}
            className="col-span-2 row-span-2"
          />
          
          {/* Herbs - Bottom Center */}
          <CategoryCard
            category={categories[3]}
            label={t(categories[3].key)}
            className="col-span-2 row-span-1"
          />
          
          {/* Mixes - Bottom Span */}
          <CategoryCard
            category={categories[4]}
            label={t(categories[4].key)}
            className="col-span-4 md:col-span-2 row-span-1"
          />
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  label,
  className,
}: {
  category: { key: string; icon: React.ElementType; image: string };
  label: string;
  className: string;
}) {
  const Icon = category.icon;
  
  return (
    <div
      className={`${className} relative group rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer`}
    >
      {/* Background Image */}
      <Image
        src={category.image}
        alt={label}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        unoptimized
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent group-hover:from-primary/90 transition-all duration-300" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end p-4 md:p-6">
        <div className="flex items-center gap-2 md:gap-3 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <span className="text-white font-bold text-lg md:text-xl lg:text-2xl drop-shadow-lg">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
