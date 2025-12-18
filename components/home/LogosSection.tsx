"use client";

import { useTranslations } from "next-intl";

export default function LogosSection() {
  const t = useTranslations("logos");

  // Placeholder company logos (replace with actual partner logos)
  const logos = [
    { name: "Partner 1", src: "https://placehold.co/200x80?text=Partner+1" },
    { name: "Partner 2", src: "https://placehold.co/200x80?text=Partner+2" },
    { name: "Partner 3", src: "https://placehold.co/200x80?text=Partner+3" },
    { name: "Partner 4", src: "https://placehold.co/200x80?text=Partner+4" },
    { name: "Partner 5", src: "https://placehold.co/200x80?text=Partner+5" },
    { name: "Partner 6", src: "https://placehold.co/200x80?text=Partner+6" },
    { name: "Partner 7", src: "https://placehold.co/200x80?text=Partner+7" },
    { name: "Partner 8", src: "https://placehold.co/200x80?text=Partner+8" },
  ];

  return (
    <section className="py-12 md:py-16 bg-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-center text-primary/60 text-sm font-medium uppercase tracking-wider">
          {t("title")}
        </p>
      </div>

      {/* Infinite Scrolling Logos */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-light to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-light to-transparent z-10" />

        {/* Scrolling Container */}
        <div className="flex animate-scroll">
          {/* First set of logos */}
          {logos.map((logo, index) => (
            <div
              key={`logo-1-${index}`}
              className="flex-shrink-0 mx-8 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {logos.map((logo, index) => (
            <div
              key={`logo-2-${index}`}
              className="flex-shrink-0 mx-8 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
