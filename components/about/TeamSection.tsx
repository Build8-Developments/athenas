"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = useRef(0);
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>({
    threshold: 0.2,
  });

  const nextMember = () =>
    setActiveIndex((prev) => (prev + 1) % teamMembers.length);
  const prevMember = () =>
    setActiveIndex(
      (prev) => (prev - 1 + teamMembers.length) % teamMembers.length
    );

  // Touch handlers for smooth dragging
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    // Limit drag offset
    setDragOffset(Math.max(-150, Math.min(150, diff)));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset > 50) {
      prevMember();
    } else if (dragOffset < -50) {
      nextMember();
    }
    setDragOffset(0);
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-24 bg-linear-to-b from-light to-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-12 md:mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            {t("title")}
          </h2>
          <p className="text-base md:text-lg text-primary/70 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Mobile Carousel View with Sliding Animation */}
        <div
          className="md:hidden relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative px-4">
            {/* Cards Container */}
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(calc(-${
                  activeIndex * 100
                }% + ${dragOffset}px))`,
                transition: isDragging
                  ? "none"
                  : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {teamMembers.map((member, index) => (
                <div key={member.nameKey} className="w-full shrink-0 px-2">
                  <div
                    className={`relative bg-white rounded-3xl overflow-hidden shadow-xl mx-auto max-w-sm transition-all duration-300 ${
                      isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    } ${
                      index === activeIndex
                        ? "scale-100"
                        : "scale-95 opacity-80"
                    }`}
                  >
                    {/* Image with gradient overlay */}
                    <div className="relative aspect-3/4">
                      <Image
                        src={member.image}
                        alt={t(`members.${member.nameKey}.name`)}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/20 to-transparent" />
                    </div>

                    {/* Info overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-1">
                        {t(`members.${member.nameKey}.name`)}
                      </h3>
                      <p className="text-secondary font-medium">
                        {t(`members.${member.roleKey}.role`)}
                      </p>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/30 rounded-full" />
                    <div className="absolute top-8 right-8 w-8 h-8 bg-secondary/50 rounded-full blur-sm" />
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevMember}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-colors z-10"
              aria-label="Previous member"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMember}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-secondary hover:text-white transition-colors z-10"
              aria-label="Next member"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "bg-primary w-8"
                    : "bg-primary/30 w-2 hover:bg-primary/50"
                }`}
                aria-label={`Go to member ${index + 1}`}
              />
            ))}
          </div>

          {/* Swipe hint */}
          <p className="text-center text-primary/40 text-xs mt-3">
            ← Swipe to navigate →
          </p>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.nameKey}
              className={`group relative transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150 + 200}ms` }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div
                className={`relative bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-500 ${
                  activeIndex === index
                    ? "scale-105 shadow-2xl"
                    : "hover:shadow-xl"
                }`}
              >
                {/* Image */}
                <div className="relative aspect-3/4 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={t(`members.${member.nameKey}.name`)}
                    fill
                    className={`object-cover transition-transform duration-700 ${
                      activeIndex === index
                        ? "scale-110"
                        : "group-hover:scale-105"
                    }`}
                    unoptimized
                  />
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      activeIndex === index
                        ? "bg-linear-to-t from-primary/90 via-primary/30 to-transparent"
                        : "bg-linear-to-t from-primary/70 via-transparent to-transparent"
                    }`}
                  />
                </div>

                {/* Info */}
                <div
                  className={`absolute bottom-0 left-0 right-0 p-6 text-white transition-all duration-500 ${
                    activeIndex === index ? "translate-y-0" : "translate-y-2"
                  }`}
                >
                  <h3
                    className={`font-bold mb-1 transition-all duration-300 ${
                      activeIndex === index ? "text-2xl" : "text-xl"
                    }`}
                  >
                    {t(`members.${member.nameKey}.name`)}
                  </h3>
                  <p
                    className={`font-medium transition-all duration-300 ${
                      activeIndex === index ? "text-secondary" : "text-white/80"
                    }`}
                  >
                    {t(`members.${member.roleKey}.role`)}
                  </p>
                </div>

                {/* Active indicator */}
                <div
                  className={`absolute top-4 right-4 w-3 h-3 rounded-full transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-secondary scale-100"
                      : "bg-white/50 scale-0"
                  }`}
                />

                {/* Decorative corner */}
                <div
                  className={`absolute top-0 left-0 w-20 h-20 transition-all duration-500 ${
                    activeIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-secondary/50 rounded-tl-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Active Indicator Bar */}
        <div className="hidden md:flex justify-center mt-8">
          <div className="flex gap-3">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-1 rounded-full transition-all duration-500 ${
                  index === activeIndex
                    ? "bg-secondary w-12"
                    : "bg-primary/20 w-8 hover:bg-primary/40"
                }`}
                aria-label={`Select member ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
