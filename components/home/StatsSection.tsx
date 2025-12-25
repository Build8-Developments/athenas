"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Package, Globe, Calendar, Boxes } from "lucide-react";

export default function StatsSection() {
  const t = useTranslations("stats");
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    { key: "exports", value: 15000, suffix: "+", icon: Package },
    { key: "countries", value: 25, suffix: "+", icon: Globe },
    { key: "years", value: 12, suffix: "+", icon: Calendar },
    { key: "products", value: 50, suffix: "+", icon: Boxes },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 bg-linear-to-br from-secondary/80 to-primary/70"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="text-center"
                style={{
                  animation: isVisible
                    ? `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`
                    : "none",
                  opacity: isVisible ? 1 : 0,
                }}
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-2xl mb-4">
                  <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                </div>

                {/* Number */}
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  <CountUp
                    end={stat.value}
                    suffix={stat.suffix}
                    isVisible={isVisible}
                  />
                </div>

                {/* Label */}
                <p className="text-white/80 text-sm md:text-base font-medium">
                  {t(stat.key)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CountUp({
  end,
  suffix,
  isVisible,
}: {
  end: number;
  suffix: string;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end, isVisible]);

  return (
    <>
      {count.toLocaleString()}
      {suffix}
    </>
  );
}
