import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getProductBySlug, getRelatedProducts, getProducts } from "@/lib/data";
import ProductDetailClient from "@/components/products/ProductDetailClient";
import Footer from "@/components/layout/Footer";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// Generate static params for all products (using English locale to get slugs)
export async function generateStaticParams() {
  const { products } = await getProducts("en");
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Athenas Foods`,
    description: product.description,
    keywords: `${product.name}, frozen ${product.category}, Egyptian exports, IQF products, Athenas Foods`,
    openGraph: {
      title: `${product.name} | Athenas Foods`,
      description: product.description,
      type: "website",
      locale: locale === "ar" ? "ar_EG" : "en_US",
      siteName: "Athenas Foods",
      images: [
        {
          url: product.image,
          width: 600,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Athenas Foods`,
      description: product.description,
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

  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  const relatedProducts = await getRelatedProducts(
    slug,
    product.category,
    locale,
    4
  );

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
