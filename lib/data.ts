import dbConnect from "@/lib/db";
import { Product, Category } from "@/models";
import type { IProduct, ICategory } from "@/models";

export interface ProductData {
  _id: string;
  slug: string;
  locale: string;
  name: string;
  description: string;
  category: string;
  image: string;
  gallery: string[];
  weight: string;
  minOrder: string;
  grade: string;
  featured: boolean;
  new: boolean;
  active: boolean;
  certifications?: string[];
  specifications?: {
    packaging: string;
    shelfLife: string;
    storage: string;
    origin: string;
  };
}

export interface CategoryData {
  _id: string;
  slug: string;
  locale: string;
  name: string;
  icon: string;
  order: number;
}

/**
 * Get all products for a specific locale
 */
export async function getProducts(
  locale: string,
  options?: {
    category?: string;
    featured?: boolean;
    isNew?: boolean;
    limit?: number;
    page?: number;
  }
): Promise<{ products: ProductData[]; total: number }> {
  await dbConnect();

  const query: Record<string, unknown> = {
    locale,
    active: true,
  };

  if (options?.category && options.category !== "all") {
    query.category = options.category;
  }

  if (options?.featured) {
    query.featured = true;
  }

  if (options?.isNew) {
    query.new = true;
  }

  let productsQuery = Product.find(query).sort({ createdAt: -1 });

  if (options?.limit) {
    const skip = ((options.page || 1) - 1) * options.limit;
    productsQuery = productsQuery.skip(skip).limit(options.limit);
  }

  const [products, total] = await Promise.all([
    productsQuery.lean<IProduct[]>(),
    Product.countDocuments(query),
  ]);

  // Convert ObjectIds to strings for serialization
  return {
    products: products.map((p) => ({
      ...p,
      _id: p._id.toString(),
    })) as ProductData[],
    total,
  };
}

/**
 * Get featured products for homepage
 */
export async function getFeaturedProducts(
  locale: string,
  limit = 8
): Promise<ProductData[]> {
  await dbConnect();

  const products = await Product.find({
    locale,
    active: true,
    featured: true,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean<IProduct[]>();

  return products.map((p) => ({
    ...p,
    _id: p._id.toString(),
  })) as ProductData[];
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(
  slug: string,
  locale: string
): Promise<ProductData | null> {
  await dbConnect();

  const product = await Product.findOne({
    slug,
    locale,
    active: true,
  }).lean<IProduct>();

  if (!product) return null;

  return {
    ...product,
    _id: product._id.toString(),
  } as ProductData;
}

/**
 * Get related products (same category, excluding current product)
 */
export async function getRelatedProducts(
  slug: string,
  category: string,
  locale: string,
  limit = 4
): Promise<ProductData[]> {
  await dbConnect();

  const products = await Product.find({
    locale,
    category,
    slug: { $ne: slug },
    active: true,
  })
    .sort({ featured: -1, createdAt: -1 })
    .limit(limit)
    .lean<IProduct[]>();

  return products.map((p) => ({
    ...p,
    _id: p._id.toString(),
  })) as ProductData[];
}

/**
 * Get all categories for a specific locale
 */
export async function getCategories(locale: string): Promise<CategoryData[]> {
  await dbConnect();

  const categories = await Category.find({ locale })
    .sort({ order: 1, name: 1 })
    .lean<ICategory[]>();

  return categories.map((c) => ({
    ...c,
    _id: c._id.toString(),
  })) as CategoryData[];
}

/**
 * Get categories with product counts
 */
export async function getCategoriesWithCounts(
  locale: string
): Promise<(CategoryData & { count: number })[]> {
  await dbConnect();

  const categories = await Category.find({ locale })
    .sort({ order: 1, name: 1 })
    .lean<ICategory[]>();

  // Get product counts for each category
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({
        locale,
        category: cat.slug,
        active: true,
      });
      return {
        ...cat,
        _id: cat._id.toString(),
        count,
      };
    })
  );

  return categoriesWithCounts as (CategoryData & { count: number })[];
}
