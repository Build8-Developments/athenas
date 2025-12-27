"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Heart, Trash2, Eye, ShoppingBag, FileText } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useWishlist } from "@/hooks/useWishlist";
import ContactFormModal from "@/components/wishlist/ContactFormModal";
import type { ProductData, CategoryData } from "@/lib/data";

interface WishlistClientProps {
  products: ProductData[];
  categories: (CategoryData & { count: number })[];
  locale: string;
}

export default function WishlistClient({
  products,
  categories,
  locale,
}: WishlistClientProps) {
  const t = useTranslations("wishlist");
  const { wishlist, removeFromWishlist } = useWishlist();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create a map of category slug to category name for quick lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((category) => {
      map.set(category.slug, category.name);
    });
    return map;
  }, [categories]);

  // Helper function to get category name
  const getCategoryName = (categorySlug: string): string => {
    return categoryMap.get(categorySlug) || categorySlug;
  };

  // Create a map of slug to product for the current locale
  const productsBySlug = useMemo(() => {
    const map = new Map<string, ProductData>();
    products.forEach((product) => {
      map.set(product.slug, product);
    });
    return map;
  }, [products]);

  // Create a map of _id to slug from all products (for cross-locale support)
  const idToSlugMap = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((product) => {
      map.set(product._id, product.slug);
    });
    return map;
  }, [products]);

  // Filter products to only show those in the wishlist
  // Support both _id and slug in wishlist for backwards compatibility
  const wishlistProducts = useMemo(() => {
    const result: ProductData[] = [];
    const addedSlugs = new Set<string>();

    wishlist.forEach((item) => {
      // First, check if item is a slug that matches a product
      if (productsBySlug.has(item) && !addedSlugs.has(item)) {
        result.push(productsBySlug.get(item)!);
        addedSlugs.add(item);
        return;
      }

      // Then, check if item is an _id that maps to a slug
      const slug = idToSlugMap.get(item);
      if (slug && productsBySlug.has(slug) && !addedSlugs.has(slug)) {
        result.push(productsBySlug.get(slug)!);
        addedSlugs.add(slug);
      }
    });

    return result;
  }, [wishlist, productsBySlug, idToSlugMap]);

  // Empty state
  if (wishlistProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-accent/30 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-primary/40" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">{t("empty")}</h2>
        <p className="text-primary/60 text-center max-w-md mb-8">
          {t("emptyDescription")}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-primary text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
        >
          <ShoppingBag className="w-5 h-5" />
          {t("browseProducts")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header with item count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-primary/60">
          {t("itemCount", { count: wishlistProducts.length })}
        </p>
      </div>

      {/* Product Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-md border border-accent/30 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-accent/20 border-b border-accent/30 font-medium text-primary">
          <div className="col-span-6">{t("product")}</div>
          <div className="col-span-3">{t("category")}</div>
          <div className="col-span-3 text-end">{t("actions")}</div>
        </div>

        {/* Table Rows */}
        {wishlistProducts.map((product) => (
          <div
            key={product._id}
            className="grid grid-cols-12 gap-4 p-4 border-b border-accent/30 last:border-b-0 hover:bg-accent/10 transition-colors"
          >
            {/* Product Column (Image + Name) */}
            <div className="col-span-6 flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-primary truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-primary/60 line-clamp-1">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Category Column */}
            <div className="col-span-3 flex items-center">
              <span className="px-3 py-1 bg-accent/60 text-primary/80 text-sm font-medium rounded-full">
                {getCategoryName(product.category)}
              </span>
            </div>

            {/* Actions Column */}
            <div className="col-span-3 flex items-center justify-end gap-2">
              <button
                onClick={() => removeFromWishlist(product.slug)}
                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                aria-label={t("removeFromWishlist")}
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <Link
                href={`/products/${product.slug}`}
                className="p-2 rounded-lg bg-secondary text-white hover:bg-primary transition-colors"
                aria-label={t("viewDetails")}
              >
                <Eye className="w-5 h-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Product List - Mobile (Stacked Cards) */}
      <div className="md:hidden space-y-4">
        {wishlistProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md border border-accent/30 overflow-hidden"
          >
            <div className="flex gap-4 p-4">
              {/* Product Image */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                  unoptimized
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-primary truncate mb-1">
                  {product.name}
                </h3>
                <span className="inline-block px-2 py-0.5 bg-accent/60 text-primary/80 text-xs font-medium rounded-full mb-2">
                  {getCategoryName(product.category)}
                </span>
                <p className="text-sm text-primary/60 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex border-t border-accent/30">
              <button
                onClick={() => removeFromWishlist(product.slug)}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {t("removeFromWishlist")}
              </button>
              <Link
                href={`/products/${product.slug}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium bg-secondary text-white hover:bg-primary transition-colors"
              >
                <Eye className="w-4 h-4" />
                {t("viewDetails")}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-2xl shadow-md border border-accent/30">
        <div className="flex items-center gap-4">
          <span className="text-primary/60">{t("totalItems")}:</span>
          <span className="text-2xl font-bold text-primary">
            {wishlistProducts.length}
          </span>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-primary text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
        >
          <FileText className="w-5 h-5" />
          {t("requestQuote")}
        </button>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={wishlistProducts}
        locale={locale}
      />
    </div>
  );
}
