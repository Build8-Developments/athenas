import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import LogosSection from "@/components/home/LogosSection";
import QuoteSection from "@/components/home/QuoteSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoriesSection from "@/components/home/CategoriesSection";
import PartnersSection from "@/components/home/PartnersSection";
import StatsSection from "@/components/home/StatsSection";
import BannerSection from "@/components/home/BannerSection";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/layout/Footer";
import { getFeaturedProducts, getCategories } from "@/lib/data";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    keywords: t("homeKeywords"),
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      siteName: "Athenas Foods",
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeTitle"),
      description: t("homeDescription"),
    },
    alternates: {
      languages: {
        en: "/en",
        ar: "/ar",
      },
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch data server-side
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(locale, 8),
    getCategories(locale),
  ]);

  return (
    <div className="w-full">
      <HeroSection />
      <AboutSection />
      <LogosSection />
      <QuoteSection />
      <FeaturedProducts products={featuredProducts} />
      <CategoriesSection categories={categories} />
      <PartnersSection />
      <StatsSection />
      <BannerSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
