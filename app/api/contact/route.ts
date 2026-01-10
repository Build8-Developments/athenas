import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/email-service";
import { getGeoData, getCountryName } from "@/lib/geo/geo-service";
import { formatContactText, formatContactHtml } from "@/lib/email/templates/contact-template";

interface ContactRequestBody {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  locale: string;
}

interface ContactResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * POST /api/contact - Submit a contact form message
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ContactResponse>> {
  try {
    const body: ContactRequestBody = await request.json();
    const headers = request.headers;

    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    if (!body.email?.trim()) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }
    if (!isValidEmail(body.email)) {
      return NextResponse.json({ success: false, error: "Invalid email format" }, { status: 400 });
    }
    if (!body.phone?.trim()) {
      return NextResponse.json({ success: false, error: "Phone is required" }, { status: 400 });
    }
    if (!body.subject?.trim()) {
      return NextResponse.json({ success: false, error: "Subject is required" }, { status: 400 });
    }
    if (!body.message?.trim()) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    // Enhance with Metadata
    const geo = getGeoData(request);
    const countryName = getCountryName(geo.country) || geo.country; // Resolve code to name if possible
    const userAgent = headers.get("user-agent") || undefined;

    const emailData = {
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      locale: body.locale || "en",
      country: countryName,
      city: geo.city,
      ip: geo.ip,
      userAgent: userAgent
    };

    // Prepare content
    const textContent = formatContactText(emailData);
    const htmlContent = formatContactHtml(emailData);

    const recipient = process.env.ATHENAS_EMAIL;

    if (!recipient) {
       console.error("❌ ATHENAS_EMAIL environment variable is not set");
       return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Send email
    const result = await sendEmail({
      to: recipient,
      replyTo: body.email,
      subject: `Contact Form: ${body.subject} [${countryName || 'Global'}]`,
      text: textContent,
      html: htmlContent,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process contact form" },
      { status: 500 }
    );
  }
}
