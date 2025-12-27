"use client";

import { Heart, Eye } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useWishlist } from "@/hooks/useWishlist";
import type { ProductData, CategoryData } from "@/lib/data";

interface ProductListCardProps {
  product: ProductData;
  categories?: (CategoryData & { count: number })[];
}

export default function ProductListCard({ product, categories }: ProductListCardProps) {
  const t = useTranslations("productsPage");
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Use slug for wishlist to support cross-locale consistency
  const inWishlist = isInWishlist(product.slug);

  // Helper function to get category name
  const getCategoryName = (categorySlug: string): string => {
    if (!categories) return categorySlug;
    const category = categories.find(cat => cat.slug === categorySlug);
    return category?.name || categorySlug;
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-accent/30">
      <Link href={`/products/${product.slug}`}>
        <div className="flex flex-col sm:flex-row">
          {/* Product Image */}
          <div className="relative w-full sm:w-48 md:w-56 lg:w-64 shrink-0 aspect-square sm:aspect-auto sm:h-auto">
            <div className="relative h-48 sm:h-full w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, 256px"
                unoptimized
              />

              {/* Badges */}
              <div className="absolute top-3 start-3 flex flex-row sm:flex-col gap-2">
                {product.featured && (
                  <span className="px-2.5 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    {t("featured")}
                  </span>
                )}
                {product.new && (
                  <span className="px-2.5 py-1 bg-secondary text-white text-xs font-bold rounded-full">
                    {t("new")}
                  </span>
                )}
              </div>

              {/* Category Badge - Mobile Only */}
              <span className="sm:hidden absolute bottom-3 start-3 px-2.5 py-1 bg-secondary/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                {getCategoryName(product.category)}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  {/* Category - Desktop */}
                  <span className="hidden sm:inline-block px-2.5 py-1 bg-accent/60 text-primary/80 text-xs font-medium rounded-full mb-3">
                    {getCategoryName(product.category)}
                  </span>

                  <h3 className="text-xl md:text-2xl font-bold text-primary mb-2 group-hover/title:text-secondary transition-colors duration-200">
                    {product.name}
                  </h3>
                </div>
              </div>

              <p className="text-primary/60 text-sm md:text-base line-clamp-2 sm:line-clamp-3 mb-4">
                {product.description}
              </p>

              {/* Product Details */}
              <div className="hidden md:flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary/60">
                {product.weight && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-primary/80">
                      {t("weight")}:
                    </span>
                    <span>{product.weight}</span>
                  </div>
                )}
                {product.grade && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-primary/80">
                      {t("grade")}:
                    </span>
                    <span>{product.grade}</span>
                  </div>
                )}
                {product.minOrder && (
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-primary/80">
                      {t("minOrder")}:
                    </span>
                    <span>{product.minOrder}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-4 pt-4 border-t border-accent/30">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product.slug);
                }}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  inWishlist
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-accent/50 text-primary hover:bg-accent"
                }`}
                aria-label={
                  inWishlist ? t("removeFromWishlist") : t("addToWishlist")
                }
              >
                <Heart
                  className={`w-4 h-4 ${inWishlist ? "fill-red-500" : ""}`}
                />
                <span className="text-sm font-medium">
                  {inWishlist ? t("inWishlist") : t("addToWishlist")}
                </span>
              </button>

              <button className="flex cursor-pointer items-center justify-center gap-2 px-5 py-2.5 bg-secondary hover:bg-primary text-white rounded-lg font-medium text-sm hover:shadow-lg hover:scale-105 transition-all duration-200">
                <Eye className="w-4 h-4" />
                <span>{t("viewDetails")}</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
