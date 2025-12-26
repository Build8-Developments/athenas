import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import ContactHero from "@/components/contact/ContactHero";
import ContactMethods from "@/components/contact/ContactMethods";
import ContactFormSection from "@/components/contact/ContactFormSection";
import StatsSection from "@/components/home/StatsSection";
import Footer from "@/components/layout/Footer";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });

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
        en: "/en/contact",
        ar: "/ar/contact",
      },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="w-full">
      <ContactHero />
      <ContactMethods />
      <ContactFormSection />
      <StatsSection />
      <Footer />
    </div>
  );
}
