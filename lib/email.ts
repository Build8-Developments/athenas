/**
 * Email Service for Quote Requests
 *
 * Uses nodemailer to send quote request emails.
 * Falls back to console logging if SMTP is not configured.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
 */

import nodemailer from "nodemailer";

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
}

export interface ProductInfo {
  id: string;
  name: string;
  category: string;
}

export interface QuoteRequestEmailData {
  customerInfo: ContactFormData;
  products: ProductInfo[];
  locale: string;
  timestamp?: string;
}

export interface EmailResult {
  success: boolean;
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
 * Formats the email content as plain text
 */
function formatTextContent(data: QuoteRequestEmailData): string {
  const { customerInfo, products, locale, timestamp } = data;
  const date = timestamp ? new Date(timestamp) : new Date();

  const lines: string[] = [
    "═══════════════════════════════════════════════════════════════",
    "                    QUOTE REQUEST RECEIVED",
    "═══════════════════════════════════════════════════════════════",
    "",
    `Date: ${date.toLocaleString(locale === "ar" ? "ar-SA" : "en-US")}`,
    `Locale: ${locale}`,
    "",
    "───────────────────────────────────────────────────────────────",
    "                    CUSTOMER INFORMATION",
    "───────────────────────────────────────────────────────────────",
    "",
    `Name:    ${customerInfo.fullName}`,
    `Email:   ${customerInfo.email}`,
    `Phone:   ${customerInfo.phone}`,
  ];

  if (customerInfo.company) {
    lines.push(`Company: ${customerInfo.company}`);
  }

  if (customerInfo.message) {
    lines.push("");
    lines.push("Message:");
    lines.push(`  ${customerInfo.message}`);
  }

  lines.push("");
  lines.push("───────────────────────────────────────────────────────────────");
  lines.push("                    REQUESTED PRODUCTS");
  lines.push("───────────────────────────────────────────────────────────────");
  lines.push("");

  products.forEach((product, index) => {
    lines.push(`${index + 1}. ${product.name}`);
    lines.push(`   Category: ${product.category}`);
    lines.push(`   ID: ${product.id}`);
    lines.push("");
  });

  lines.push(`Total Items: ${products.length}`);
  lines.push("");
  lines.push("═══════════════════════════════════════════════════════════════");

  return lines.join("\n");
}

/**
 * Formats the email content as HTML
 */
function formatHtmlContent(data: QuoteRequestEmailData): string {
  const { customerInfo, products, locale, timestamp } = data;
  const date = timestamp ? new Date(timestamp) : new Date();

  const productRows = products
    .map(
      (product, index) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${
          index + 1
        }</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${
          product.name
        }</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${
          product.category
        }</td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Quote Request Received</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">${date.toLocaleString(
          locale === "ar" ? "ar-SA" : "en-US"
        )}</p>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <h2 style="color: #1a365d; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Customer Information</h2>
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
            <td style="padding: 8px 0;">${customerInfo.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${
              customerInfo.email
            }" style="color: #2563eb;">${customerInfo.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
            <td style="padding: 8px 0;"><a href="tel:${
              customerInfo.phone
            }" style="color: #2563eb;">${customerInfo.phone}</a></td>
          </tr>
          ${
            customerInfo.company
              ? `
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Company:</td>
            <td style="padding: 8px 0;">${customerInfo.company}</td>
          </tr>
          `
              : ""
          }
        </table>
        
        ${
          customerInfo.message
            ? `
        <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #e5e7eb;">
          <strong>Message:</strong>
          <p style="margin: 10px 0 0; white-space: pre-wrap;">${customerInfo.message}</p>
        </div>
        `
            : ""
        }
        
        <h2 style="color: #1a365d; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Requested Products (${
          products.length
        })</h2>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #1a365d; color: white;">
              <th style="padding: 12px; text-align: left; width: 50px;">#</th>
              <th style="padding: 12px; text-align: left;">Product Name</th>
              <th style="padding: 12px; text-align: left;">Category</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>
      </div>
      
      <div style="background: #1a365d; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">This is an automated email from your website's quote request system.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Formats the customer confirmation email as HTML
 */
