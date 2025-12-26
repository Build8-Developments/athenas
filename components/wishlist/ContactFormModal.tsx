"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import type { ProductData } from "@/lib/data";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductData[];
  locale: string;
}

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactFormModal({
  isOpen,
  onClose,
  products,
  locale,
}: ContactFormModalProps) {
  const t = useTranslations("wishlist");

  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        company: "",
        message: "",
      });
      setErrors({});
      setStatus("idle");
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t("validation.fullNameRequired");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("validation.emailInvalid");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("validation.phoneRequired");
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
      const response = await fetch("/api/quote-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerInfo: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            company: formData.company || undefined,
            message: formData.message || undefined,
          },
          products: products.map((p) => ({
            id: p._id,
            name: p.name,
            category: p.category,
          })),
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quote request");
      }

      setStatus("success");

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch {
      setStatus("error");
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Success state
  if (status === "success") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">
            {t("quoteSuccess.title")}
          </h3>
          <p className="text-primary/60">{t("quoteSuccess.message")}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={handleOverlayClick}
      >
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-primary mb-2">
            {t("quoteError.title")}
          </h3>
          <p className="text-primary/60 mb-6">{t("quoteError.message")}</p>
          <button
            onClick={() => setStatus("idle")}
            className="px-6 py-2 bg-secondary hover:bg-primary text-white rounded-lg font-medium transition-colors"
          >
            {t("quoteError.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-accent/30">
          <div>
            <h2 className="text-xl font-bold text-primary">
              {t("quoteForm.title")}
            </h2>
            <p className="text-sm text-primary/60 mt-1">
              {t("quoteForm.subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-accent/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-primary/60" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-primary mb-1"
            >
              {t("quoteForm.fullName")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder={t("quoteForm.fullNamePlaceholder")}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.fullName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-accent/50 focus:ring-secondary"
              } focus:outline-none focus:ring-2 transition-colors`}
              disabled={status === "submitting"}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary mb-1"
            >
              {t("quoteForm.email")} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={t("quoteForm.emailPlaceholder")}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-accent/50 focus:ring-secondary"
              } focus:outline-none focus:ring-2 transition-colors`}
              disabled={status === "submitting"}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-primary mb-1"
            >
              {t("quoteForm.phone")} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder={t("quoteForm.phonePlaceholder")}
              className={`w-full px-4 py-2.5 rounded-lg border ${
                errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-accent/50 focus:ring-secondary"
              } focus:outline-none focus:ring-2 transition-colors`}
              disabled={status === "submitting"}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Company (Optional) */}
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-primary mb-1"
            >
              {t("quoteForm.company")}{" "}
              <span className="text-primary/40">
                ({t("quoteForm.optional")})
              </span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              placeholder={t("quoteForm.companyPlaceholder")}
              className="w-full px-4 py-2.5 rounded-lg border border-accent/50 focus:outline-none focus:ring-2 focus:ring-secondary transition-colors"
              disabled={status === "submitting"}
            />
          </div>

          {/* Message (Optional) */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-primary mb-1"
            >
              {t("quoteForm.message")}{" "}
              <span className="text-primary/40">
                ({t("quoteForm.optional")})
              </span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder={t("quoteForm.messagePlaceholder")}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-accent/50 focus:outline-none focus:ring-2 focus:ring-secondary transition-colors resize-none"
              disabled={status === "submitting"}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3 bg-secondary hover:bg-primary text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("quoteForm.submitting")}
              </>
            ) : (
              t("quoteForm.submit")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
