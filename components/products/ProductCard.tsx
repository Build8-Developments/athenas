"use client";

import { useState } from "react";
import { Heart, Eye } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useWishlist } from "@/hooks/useWishlist";
import type { ProductData } from "@/lib/data";

interface ProductCardProps {
  product: ProductData;
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("productsPage");
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Use slug for wishlist to support cross-locale consistency
  const inWishlist = isInWishlist(product.slug);

  return (
    <article
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-accent/30 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`}>
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />

          {/* Badges */}
          <div className="absolute top-4 start-4 flex flex-col gap-2">
            {product.featured && (
              <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full">
                {t("featured")}
              </span>
            )}
            {product.new && (
              <span className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full">
                {t("new")}
              </span>
            )}
          </div>

          <div
            className={`absolute  top-4 end-4 flex flex-col gap-2  transition-all duration-300  ${
              isHovered
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.slug);
              }}
              className="p-3 cursor-pointer bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
              aria-label={
                inWishlist ? t("removeFromWishlist") : t("addToWishlist")
              }
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-200 ${
                  inWishlist ? "fill-red-500 text-red-500" : "text-primary"
                }`}
              />
            </button>
            <button
              className="p-3 bg-white/95 cursor-pointer backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
              aria-label={t("viewDetails")}
            >
              <Eye className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Category */}
          <span className="absolute bottom-4 start-4 px-3 py-1 bg-secondary/90 backdrop-blur-sm text-white text-xs font-medium rounded-full capitalize">
            {product.category}
          </span>
        </div>

        {/* Product Info */}
        <div className="p-5 flex flex-col grow">
          <button className="group/title">
            <h3 className="text-lg font-bold text-primary mb-2 group-hover/title:text-secondary transition-colors duration-200">
              {product.name}
            </h3>
          </button>
          <p className="text-primary/60 text-sm line-clamp-2 mb-3 grow">
            {product.description}
          </p>

          {/* Min Order */}
          {product.minOrder && (
            <p className="text-xs text-primary/50 mb-3">
              {t("minOrder")}: {product.minOrder}
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex border-t border-accent/30">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.slug);
            }}
            className={`flex-1 flex cursor-pointer items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
              inWishlist
                ? "bg-red-50 text-red-500 hover:bg-red-100"
                : "bg-accent/30 text-primary hover:bg-accent/50"
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500" : ""}`} />
            <span className="hidden sm:inline">
              {inWishlist ? t("inWishlist") : t("addToWishlist")}
            </span>
          </button>
          <button className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-3 bg-secondary hover:bg-primary text-white text-sm font-medium hover:shadow-lg transition-all duration-200">
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">{t("viewDetails")}</span>
          </button>
        </div>
      </Link>
    </article>
  );
}
