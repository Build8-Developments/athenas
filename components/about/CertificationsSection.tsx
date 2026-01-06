"use client";

import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Image from "next/image";

interface Certification {
  key: string;
  image: string;
}

const certifications: Certification[] = [
  {
    key: "iso9001",
    image: "/certifications/iso9001.png",
  },
  {
    key: "iso22000",
    image: "/certifications/iso22000.png",
  },
  {
    key: "haccp",
    image: "https://placehold.co/200x200?text=200x200",
  },
  {
    key: "halal",
    image: "/certifications/halal.png",
  },
  {
    key: "fda",
    image: "/certifications/fda.png",
  },
];

export default function CertificationsSection() {
  const t = useTranslations("aboutPage.certifications");
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>({
    threshold: 0.2,
  });

  return (
    <section ref={sectionRef} className="w-full py-16 md:py-24 bg-white">
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

        {/* Certifications Grid */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          {certifications.map((cert, index) => {
            return (
              <div
                key={cert.key}
                className={`w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.34rem)] bg-light rounded-2xl p-6 md:p-8 text-center transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                {/* Image */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto mb-4 md:mb-6">
                  <Image
                    src={cert.image}
                    alt={t(`${cert.key}.name`)}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* Name */}
                <h3 className="text-lg md:text-xl font-semibold text-primary mb-2 md:mb-3 rtl:font-arabic">
                  {t(`${cert.key}.name`)}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-primary/70 leading-relaxed rtl:font-arabic">
                  {t(`${cert.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
