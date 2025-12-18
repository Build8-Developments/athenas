import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  products,
  getProductBySlug,
  getProductsByCategory,
} from "@/data/products";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import Footer from "@/components/layout/Footer";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// Generate static params for all products
export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const t = await getTranslations({ locale, namespace: "productItems" });

  const productName = t(product.nameKey);
  const productDescription = t(product.descriptionKey);

  return {
    title: `${productName} | Athenas Foods`,
    description: productDescription,
    keywords: `${productName}, frozen ${product.category}, Egyptian exports, IQF products, Athenas Foods`,
    openGraph: {
      title: `${productName} | Athenas Foods`,
      description: productDescription,
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      siteName: "Athenas Foods",
      images: [
        {
          url: product.image,
          width: 600,
          height: 600,
          alt: productName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} | Athenas Foods`,
      description: productDescription,
      images: [product.image],
    },
    alternates: {
      languages: {
        en: `/en/products/${slug}`,
        ar: `/ar/products/${slug}`,
      },
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
      <Footer />
    </>
  );
}
