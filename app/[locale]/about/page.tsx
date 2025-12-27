import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import AboutHero from "@/components/about/AboutHero";
import StorySection from "@/components/about/StorySection";
import ValuesSection from "@/components/about/ValuesSection";

import CertificationsSection from "@/components/about/CertificationsSection";
import MapSection from "@/components/about/MapSection";
import PartnersSection from "@/components/home/PartnersSection";
import StatsSection from "@/components/home/StatsSection";
import BannerSection from "@/components/home/BannerSection";
import Footer from "@/components/layout/Footer";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  return {
    title: `${t("hero.title")} | Athenas Foods`,
    description: t("hero.subtitle"),
    openGraph: {
      title: `${t("hero.title")} | Athenas Foods`,
      description: t("hero.subtitle"),
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      siteName: "Athenas Foods",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("hero.title")} | Athenas Foods`,
      description: t("hero.subtitle"),
    },
    alternates: {
      languages: {
        en: "/en/about",
        ar: "/ar/about",
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="w-full">
      <AboutHero />
      <StorySection />
      <ValuesSection />

      <CertificationsSection />
      <MapSection />
      <PartnersSection />
      <StatsSection />
      <BannerSection />
      <Footer />
    </div>
  );
}
