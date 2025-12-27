"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function FAQSection() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [sectionRef, isVisible] = useScrollAnimation<HTMLElement>({
    threshold: 0.15,
  });

  // Get questions array from translations
  const questions = [
    {
      question: t("questions.0.question"),
      answer: t("questions.0.answer"),
    },
    {
      question: t("questions.1.question"),
      answer: t("questions.1.answer"),
    },
    {
      question: t("questions.2.question"),
      answer: t("questions.2.answer"),
    },
    {
      question: t("questions.3.question"),
      answer: t("questions.3.answer"),
    },
    {
      question: t("questions.4.question"),
      answer: t("questions.4.answer"),
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="py-16 md:py-24 bg-accent/30 relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop&crop=center')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* Light overlay */}
      <div className="absolute inset-0 bg-white/85"></div>
      <div className="max-w-4xl mx-auto px-6 relative z-10">
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

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {questions.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-accent/30 transition-all duration-500 hover:shadow-md ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Question Button */}
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left"
              >
                <span className="text-primary font-semibold text-base md:text-lg pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-5 md:px-6 pb-5 md:pb-6">
                  <p className="text-primary/70 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
