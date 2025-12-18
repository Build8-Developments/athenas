"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";

interface Location {
  id: string;
  key: string;
  coordinates: { x: number; y: number };
  country: string;
}

const locations: Location[] = [
  {
    id: "egypt",
    key: "egypt",
    coordinates: { x: 540, y: 230 },
    country: "Egypt",
  },
  { id: "uae", key: "uae", coordinates: { x: 620, y: 250 }, country: "UAE" },
  {
    id: "germany",
    key: "germany",
    coordinates: { x: 500, y: 160 },
    country: "Germany",
  },
];

export default function PartnersSection() {
  const t = useTranslations("partners");
  const [activeLocation, setActiveLocation] = useState<string | null>(null);

  return (
    <section className="py-16 md:py-24 bg-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            {t("title")}
          </h2>
          <p className="text-primary/70 text-lg max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Interactive Map Container */}
        <div className="relative bg-gradient-to-br from-accent/30 via-secondary/10 to-accent/20 rounded-3xl p-4 md:p-8 lg:p-12 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

          {/* World Map Container */}
          <div className="relative w-full max-w-5xl mx-auto">
            <svg
              viewBox="0 0 1000 500"
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Background */}
              <rect width="1000" height="500" fill="transparent" />

              {/* Simplified World Map Paths - Mercator projection style */}
              <g className="text-primary/15" fill="currentColor">
                {/* North America */}
                <path d="M50,120 Q80,80 150,90 Q200,85 230,100 Q260,90 280,110 Q290,130 280,160 Q260,180 240,190 Q220,210 180,220 Q140,230 120,210 Q90,200 70,180 Q50,160 50,120 Z" />
                <path d="M120,220 Q140,215 160,225 Q180,240 170,260 Q150,280 120,270 Q100,250 120,220 Z" />

                {/* South America */}
                <path d="M180,280 Q220,270 250,290 Q270,320 280,360 Q275,400 260,430 Q240,455 210,460 Q180,455 170,420 Q165,380 175,340 Q170,300 180,280 Z" />

                {/* Europe */}
                <path d="M460,100 Q500,85 540,95 Q570,90 590,110 Q600,130 590,150 Q570,165 540,170 Q510,175 480,165 Q455,150 450,130 Q455,110 460,100 Z" />

                {/* Africa */}
                <path d="M450,180 Q490,175 530,185 Q570,195 590,230 Q600,270 590,320 Q575,370 550,400 Q520,420 480,415 Q450,400 435,360 Q425,310 435,260 Q440,210 450,180 Z" />

                {/* Asia */}
                <path d="M600,80 Q680,60 760,70 Q840,75 900,100 Q940,130 950,170 Q945,210 920,240 Q880,260 830,265 Q780,270 730,255 Q680,240 650,210 Q620,180 610,150 Q600,120 600,80 Z" />

                {/* Middle East */}
                <path d="M580,180 Q620,175 660,190 Q690,210 680,240 Q660,260 620,260 Q590,250 580,220 Q575,195 580,180 Z" />

                {/* India */}
                <path d="M700,200 Q730,195 750,215 Q765,250 755,290 Q740,320 710,325 Q680,315 675,280 Q675,240 700,200 Z" />

                {/* Southeast Asia */}
                <path d="M780,240 Q820,235 850,255 Q870,280 860,310 Q840,330 800,335 Q770,330 765,300 Q765,265 780,240 Z" />

                {/* Australia */}
                <path d="M820,360 Q870,350 910,370 Q940,395 935,430 Q915,455 870,460 Q830,455 810,425 Q800,390 820,360 Z" />

                {/* Japan */}
                <path d="M880,140 Q895,130 910,145 Q920,165 910,185 Q895,195 880,180 Q870,160 880,140 Z" />

                {/* UK/Ireland */}
                <path d="M445,115 Q455,105 465,115 Q470,130 460,140 Q445,145 440,130 Q440,120 445,115 Z" />

                {/* Greenland */}
                <path d="M300,40 Q350,30 390,50 Q410,75 400,100 Q370,115 330,105 Q300,90 295,65 Q295,50 300,40 Z" />
              </g>

              {/* Connection Lines */}
              <g>
                {locations.map((loc, i) => {
                  const nextLoc = locations[(i + 1) % locations.length];
                  return (
                    <line
                      key={`line-${loc.id}`}
                      x1={loc.coordinates.x}
                      y1={loc.coordinates.y}
                      x2={nextLoc.coordinates.x}
                      y2={nextLoc.coordinates.y}
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="5,5"
                      className="text-secondary/40"
                    />
                  );
                })}
              </g>

              {/* Location Markers */}
              {locations.map((location) => (
                <g
                  key={location.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveLocation(location.id)}
                  onMouseLeave={() => setActiveLocation(null)}
                >
                  {/* Pulse Ring */}
                  <circle
                    cx={location.coordinates.x}
                    cy={location.coordinates.y}
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-secondary animate-ping"
                    style={{
                      transformOrigin: `${location.coordinates.x}px ${location.coordinates.y}px`,
                    }}
                  />

                  {/* Outer Ring */}
                  <circle
                    cx={location.coordinates.x}
                    cy={location.coordinates.y}
                    r="16"
                    fill="currentColor"
                    className={`transition-colors duration-300 ${
                      activeLocation === location.id
                        ? "text-primary"
                        : "text-secondary/30"
                    }`}
                  />

                  {/* Inner Circle */}
                  <circle
                    cx={location.coordinates.x}
                    cy={location.coordinates.y}
                    r="10"
                    fill="currentColor"
                    className={`transition-colors duration-300 ${
                      activeLocation === location.id
                        ? "text-primary"
                        : "text-secondary"
                    }`}
                  />

                  {/* Center Dot */}
                  <circle
                    cx={location.coordinates.x}
                    cy={location.coordinates.y}
                    r="4"
                    fill="white"
                  />
                </g>
              ))}
            </svg>

            {/* Floating Tooltips */}
            {locations.map((location) => (
              <div
                key={`tooltip-${location.id}`}
                className={`absolute transition-all duration-300 ${
                  activeLocation === location.id
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{
                  left: `${(location.coordinates.x / 1000) * 100}%`,
                  top: `${(location.coordinates.y / 500) * 100}%`,
                  transform: "translate(-50%, -120%)",
                }}
              >
                <div className="bg-primary text-white px-4 py-2 rounded-xl shadow-xl whitespace-nowrap font-medium text-sm">
                  {t(`locations.${location.key}`)}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full border-8 border-transparent border-t-primary" />
                </div>
              </div>
            ))}
          </div>

          {/* Location Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {locations.map((location) => (
              <div
                key={location.id}
                className={`flex items-center gap-4 p-4 md:p-5 bg-white/80 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  activeLocation === location.id
                    ? "border-secondary shadow-lg scale-[1.02]"
                    : "border-transparent hover:border-secondary/50"
                }`}
                onMouseEnter={() => setActiveLocation(location.id)}
                onMouseLeave={() => setActiveLocation(null)}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    activeLocation === location.id
                      ? "bg-primary"
                      : "bg-secondary"
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
      </div>
    </section>
  );
}
