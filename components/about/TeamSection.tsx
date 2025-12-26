"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface TeamMember {
  nameKey: string;
  roleKey: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    nameKey: "ceo",
    roleKey: "ceo",
    image: "/hero/hero-bg-1.jpg",
  },
  {
    nameKey: "operations",
    roleKey: "operations",
    image: "/hero/hero-bg-2.jpg",
  },
  {
    nameKey: "quality",
    roleKey: "quality",
    image: "/hero/hero-bg-3.jpg",
  },
];

export default function TeamSection() {
  const t = useTranslations("aboutPage.team");
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

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.nameKey}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-700 hover:shadow-lg hover:-translate-y-1 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              {/* Photo */}
              <div className="relative w-full aspect-square">
                <Image
                  src={member.image}
                  alt={t(`members.${member.nameKey}.name`)}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="p-6 text-center">
                <h3 className="text-lg md:text-xl font-semibold text-primary mb-1 rtl:font-arabic">
                  {t(`members.${member.nameKey}.name`)}
                </h3>
                <p className="text-sm md:text-base text-secondary rtl:font-arabic">
                  {t(`members.${member.roleKey}.role`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
