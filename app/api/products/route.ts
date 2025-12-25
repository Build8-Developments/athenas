import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Product } from "@/models";
import { getAuthFromCookies } from "@/lib/auth";

// GET /api/products - Get all products (public)
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Debug: Log connection info
    console.log(
      "MongoDB URI:",
      process.env.MONGODB_URI?.substring(0, 30) + "..."
    );

    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const isNew = searchParams.get("new");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "0");
    const page = parseInt(searchParams.get("page") || "1");
    const all = searchParams.get("all") === "true"; // For dashboard - get all locales

    // Build query
    const query: Record<string, unknown> = { active: true };

    if (!all) {
      query.locale = locale;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (featured === "true") {
      query.featured = true;
    }

    if (isNew === "true") {
      query.new = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    // Debug: Log query and count all documents
    console.log("Query:", JSON.stringify(query));
    const totalDocs = await Product.countDocuments({});
    console.log("Total documents in collection:", totalDocs);

    // Build the query
    let productsQuery = Product.find(query).sort({ createdAt: -1 });

    // Pagination
    if (limit > 0) {
      const skip = (page - 1) * limit;
      productsQuery = productsQuery.skip(skip).limit(limit);
    }

    const products = await productsQuery.lean();
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit: limit || total,
        pages: limit > 0 ? Math.ceil(total / limit) : 1,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a product (protected)
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
    if (!data.slug || !data.name_en || !data.name_ar || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields: slug, name_en, name_ar, category" },
        { status: 400 }
      );
    }

    // Check if product with same slug exists in any locale
    const existing = await Product.findOne({ slug: data.slug });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }

    // Create base product data (shared fields)
    const baseProduct = {
      slug: data.slug.toLowerCase().trim(),
      category: data.category,
      image: data.image || "",
      gallery: data.gallery || [],
      weight: data.weight || "",
      minOrder: data.minOrder || "",
      grade: data.grade || "",
      featured: data.featured || false,
      new: data.new || false,
      active: data.active !== false,
    };

    // Create English version
    const productEn = await Product.create({
      ...baseProduct,
      locale: "en",
      name: data.name_en,
      description: data.description_en || "",
    });

    // Create Arabic version
    const productAr = await Product.create({
      ...baseProduct,
      locale: "ar",
      name: data.name_ar,
      description: data.description_ar || "",
    });

    return NextResponse.json(
      {
        success: true,
        products: {
          en: productEn,
          ar: productAr,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
