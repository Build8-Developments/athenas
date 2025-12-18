"use client";

import { Heart, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";

interface ProductListCardProps {
  product: Product;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export default function ProductListCard({
  product,
  wishlist,
  onToggleWishlist,
}: ProductListCardProps) {
  const t = useTranslations("productsPage");
  const tItems = useTranslations("productItems");

  const isInWishlist = wishlist.includes(product.id);

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-accent/30">
      <div className="flex flex-col sm:flex-row">
        {/* Product Image */}
        <div className="relative w-full sm:w-48 md:w-56 lg:w-64 shrink-0 aspect-square sm:aspect-auto sm:h-auto">
          <div className="relative h-48 sm:h-full w-full">
            <Image
              src={product.image}
              alt={tItems(product.nameKey)}
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
            <span className="sm:hidden absolute bottom-3 start-3 px-2.5 py-1 bg-secondary/90 backdrop-blur-sm text-white text-xs font-medium rounded-full capitalize">
              {t(`categories.${product.category}`)}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Category - Desktop */}
            <span className="hidden sm:inline-block px-2.5 py-1 bg-accent/60 text-primary/80 text-xs font-medium rounded-full capitalize mb-3">
              {t(`categories.${product.category}`)}
            </span>

            <Link href={`/products/${product.slug}`} className="group/title">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-2 group-hover/title:text-secondary transition-colors duration-200">
                {tItems(product.nameKey)}
              </h3>
            </Link>

            <p className="text-primary/60 text-sm md:text-base line-clamp-2 sm:line-clamp-3 mb-4">
              {tItems(product.descriptionKey)}
            </p>

            {/* Certifications */}
            {product.certifications && product.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-2.5 py-1 bg-accent/50 text-primary/70 text-xs font-medium rounded-md"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            )}

            {/* Specifications Preview */}
            {product.specifications && (
              <div className="hidden md:flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary/60">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-primary/80">
                    {t("specifications.origin")}:
                  </span>
                  <span>{product.specifications.origin}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-primary/80">
                    {t("specifications.storage")}:
                  </span>
                  <span>{product.specifications.storage}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-primary/80">
                    {t("specifications.shelfLife")}:
                  </span>
                  <span>{product.specifications.shelfLife}</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-accent/30">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onToggleWishlist(product.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isInWishlist
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-accent/50 text-primary hover:bg-accent"
                }`}
                aria-label={
                  isInWishlist ? t("removeFromWishlist") : t("addToWishlist")
                }
              >
                <Heart
                  className={`w-4 h-4 ${isInWishlist ? "fill-red-500" : ""}`}
                />
                <span className="hidden sm:inline text-sm font-medium">
                  {isInWishlist ? t("removeFromWishlist") : t("addToWishlist")}
                </span>
              </button>
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-sm hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <span>{t("viewDetails")}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
