import { NextRequest, NextResponse } from "next/server";
import {
  sendQuoteRequestEmail,
  type ContactFormData,
  type ProductInfo,
} from "@/lib/email";

interface QuoteRequestBody {
  customerInfo: ContactFormData;
  products: ProductInfo[];
  locale: string;
}

/**
 * POST /api/quote-request - Submit a quote request
 * Requirements: 5.1, 5.6
 */
export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequestBody = await request.json();

    // Validate request body
    if (!body.customerInfo) {
      return NextResponse.json(
        { error: "Missing customer information" },
        { status: 400 }
      );
    }

    const { fullName, email, phone } = body.customerInfo;

    // Validate required customer fields
    if (!fullName || !fullName.trim()) {
      return NextResponse.json(
        { error: "Full name is required" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    // Validate products
    if (
      !body.products ||
      !Array.isArray(body.products) ||
      body.products.length === 0
    ) {
      return NextResponse.json(
        { error: "At least one product is required" },
        { status: 400 }
      );
    }

    // Call email service
    const result = await sendQuoteRequestEmail({
      customerInfo: body.customerInfo,
      products: body.products,
      locale: body.locale || "en",
      timestamp: new Date().toISOString(),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send quote request" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quote request submitted successfully",
    });
  } catch (error) {
    console.error("Error processing quote request:", error);
    return NextResponse.json(
      { error: "Failed to process quote request" },
      { status: 500 }
    );
  }
}
