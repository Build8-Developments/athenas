"use client";

import { useTranslations } from "next-intl";
import { Mail, Phone, MapPin, LucideIcon } from "lucide-react";

interface ContactMethod {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

export default function ContactMethods() {
  const t = useTranslations("contact.methods");
  const footer = useTranslations("footer");

  const contactMethods: ContactMethod[] = [
    {
      icon: Mail,
      label: t("email"),
      value: footer("email"),
      href: `mailto:${footer("email")}`,
    },
    {
      icon: Phone,
      label: t("phone"),
      value: footer("phone"),
      href: `tel:${footer("phone")}`,
    },
    {
      icon: MapPin,
      label: t("address"),
      value: footer("address"),
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-10 rtl:font-arabic">
          {t("title")}
        </h2>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            const content = (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm h-48"
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>

                {/* Label */}
                <h3 className="text-xl font-semibold text-primary mb-3 rtl:font-arabic">
                  {method.label}
                </h3>

                {/* Value */}
                <p className="text-gray-600 rtl:font-arabic text-lg leading-relaxed whitespace-pre-line">{method.value}</p>
              </div>
            );

            // Wrap with link if href exists
            if (method.href) {
              return (
                <a
                  key={index}
                  href={method.href}
                  className="block"
                >
                  {content}
                </a>
              );
            }

            return content;
          })}
        </div>
      </div>
    </section>
  );
}
