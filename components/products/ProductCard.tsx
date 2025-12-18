"use client";

import { useState } from "react";
import { Heart, Eye } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export default function ProductCard({
  product,
  wishlist,
  onToggleWishlist,
}: ProductCardProps) {
  const t = useTranslations("productsPage");
  const tItems = useTranslations("productItems");
  const [isHovered, setIsHovered] = useState(false);

  const isInWishlist = wishlist.includes(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <article
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-accent/30 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={tItems(product.nameKey)}
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

        {/* Action Buttons */}
        <div
          className={`absolute top-4 end-4 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist(product.id);
            }}
            className="p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
            aria-label={
              isInWishlist ? t("removeFromWishlist") : t("addToWishlist")
            }
          >
            <Heart
              className={`w-5 h-5 transition-colors duration-200 ${
                isInWishlist ? "fill-red-500 text-red-500" : "text-primary"
              }`}
            />
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
            aria-label={t("viewDetails")}
          >
            <Eye className="w-5 h-5 text-primary" />
          </Link>
        </div>

        {/* Category */}
        <span className="absolute bottom-4 start-4 px-3 py-1 bg-secondary/90 backdrop-blur-sm text-white text-xs font-medium rounded-full capitalize">
          {t(`categories.${product.category}`)}
        </span>
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col grow">
        <Link href={`/products/${product.slug}`} className="group/title">
          <h3 className="text-lg font-bold text-primary mb-2 group-hover/title:text-secondary transition-colors duration-200">
            {tItems(product.nameKey)}
          </h3>
        </Link>
        <p className="text-primary/60 text-sm line-clamp-2 mb-3 grow">
          {tItems(product.descriptionKey)}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-xs text-primary/50">{t("fromPrice")}</span>
          <span className="text-xl font-bold text-secondary">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-primary/50">
            {product.priceUnit === "kg" ? t("pricePerKg") : t("pricePerTon")}
          </span>
        </div>

        {/* Min Order */}
        {product.minOrder && (
          <p className="text-xs text-primary/50 mb-3">
            {t("minOrder")}: {product.minOrder}
          </p>
        )}

        {/* Certifications */}
        {product.certifications && product.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {product.certifications.slice(0, 3).map((cert) => (
              <span
                key={cert}
                className="px-2 py-0.5 bg-accent/50 text-primary/70 text-xs rounded-md"
              >
                {cert}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex border-t border-accent/30">
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist(product.id);
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
            isInWishlist
              ? "bg-red-50 text-red-500 hover:bg-red-100"
              : "bg-accent/30 text-primary hover:bg-accent/50"
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWishlist ? "fill-red-500" : ""}`} />
          <span className="hidden sm:inline">
            {isInWishlist ? t("inWishlist") : t("addToWishlist")}
          </span>
        </button>
        <Link
          href={`/products/${product.slug}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:shadow-lg transition-all duration-200"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">{t("viewDetails")}</span>
        </Link>
      </div>
    </article>
  );
}
