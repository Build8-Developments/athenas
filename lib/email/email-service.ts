import nodemailer from "nodemailer";

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
  from?: string; // Optional override
}

export interface EmailResult {
  success: boolean;
  error?: string;
  messageId?: string;
}

type EmailingMode = 'app_password' | 'smtp';

/**
 * Factory to create a transporter based on environment configuration
 */
function createTransporter() {
  const mode = (process.env.EMAILING_MODE || 'app_password') as EmailingMode;

  if (mode === 'smtp') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } else {
    // Default to app_password (Gmail style)
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
}

/**
 * Send an email using the configured transport strategy
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    const transporter = createTransporter();
    const from = options.from || process.env.ATHENAS_EMAIL || process.env.GMAIL_USER;

    if (!from) {
      throw new Error("No sender address configured (ATHENAS_EMAIL or GMAIL_USER)");
    }

    const info = await transporter.sendMail({
      from,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log(`📧 Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown email error";
    console.error("❌ Email sending failed:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
