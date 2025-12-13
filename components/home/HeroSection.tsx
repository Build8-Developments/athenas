"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/shared/Button";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Background images for the slider
  const slides = [
    "/hero/hero-bg-1.jpg",
    "/hero/hero-bg-2.jpg",
    "/hero/hero-bg-3.jpg",
  ];

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image Slider */}
      {slides.map((slide, index) => (
        <div
          key={slide}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide}
            alt={`Hero background ${index + 1}`}
            fill
            priority={index === 0}
            className="object-cover"
            unoptimized
          />
        </div>
      ))}

      {/* Overlay with blur */}
      <div className="absolute inset-0 bg-light/75 backdrop-blur-xs" />

      {/* Hero Content */}
      <div className="relative z-10 flex h-full items-center px-6 max-w-7xl mx-auto">
        <div className="text-left max-w-3xl">
          {/* Welcome Text */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-primary"></div>
            <p className="text-primary text-sm md:text-base font-medium tracking-wide uppercase">
              Welcome to Athenas Foods
            </p>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary mb-6 leading-tight">
            Your trusted partner in exporting
            <br />
            premium Egyptian frozen products.
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg lg:text-xl text-primary/80 mb-8 leading-relaxed">
            We specialize in delivering high-quality frozen vegetables, fruits,
            and herbs to global markets—ensuring freshness, flavor, and
            reliability in every shipment.
          </p>

          {/* CTA Button */}
          <Button href="/contact">Get in Touch</Button>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-primary/30 hover:bg-primary/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
