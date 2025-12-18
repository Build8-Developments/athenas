"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductForm from "../../ProductForm";

interface ProductData {
  en: {
    slug: string;
    name: string;
    description: string;
    category: string;
    image: string;
    gallery: string[];
    price: number;
    priceUnit: string;
    minOrder: string;
    specifications: Record<string, string>;
    certifications: string[];
    featured: boolean;
    new: boolean;
  };
  ar: {
    name: string;
    description: string;
    specifications: Record<string, string>;
  };
}

export default function EditProductPage() {
  const params = useParams();
  const slug = params.id as string;
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}?both=true`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProductData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-600 text-lg">{error || "Product not found"}</p>
      </div>
    );
  }

  return <ProductForm initialData={productData} isEdit />;
}
