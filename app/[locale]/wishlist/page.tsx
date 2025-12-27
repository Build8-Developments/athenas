import { Suspense } from "react";
import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import WishlistHero from "@/components/wishlist/WishlistHero";
import WishlistClient from "@/components/wishlist/WishlistClient";
import WishlistSkeleton from "@/components/wishlist/WishlistSkeleton";
import Footer from "@/components/layout/Footer";
import { getProducts, getCategoriesWithCounts } from "@/lib/data";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wishlist" });

  return {
    title: `${t("title")} | Athenas Foods`,
    description: "View and manage your saved products",
    openGraph: {
      title: `${t("title")} | Athenas Foods`,
      description: "View and manage your saved products",
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      siteName: "Athenas Foods",
    },
    alternates: {
      languages: {
        en: "/en/wishlist",
        ar: "/ar/wishlist",
      },
    },
  };
}

// Async component to fetch products
async function WishlistContent({ locale }: { locale: string }) {
  const [productsData, categories] = await Promise.all([
    getProducts(locale),
    getCategoriesWithCounts(locale),
  ]);
  return <WishlistClient products={productsData.products} categories={categories} locale={locale} />;
}

export default async function WishlistPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "wishlist" });

  return (
    <div className="w-full">
      <WishlistHero />
      <div className="bg-light min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8 pt-16">
          {/* Wishlist Content with Suspense */}
          <Suspense fallback={<WishlistSkeleton />}>
            <WishlistContent locale={locale} />
          </Suspense>
        </div>
      </div>
      <Footer />
    </div>
  );
}
