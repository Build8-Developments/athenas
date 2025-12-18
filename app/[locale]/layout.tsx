import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import FloatingNavbar from "@/components/layout/Navbar";
import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Athenas Foods",
  description: "Premium Egyptian frozen products exporter",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "ar")) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`antialiased bg-accent/20 font-['Tajawal',sans-serif]`}>
        <NextIntlClientProvider messages={messages}>
          <main className="w-full overflow-x-hidden flex flex-col relative">
            <FloatingNavbar />
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
