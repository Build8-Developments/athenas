import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Category } from "@/models";
import { getAuthFromCookies } from "@/lib/auth";

// GET /api/categories - Get all categories (public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const all = searchParams.get("all") === "true"; // For dashboard

    const query: Record<string, unknown> = {};
    if (!all) {
      query.locale = locale;
    }

    const categories = await Category.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create a category (protected)
// Creates both EN and AR versions
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const auth = await getAuthFromCookies();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const data = await request.json();

    // Validate required fields
    if (!data.slug || !data.name_en || !data.name_ar || !data.icon) {
      return NextResponse.json(
        { error: "Missing required fields: slug, name_en, name_ar, icon" },
        { status: 400 }
      );
    }

    // Check if category with same slug exists
    const existing = await Category.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 400 }
      );
    }

    // Create English version
    const categoryEn = await Category.create({
      slug: data.slug.toLowerCase().trim(),
      locale: "en",
      name: data.name_en,
      icon: data.icon,
      order: data.order || 0,
    });

    // Create Arabic version
    const categoryAr = await Category.create({
      slug: data.slug.toLowerCase().trim(),
      locale: "ar",
      name: data.name_ar,
      icon: data.icon,
      order: data.order || 0,
    });

    return NextResponse.json(
      {
        success: true,
        categories: {
          en: categoryEn,
          ar: categoryAr,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
