"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();

  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("validation.nameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("validation.emailInvalid");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("validation.phoneRequired");
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t("validation.subjectRequired");
    }

    if (!formData.message.trim()) {
      newErrors.message = t("validation.messageRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const handleRetry = () => {
    setStatus("idle");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setErrors({});
    setStatus("idle");
  };

  // Success state
  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-2 rtl:font-arabic">
          {t("success.title")}
        </h3>
        <p className="text-primary/60 mb-6 rtl:font-arabic">
          {t("success.message")}
        </p>
        <button
          onClick={resetForm}
          className="px-6 py-2 bg-secondary hover:bg-primary text-white rounded-lg font-medium transition-colors"
        >
          {t("form.submit")}
        </button>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-2 rtl:font-arabic">
          {t("error.title")}
        </h3>
        <p className="text-primary/60 mb-6 rtl:font-arabic">
          {t("error.message")}
        </p>
        <button
          onClick={handleRetry}
          className="px-6 py-2 bg-secondary hover:bg-primary text-white rounded-lg font-medium transition-colors"
        >
          {t("error.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
      {/* Form Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary rtl:font-arabic">
          {t("form.title")}
        </h2>
        <p className="text-primary/60 mt-1 rtl:font-arabic">
          {t("form.subtitle")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-primary mb-1 rtl:font-arabic"
          >
            {t("form.name")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={t("form.namePlaceholder")}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.name
                ? "border-red-500 focus:ring-red-500"
                : "border-accent/50 focus:ring-secondary"
            } focus:outline-none focus:ring-2 transition-colors rtl:text-right`}
            disabled={status === "submitting"}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500 rtl:font-arabic">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-primary mb-1 rtl:font-arabic"
          >
            {t("form.email")} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t("form.emailPlaceholder")}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-accent/50 focus:ring-secondary"
            } focus:outline-none focus:ring-2 transition-colors rtl:text-right`}
            disabled={status === "submitting"}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 rtl:font-arabic">
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-primary mb-1 rtl:font-arabic"
          >
            {t("form.phone")} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={t("form.phonePlaceholder")}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.phone
                ? "border-red-500 focus:ring-red-500"
                : "border-accent/50 focus:ring-secondary"
            } focus:outline-none focus:ring-2 transition-colors rtl:text-right`}
            disabled={status === "submitting"}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500 rtl:font-arabic">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-primary mb-1 rtl:font-arabic"
          >
            {t("form.subject")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder={t("form.subjectPlaceholder")}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.subject
                ? "border-red-500 focus:ring-red-500"
                : "border-accent/50 focus:ring-secondary"
            } focus:outline-none focus:ring-2 transition-colors rtl:text-right`}
            disabled={status === "submitting"}
          />
          {errors.subject && (
            <p className="mt-1 text-sm text-red-500 rtl:font-arabic">
              {errors.subject}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-primary mb-1 rtl:font-arabic"
          >
            {t("form.message")} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder={t("form.messagePlaceholder")}
            rows={5}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              errors.message
                ? "border-red-500 focus:ring-red-500"
                : "border-accent/50 focus:ring-secondary"
            } focus:outline-none focus:ring-2 transition-colors resize-none rtl:text-right`}
            disabled={status === "submitting"}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-500 rtl:font-arabic">
              {errors.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-3 bg-secondary hover:bg-primary text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 rtl:font-arabic"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t("form.submitting")}
            </>
          ) : (
            t("form.submit")
          )}
        </button>
      </form>
    </div>
  );
}
