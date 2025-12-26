"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function StorySection() {
  const t = useTranslations("aboutPage.story");
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>({
    threshold: 0.2,
  });

  return (
    <section ref={sectionRef} className="w-full py-16 md:py-24 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text Content - Left on LTR, Right on RTL */}
          <div
            className={`order-2 lg:order-1 rtl:lg:order-2 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 md:mb-8 rtl:font-arabic">
              {t("title")}
            </h2>

            {/* Story Paragraphs */}
            <div className="space-y-4 md:space-y-6">
              <p
                className={`text-base md:text-lg text-primary/80 leading-relaxed rtl:font-arabic transition-all duration-700 delay-100 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                {t("paragraph1")}
              </p>
              <p
                className={`text-base md:text-lg text-primary/80 leading-relaxed rtl:font-arabic transition-all duration-700 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                {t("paragraph2")}
              </p>
              <p
                className={`text-base md:text-lg text-primary/80 leading-relaxed rtl:font-arabic transition-all duration-700 delay-300 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                {t("paragraph3")}
              </p>
            </div>
          </div>

          {/* Image - Right on LTR, Left on RTL */}
          <div
            className={`order-1 lg:order-2 rtl:lg:order-1 transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0 scale-100"
                : "opacity-0 translate-x-12 scale-95"
            }`}
          >
            <div className="relative w-full aspect-4/3 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
              <Image
                src="/hero/hero-bg-1.jpg"
                alt="Athenas Foods Story"
                fill
                className="object-cover"
                unoptimized
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
