import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Package, ArrowLeft } from "lucide-react";

export default function ProductNotFound() {
  const t = useTranslations("productDetail");

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-light/30">
      <div className="text-center">
        <div className="w-24 h-24 bg-accent/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-12 h-12 text-primary/50" />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-4">
          {t("productNotFound")}
        </h1>
        <p className="text-primary/60 mb-8 max-w-md">
          {t("productNotFoundDesc")}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          {t("backToProducts")}
        </Link>
      </div>
    </div>
  );
}
