import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Product } from "@/models";
import { getAuthFromCookies } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/products/[id] - Get a single product by slug (public)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const both = searchParams.get("both") === "true"; // Get both locales for dashboard

    if (both) {
      // Return both locale versions for dashboard editing
      const products = await Product.find({ slug: id }).lean();
      const en = products.find((p) => p.locale === "en");
      const ar = products.find((p) => p.locale === "ar");

      if (!en && !ar) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ en, ar });
    }

    // Find by slug and locale
    const product = await Product.findOne({ slug: id, locale }).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product (protected)
// Updates both EN and AR versions by slug
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params; // This is the slug
    const data = await request.json();

    // Find existing products by slug
    const existingProducts = await Product.find({ slug: id });

    if (existingProducts.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Base update data (shared fields)
    const baseUpdate: Record<string, unknown> = {
      category: data.category,
      image: data.image,
      gallery: data.gallery || [],
      weight: data.weight || "",
      minOrder: data.minOrder || "",
      grade: data.grade || "",
      featured: data.featured,
      new: data.new,
      active: data.active !== false,
    };

    // If slug is being changed, update both versions
    if (data.slug && data.slug !== id) {
      // Check if new slug already exists
      const slugExists = await Product.findOne({
        slug: data.slug.toLowerCase().trim(),
      });
      if (slugExists && slugExists.slug !== id) {
        return NextResponse.json(
          { error: "A product with this slug already exists" },
          { status: 400 }
        );
      }
      baseUpdate.slug = data.slug.toLowerCase().trim();
    }

    // Update English version
    await Product.findOneAndUpdate(
      { slug: id, locale: "en" },
      {
        ...baseUpdate,
        name: data.name_en,
        description: data.description_en || "",
      },
      { new: true }
    );

    // Update Arabic version
    await Product.findOneAndUpdate(
      { slug: id, locale: "ar" },
      {
        ...baseUpdate,
        name: data.name_ar,
        description: data.description_ar || "",
      },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete a product (protected)
// Deletes both EN and AR versions
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params; // This is the slug

    // Delete both locale versions
    const result = await Product.deleteMany({ slug: id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
