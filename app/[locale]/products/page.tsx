import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import ProductsHero from "@/components/products/ProductsHero";
import ProductsClient from "@/components/products/ProductsClient";
import Footer from "@/components/layout/Footer";
import { getProducts, getCategoriesWithCounts } from "@/lib/data";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "productsPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords: t("metaKeywords"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      siteName: "Athenas Foods",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
    alternates: {
      languages: {
        en: "/en/products",
        ar: "/ar/products",
      },
    },
  };
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { category } = await searchParams;
  setRequestLocale(locale);

  // Fetch data server-side
  const [productsData, categories] = await Promise.all([
    getProducts(locale),
    getCategoriesWithCounts(locale),
  ]);

  return (
    <div className="w-full">
      <ProductsHero />
      <div className="bg-light min-h-screen">
        <ProductsClient
          initialProducts={productsData.products}
          categories={categories}
          initialCategory={category || null}
        />
      </div>
      <Footer />
    </div>
  );
}
