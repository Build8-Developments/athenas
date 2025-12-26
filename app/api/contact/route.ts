import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
 * Check if Gmail SMTP is configured
 */
function isSmtpConfigured(): boolean {
  return !!(
    process.env.GMAIL_USER &&
    process.env.GMAIL_APP_PASSWORD &&
    process.env.ATHENAS_EMAIL
  );
}

/**
 * Create nodemailer transporter for Gmail
 */
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format contact message as plain text
 */
function formatTextContent(data: ContactRequestBody): string {
  const date = new Date();

  const lines: string[] = [
    "═══════════════════════════════════════════════════════════════",
    "                    CONTACT FORM MESSAGE",
    "═══════════════════════════════════════════════════════════════",
    "",
    `Date: ${date.toLocaleString(data.locale === "ar" ? "ar-SA" : "en-US")}`,
    `Locale: ${data.locale}`,
    "",
    "───────────────────────────────────────────────────────────────",
    "                    CONTACT INFORMATION",
    "───────────────────────────────────────────────────────────────",
    "",
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    `Phone:   ${data.phone}`,
    `Subject: ${data.subject}`,
    "",
    "───────────────────────────────────────────────────────────────",
    "                         MESSAGE",
    "───────────────────────────────────────────────────────────────",
    "",
    data.message,
    "",
    "═══════════════════════════════════════════════════════════════",
  ];

  return lines.join("\n");
}

/**
 * Format contact message as HTML
 */
function formatHtmlContent(data: ContactRequestBody): string {
  const date = new Date();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Contact Form Message</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">${date.toLocaleString(
          data.locale === "ar" ? "ar-SA" : "en-US"
        )}</p>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="color: #1a365d; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Contact Information</h2>
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 8px 0;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${
              data.email
            }" style="color: #2563eb;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${
              data.phone
            }" style="color: #2563eb;">${data.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Subject:</td>
            <td style="padding: 8px 0;">${data.subject}</td>
          </tr>
        </table>
        
        <h2 style="color: #1a365d; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Message</h2>
        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb;">
          <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>
      
      <div style="background: #1a365d; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">This is an automated email from your website's contact form.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send contact form email
 */
async function sendContactEmail(
  data: ContactRequestBody
): Promise<{ success: boolean; error?: string }> {
  try {
    const textContent = formatTextContent(data);
    const htmlContent = formatHtmlContent(data);

    // Always log to console for debugging
    console.log("\n📧 CONTACT FORM MESSAGE\n");
    console.log(textContent);
    console.log("\n");

    // Send via nodemailer if SMTP is configured
    if (isSmtpConfigured()) {
      const transporter = createTransporter();

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.ATHENAS_EMAIL,
        replyTo: data.email,
        subject: `Contact Form: ${data.subject}`,
        text: textContent,
        html: htmlContent,
      });

      console.log("✅ Contact email sent successfully");
    } else {
      console.log("ℹ️ Gmail not configured - email logged to console only");
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("❌ Email service error:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

/**
 * POST /api/contact - Submit a contact form message
 * Requirements: 3.9, 3.10, 3.11
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ContactResponse>> {
  try {
    const body: ContactRequestBody = await request.json();

    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (!body.email || !body.email.trim()) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!body.phone || !body.phone.trim()) {
      return NextResponse.json(
        { success: false, error: "Phone is required" },
        { status: 400 }
      );
    }

    if (!body.subject || !body.subject.trim()) {
      return NextResponse.json(
        { success: false, error: "Subject is required" },
        { status: 400 }
      );
    }

    if (!body.message || !body.message.trim()) {
      return NextResponse.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    // Send email
    const result = await sendContactEmail({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      subject: body.subject.trim(),
      message: body.message.trim(),
      locale: body.locale || "en",
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
