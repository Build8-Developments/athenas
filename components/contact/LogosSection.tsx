"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function LogosSection() {
  const t = useTranslations("contact.logos");
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>({
    threshold: 0.2,
  });

  // Logo image from Unsplash - professional food/agriculture related image
  const logoImage = "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80";

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2
            className={`text-2xl md:text-3xl font-bold text-primary mb-4 rtl:font-arabic transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {t("title")}
          </h2>
          <p
            className={`text-lg text-gray-600 rtl:font-arabic transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Logo Display */}
        <div className="flex justify-center">
          <div
            className={`relative w-full max-w-md h-48 md:h-64 rounded-xl overflow-hidden shadow-lg transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
          >
            <Image
              src={logoImage}
              alt="Company Logo"
              fill
              className="object-contain p-4 bg-white"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}