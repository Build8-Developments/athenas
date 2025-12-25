"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Package,
  Thermometer,
  Clock,
  MapPin,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Minus,
  Plus,
} from "lucide-react";
import type { ProductData } from "@/lib/data";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ProductDetailClientProps {
  product: ProductData;
  relatedProducts: ProductData[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const t = useTranslations("productDetail");
  const tPage = useTranslations("productsPage");

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [sectionRef, isVisible] = useScrollAnimation<HTMLDivElement>({
    threshold: 0.1,
  });

  // Sync wishlist state from localStorage after mount (avoids hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem("athenas-wishlist");
    if (saved) {
      const wishlist = JSON.parse(saved) as { id: string; quantity: number }[];
      setIsInWishlist(wishlist.some((item) => item.id === product._id));
    }
  }, [product._id]);

  // All images including main and gallery
  const allImages = [product.image, ...(product.gallery || [])];

  // Quantity controls
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  // Toggle wishlist with quantity
  const toggleWishlist = () => {
    const saved = localStorage.getItem("athenas-wishlist");
    const wishlist: { id: string; quantity: number }[] = saved
      ? JSON.parse(saved)
      : [];

    let newWishlist;
    const existingIndex = wishlist.findIndex((item) => item.id === product._id);

    if (existingIndex !== -1) {
      // Remove from wishlist
      newWishlist = wishlist.filter((item) => item.id !== product._id);
    } else {
      // Add to wishlist with quantity
      newWishlist = [...wishlist, { id: product._id, quantity }];
    }

    localStorage.setItem("athenas-wishlist", JSON.stringify(newWishlist));
    setIsInWishlist(!isInWishlist);
  };

  // Share functionality
  const handleShare = async () => {
    const url = window.location.href;
    const title = product.name;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  // Navigate gallery
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  // Generate inquiry email
  const generateInquiryEmail = () => {
    const subject = encodeURIComponent(`Inquiry: ${product.name}`);
    const body = encodeURIComponent(
      `Hello,\n\nI am interested in the following product:\n\n` +
        `Product: ${product.name}\n` +
        `Category: ${product.category}\n` +
        `Quantity: ${quantity} ${product.priceUnit}\n` +
        `Please provide more information about:\n` +
        `- Bulk pricing for this quantity\n` +
        `- Shipping options\n` +
        `- Delivery timeline\n\n` +
        `Thank you.`
    );
    return `mailto:info@athenasfoods.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-light/30">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav
          className={`flex items-center gap-2 text-sm mb-8 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="/"
            className="text-primary/60 hover:text-primary transition-colors"
          >
            {t("breadcrumb.home")}
          </Link>
          <ChevronRight className="w-4 h-4 text-primary/40 rtl:rotate-180" />
          <Link
            href="/products"
            className="text-primary/60 hover:text-primary transition-colors"
          >
            {t("breadcrumb.products")}
          </Link>
          <ChevronRight className="w-4 h-4 text-primary/40 rtl:rotate-180" />
          <span className="text-primary font-medium">{product.name}</span>
        </nav>

        {/* Back Button - Mobile */}
        <Link
          href="/products"
          className={`inline-flex md:hidden items-center gap-2 text-primary hover:text-secondary transition-colors mb-6 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t("backToProducts")}</span>
        </Link>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <div
            className={`transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            {/* Main Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg mb-4">
              <Image
                src={allImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
                unoptimized
              />

              {/* Badges */}
              <div className="absolute top-4 start-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-full">
                    {tPage("featured")}
                  </span>
                )}
                {product.new && (
                  <span className="px-3 py-1.5 bg-secondary text-white text-xs font-bold rounded-full">
                    {tPage("new")}
                  </span>
                )}
              </div>

              {/* Gallery Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute start-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-primary rtl:rotate-180" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute end-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-primary rtl:rotate-180" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-2 px-1 -mx-1">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all duration-200 ${
                      selectedImage === index
                        ? "ring-2 ring-secondary ring-offset-2 scale-105"
                        : "opacity-60 hover:opacity-100 hover:scale-105"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
          >
            {/* Category */}
            <span className="inline-block px-3 py-1 bg-accent/60 text-primary/80 text-sm font-medium rounded-full mb-4 capitalize">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-primary/70 text-lg mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Certifications */}
            {product.certifications && product.certifications.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-primary/60 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  {tPage("certifications")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg"
                    >
                      <Check className="w-4 h-4" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-primary/70">
                {t("quantity")}:
              </span>
              <div className="flex items-center gap-1 bg-white rounded-xl border border-accent/30 shadow-sm">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="p-3 text-primary hover:bg-accent/30 rounded-s-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-primary">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="p-3 text-primary hover:bg-accent/30 rounded-e-xl transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-primary/50">
                {product.priceUnit === "kg" ? "kg" : "tons"}
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a
                href={generateInquiryEmail()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-linear-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <Mail className="w-5 h-5" />
                {t("requestQuote")}
              </a>
              <button
                onClick={toggleWishlist}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-200 ${
                  isInWishlist
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-accent/50 text-primary hover:bg-accent"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isInWishlist ? "fill-red-500" : ""}`}
                />
                {isInWishlist
                  ? tPage("inWishlist")
                  : `${tPage("addToWishlist")} (${quantity})`}
              </button>
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-4 bg-white border border-accent/30 rounded-xl text-primary hover:bg-accent/30 transition-colors"
                  aria-label={t("share")}
                >
                  <Share2 className="w-5 h-5" />
                </button>
                {showShareTooltip && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs rounded-lg whitespace-nowrap">
                    {t("linkCopied")}
                  </span>
                )}
              </div>
            </div>

            {/* Specifications */}
            {product.specifications && (
              <div className="bg-white rounded-2xl p-6 shadow-md border border-accent/30">
                <h3 className="text-lg font-bold text-primary mb-4">
                  {tPage("specifications.title")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/50 rounded-lg">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-primary/50 uppercase tracking-wider">
                        {tPage("specifications.packaging")}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        {product.specifications.packaging}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/50 rounded-lg">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-primary/50 uppercase tracking-wider">
                        {tPage("specifications.shelfLife")}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        {product.specifications.shelfLife}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/50 rounded-lg">
                      <Thermometer className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-primary/50 uppercase tracking-wider">
                        {tPage("specifications.storage")}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        {product.specifications.storage}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-primary/50 uppercase tracking-wider">
                        {tPage("specifications.origin")}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        {product.specifications.origin}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section
            className={`transition-all duration-700 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">
              {t("relatedProducts")}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  href={`/products/${relatedProduct.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-accent/30"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-primary group-hover:text-secondary transition-colors line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
