import { notFound } from "next/navigation";
import { getProductBySlug } from "@/data/products";
import ProductForm from "../../ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProductBySlug(id);

  if (!product) {
    notFound();
  }

  return <ProductForm initialData={product} isEditing />;
}
