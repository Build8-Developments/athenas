"use client";

import { useLocale } from "next-intl";
import Image from "next/image";
import ContactForm from "./ContactForm";

export default function ContactFormSection() {
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch ${
            isRTL ? "lg:flex-row-reverse" : ""
          }`}
          style={{ direction: isRTL ? "rtl" : "ltr" }}
        >
          {/* Form Column */}
          <div className={isRTL ? "lg:order-1" : "lg:order-1"}>
            <ContactForm />
          </div>

          {/* Image Column */}
          <div className={isRTL ? "lg:order-2" : "lg:order-2"}>
            <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=1000&fit=crop&crop=center"
                alt="Contact us"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
