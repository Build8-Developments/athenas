"use client";

import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function MapSection() {
  const t = useTranslations("aboutPage.map");
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>({
    threshold: 0.2,
  });

  return (
    <section ref={sectionRef} className="w-full py-16 md:py-24 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 rtl:font-arabic">
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-primary/70 max-w-2xl mx-auto rtl:font-arabic">
            {t("subtitle")}
          </p>
        </div>

        {/* Map Container */}
        <div
          className={`relative w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-xl transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.123456789!2d31.4!3d30.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z10th+of+Ramadan+City!5e0!3m2!1sen!2seg!4v1234567890"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Athenas Foods Location"
            className="w-full h-[300px] md:h-[450px]"
          />
        </div>
      </div>
    </section>
  );
}
