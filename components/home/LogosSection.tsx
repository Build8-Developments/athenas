"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function LogosSection() {
  const t = useTranslations("logos");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Partner company logos - using geometric shapes from Unsplash
  const logos = [
    { name: "Partner 1", src: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=80&fit=crop&crop=center" },
    { name: "Partner 2", src: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=200&h=80&fit=crop&crop=center" },
    { name: "Partner 3", src: "https://images.unsplash.com/photo-1614680376408-81e91ffe3db7?w=200&h=80&fit=crop&crop=center" },
    { name: "Partner 4", src: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=200&h=80&fit=crop&crop=center" },
    { name: "Partner 5", src: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=200&h=80&fit=crop&crop=center" },
    { name: "Partner 6", src: "https://images.unsplash.com/photo-1614680376428-da3d9b39760b?w=200&h=80&fit=crop&crop=center" },
    { name: "Partner 7", src: "https://images.unsplash.com/photo-1614680376417-1e7dc4723f8e?w=200&h=80&fit=crop&crop=center" },
    { name: "Partner 8", src: "https://images.unsplash.com/photo-1614680376451-54d6931473aa?w=200&h=80&fit=crop&crop=center" },
  ];

  // Touch/Mouse handlers for manual scrolling
  const handleDragStart = (clientX: number) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setIsPaused(true);
    setStartX(clientX);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || !scrollRef.current) return;
    const x = clientX;
    const walk = (startX - x) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft + walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    // Resume animation after delay
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) handleDragEnd();
    setIsPaused(false);
  };

  return (
    <section className="py-12 md:py-16 bg-light overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-center text-primary/60 text-sm font-medium uppercase tracking-wider">
          {t("title")}
        </p>
      </div>

      {/* Scrolling Logos */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-r from-light to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-linear-to-l from-light to-transparent z-10 pointer-events-none" />

        {/* Scrolling Container */}
        <div
          ref={scrollRef}
          className={`flex overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing ${
            !isPaused ? "animate-scroll" : ""
          }`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={() => setIsPaused(true)}
        >
          {/* First set of logos */}
          {logos.map((logo, index) => (
            <div
              key={`logo-1-${index}`}
              className="shrink-0 mx-6 md:mx-8 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 select-none"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={200}
                height={80}
                className="h-10 md:h-12 w-auto object-contain pointer-events-none"
                draggable={false}
                unoptimized
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {logos.map((logo, index) => (
            <div
              key={`logo-2-${index}`}
              className="shrink-0 mx-6 md:mx-8 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 select-none"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={200}
                height={80}
                className="h-10 md:h-12 w-auto object-contain pointer-events-none"
                draggable={false}
                unoptimized
              />
            </div>
          ))}
          {/* Third set for extra buffer */}
          {logos.map((logo, index) => (
            <div
              key={`logo-3-${index}`}
              className="shrink-0 mx-6 md:mx-8 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 select-none"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={200}
                height={80}
                className="h-10 md:h-12 w-auto object-contain pointer-events-none"
                draggable={false}
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
