import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Category } from "@/models";
import { getAuthFromCookies } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/categories/[id] - Get a single category by slug (public)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const both = searchParams.get("both") === "true";

    if (both) {
      const categories = await Category.find({ slug: id }).lean();
      const en = categories.find((c) => c.locale === "en");
      const ar = categories.find((c) => c.locale === "ar");

      if (!en && !ar) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ en, ar });
    }

    const category = await Category.findOne({ slug: id, locale }).lean();

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id] - Update a category (protected)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const data = await request.json();

    const existingCategories = await Category.find({ slug: id });

    if (existingCategories.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const baseUpdate: Record<string, unknown> = {
      icon: data.icon,
      order: data.order || 0,
    };

    if (data.slug && data.slug !== id) {
      const slugExists = await Category.findOne({
        slug: data.slug.toLowerCase().trim(),
      });
      if (slugExists && slugExists.slug !== id) {
        return NextResponse.json(
          { error: "A category with this slug already exists" },
          { status: 400 }
        );
      }
      baseUpdate.slug = data.slug.toLowerCase().trim();
    }

    await Category.findOneAndUpdate(
      { slug: id, locale: "en" },
      { ...baseUpdate, name: data.name_en },
      { new: true }
    );

    await Category.findOneAndUpdate(
      { slug: id, locale: "ar" },
      { ...baseUpdate, name: data.name_ar },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete a category (protected)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;

    const result = await Category.deleteMany({ slug: id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      deleted: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
