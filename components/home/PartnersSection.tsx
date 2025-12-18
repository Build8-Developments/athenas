"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Location {
  id: string;
  key: string;
  country: string;
  city: string;
  // Position on the map as percentage
  x: number;
  y: number;
}

const locations: Location[] = [
  {
    id: "egypt",
    key: "egypt",
    country: "Egypt",
    city: "Cairo",
    x: 55.5,
    y: 50,
  },
  {
    id: "uae",
    key: "uae",
    country: "UAE",
    city: "Dubai",
    x: 62,
    y: 50,
  },
  {
    id: "germany",
    key: "germany",
    country: "Germany",
    city: "Hamburg",
    x: 50.5,
    y: 32.5,
  },
];

export default function PartnersSection() {
  const t = useTranslations("partners");
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>({
    threshold: 0.2,
  });

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-light overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {t("title")}
          </h2>
          <p
            className={`text-primary/70 text-lg max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            }`}
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Map Container */}
        <div
          className={`relative transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* SVG Map */}
          <div className="relative w-full aspect-2/1 max-w-4xl mx-auto">
            <Image
              src="/map-light.svg"
              alt="World Map"
              fill
              className="object-contain filter-[brightness(0)_saturate(100%)_invert(48%)_sepia(10%)_saturate(640%)_hue-rotate(71deg)_brightness(105%)_contrast(80%)]"
              priority
            />

            {/* Location Markers */}
            {locations.map((location) => (
              <div
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${location.x}%`, top: `${location.y}%` }}
                onMouseEnter={() => setActiveLocation(location.id)}
                onMouseLeave={() => setActiveLocation(null)}
              >
                {/* Pulse animation for headquarters (Egypt) */}
                {location.id === "egypt" && (
                  <span className="absolute inset-0 w-8 h-8 -m-1 rounded-full bg-accent animate-ping" />
                )}

                {/* Marker dot */}
                <div
                  className={`relative w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    activeLocation === location.id
                      ? "bg-accent scale-125"
                      : location.id === "egypt"
                      ? "bg-secondary"
                      : "bg-secondary hover:bg-primary hover:scale-110"
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Tooltip */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-white rounded-lg shadow-lg border border-accent/30 whitespace-nowrap transition-all duration-300 ${
                    activeLocation === location.id
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  <p className="text-primary font-semibold text-sm">
                    {t(`locations.${location.key}`)}
                  </p>
                  <p className="text-primary/50 text-xs">{location.country}</p>
                  {/* Arrow */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                </div>
              </div>
            ))}

            {/* Connection lines from Egypt to other locations */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 50"
              preserveAspectRatio="none"
            >
              {locations.slice(1).map((location) => (
                <line
                  key={`line-${location.id}`}
                  x1={locations[0].x}
                  y1={locations[0].y / 2}
                  x2={location.x}
                  y2={location.y / 2}
                  stroke="#778873"
                  strokeWidth="0.15"
                  strokeDasharray="0.5 0.3"
                  className={`transition-opacity duration-300 ${
                    activeLocation === location.id || activeLocation === "egypt"
                      ? "opacity-100"
                      : "opacity-40"
                  }`}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Location Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
          {locations.map((location, index) => (
            <div
              key={location.id}
              className={`flex items-center gap-4 p-4 md:p-5 bg-white rounded-2xl border-2 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-md ${
                activeLocation === location.id
                  ? "border-secondary shadow-lg scale-[1.02]"
                  : "border-accent/30 hover:border-secondary/50"
              } ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
              onMouseEnter={() => setActiveLocation(location.id)}
              onMouseLeave={() => setActiveLocation(null)}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                  activeLocation === location.id ? "bg-primary" : "bg-secondary"
                }`}
              >
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-primary font-semibold">
                  {t(`locations.${location.key}`)}
                </p>
                <p className="text-primary/50 text-sm">{location.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
