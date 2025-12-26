"use client";

import { useTranslations } from "next-intl";
import { Award, Globe, Leaf, Lightbulb, LucideIcon } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Value {
  icon: LucideIcon;
  titleKey: string;
  descriptionKey: string;
}

const values: Value[] = [
  {
    icon: Award,
    titleKey: "quality",
    descriptionKey: "quality",
  },
  {
    icon: Globe,
    titleKey: "reliability",
    descriptionKey: "reliability",
  },
  {
    icon: Leaf,
    titleKey: "sustainability",
    descriptionKey: "sustainability",
  },
  {
    icon: Lightbulb,
    titleKey: "innovation",
    descriptionKey: "innovation",
  },
];

export default function ValuesSection() {
  const t = useTranslations("aboutPage.values");
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

        {/* Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={value.titleKey}
                className={`bg-light rounded-2xl p-6 md:p-8 text-center transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100 + 200}ms` }}
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-secondary/10 text-secondary mb-4 md:mb-6">
                  <Icon className="w-7 h-7 md:w-8 md:h-8" />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl font-semibold text-primary mb-2 md:mb-3 rtl:font-arabic">
                  {t(`${value.titleKey}.title`)}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-primary/70 leading-relaxed rtl:font-arabic">
                  {t(`${value.descriptionKey}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