function formatCustomerHtmlContent(data: QuoteRequestEmailData): string {
  const { customerInfo, products, locale, timestamp } = data;
  const date = timestamp ? new Date(timestamp) : new Date();

  const productRows = products
    .map(
      (product, index) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${
          index + 1
        }</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${
          product.name
        }</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${
          product.category
        }</td>
      </tr>
    `
    )
    .join("");

  const isArabic = locale === "ar";

  return `
    <!DOCTYPE html>
    <html dir="${isArabic ? "rtl" : "ltr"}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">${
          isArabic ? "شكراً لطلبك!" : "Thank You for Your Request!"
        }</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">${date.toLocaleString(
          isArabic ? "ar-SA" : "en-US"
        )}</p>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="font-size: 16px; margin-top: 0;">
          ${
            isArabic
              ? `مرحباً ${customerInfo.fullName}،`
              : `Dear ${customerInfo.fullName},`
          }
        </p>
        <p>
          ${
            isArabic
              ? "شكراً لتقديم طلب عرض السعر. لقد استلمنا طلبك وسيتواصل معك فريقنا قريباً."
              : "Thank you for submitting your quote request. We have received your inquiry and our team will contact you shortly."
          }
        </p>
        
        <h2 style="color: #1a365d; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">${
          isArabic ? "ملخص طلبك" : "Your Request Summary"
        }</h2>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #1a365d; color: white;">
              <th style="padding: 12px; text-align: ${
                isArabic ? "right" : "left"
              }; width: 50px;">#</th>
              <th style="padding: 12px; text-align: ${
                isArabic ? "right" : "left"
              };">${isArabic ? "اسم المنتج" : "Product Name"}</th>
              <th style="padding: 12px; text-align: ${
                isArabic ? "right" : "left"
              };">${isArabic ? "الفئة" : "Category"}</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>
        
        <p style="margin-top: 20px;">
          <strong>${isArabic ? "إجمالي المنتجات:" : "Total Items:"}</strong> ${
    products.length
  }
        </p>
        
        <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #2563eb;">
          <p style="margin: 0; font-size: 14px;">
            ${
              isArabic
                ? "إذا كان لديك أي أسئلة، لا تتردد في الرد على هذا البريد الإلكتروني."
                : "If you have any questions, feel free to reply to this email."
            }
          </p>
        </div>
      </div>
      
      <div style="background: #1a365d; color: white; padding: 20px; border-radius: 0 0 10px 10px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">${
          isArabic ? "أثيناس - شريكك الموثوق" : "Athenas - Your Trusted Partner"
        }</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends a quote request email
 *
 * Uses nodemailer when SMTP is configured, otherwise logs to console.
 *
 * @param data - The quote request data including customer info and products
 * @returns EmailResult indicating success or failure
 */
export async function sendQuoteRequestEmail(
  data: QuoteRequestEmailData
): Promise<EmailResult> {
  try {
    // Validate required fields
    if (
      !data.customerInfo.fullName ||
      !data.customerInfo.email ||
      !data.customerInfo.phone
    ) {
      return {
        success: false,
        error: "Missing required customer information",
      };
    }

    if (!data.products || data.products.length === 0) {
      return {
        success: false,
        error: "No products in quote request",
      };
    }

    const emailData = {
      ...data,
      timestamp: data.timestamp || new Date().toISOString(),
    };

    // Format email content
    const textContent = formatTextContent(emailData);
    const htmlContent = formatHtmlContent(emailData);

    // Always log to console for debugging
    console.log("\n📧 QUOTE REQUEST EMAIL\n");
    console.log(textContent);
    console.log("\n");

    // Send via nodemailer if SMTP is configured
    if (isSmtpConfigured()) {
      const transporter = createTransporter();

      // Send to Athenas (business)
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: process.env.ATHENAS_EMAIL,
        replyTo: data.customerInfo.email,
        subject: `Quote Request from ${data.customerInfo.fullName}`,
        text: textContent,
        html: htmlContent,
      });

      // Send confirmation to customer
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: data.customerInfo.email,
        subject: `Your Quote Request - Athenas`,
        text: textContent,
        html: formatCustomerHtmlContent(emailData),
      });

      console.log("✅ Emails sent successfully to Athenas and customer");
    } else {
      console.log("ℹ️ Gmail not configured - email logged to console only");
      console.log(
        "   To enable email sending, set these environment variables:"
      );
      console.log("   GMAIL_USER, GMAIL_APP_PASSWORD, ATHENAS_EMAIL");
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("❌ Email service error:", errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}
