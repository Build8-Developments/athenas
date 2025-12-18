import { setRequestLocale } from "next-intl/server";
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="w-full">
      <HeroSection />
      <AboutSection />
      <LogosSection />
      <QuoteSection />
      <FeaturedProducts />
      <CategoriesSection />
      <PartnersSection />
      <StatsSection />
      <BannerSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
