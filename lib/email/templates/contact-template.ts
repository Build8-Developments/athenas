
interface ContactEmailData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  locale: string;
  country?: string;
  city?: string;
  ip?: string;
  userAgent?: string;
}

/**
 * Format contact message as plain text
 */
export function formatContactText(data: ContactEmailData): string {
  const date = new Date();
  const location = data.country ? `${data.city ? data.city + ', ' : ''}${data.country}` : 'Unknown';

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
    "                    USER METADATA",
    "───────────────────────────────────────────────────────────────",
    "",
    `Location: ${location}`,
    `IP:       ${data.ip || 'Unknown'}`,
    `Agent:    ${data.userAgent || 'Unknown'}`,
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
export function formatContactHtml(data: ContactEmailData): string {
  const date = new Date();
  const location = data.country ? `${data.city ? data.city + ', ' : ''}${data.country}` : 'Unknown';

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
        
        <!-- Contact Info -->
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
        
        <!-- Metadata -->
        <h2 style="color: #1a365d; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">User Details</h2>
        <table style="width: 100%; margin-bottom: 20px; font-size: 14px; color: #666;">
          <tr>
            <td style="padding: 4px 0; width: 120px;">Location:</td>
            <td style="padding: 4px 0;"><strong>${location}</strong></td>
          </tr>
           <tr>
            <td style="padding: 4px 0;">IP Address:</td>
            <td style="padding: 4px 0;"><code>${data.ip || 'Unknown'}</code></td>
          </tr>
           <tr>
            <td style="padding: 4px 0;">User Agent:</td>
            <td style="padding: 4px 0; font-size: 12px;">${data.userAgent || 'Unknown'}</td>
          </tr>
        </table>

        <!-- Message -->
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
