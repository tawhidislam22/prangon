/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import ejs from "ejs";
import status from "http-status";
import nodemailer from "nodemailer";
import path from "path";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: Number(envVars.EMAIL_SENDER.SMTP_PORT) === 465,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === "production",
  },
});

export interface SendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  previewText?: string;
  plainText?: string;
  replyTo?: string;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

/**
 * Converts rich HTML email content into clean, readable Plain Text.
 * Crucial for spam engines (eliminates MIME_HTML_ONLY penalty and provides
 * a 1:1 text alternative for text-only clients and anti-spam heuristics).
 */
export function htmlToPlainText(html: string): string {
  if (!html) return "";

  let text = html;

  // Remove zero-width spaces / preheader hacks
  text = text.replace(/<div style="display:none;[\s\S]*?<\/div>/gi, "");
  text = text.replace(/&#847;|&zwnj;|&nbsp;|&#8199;|&shy;/gi, " ");

  // Convert links: <a href="url">Text</a> -> Text (url)
  text = text.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "$2 ($1)");

  // Convert headers & paragraphs to newlines
  text = text.replace(/<\/(h[1-6]|p|div|tr|table|ul|ol|li)>/gi, "\n");
  text = text.replace(/<br\s*[\/]?>/gi, "\n");

  // Strip all remaining HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&bull;/g, "•")
    .replace(/&copy;/g, "©")
    .replace(/&trade;/g, "™");

  // Normalize spaces and blank lines
  text = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line, index, arr) => !(line === "" && arr[index - 1] === ""))
    .join("\n");

  return text.trim();
}

/**
 * Renders an email template with provided data and returns both HTML and Plain Text.
 */
export async function renderEmail(
  templateName: string,
  templateData: Record<string, any>
): Promise<{ html: string; text: string }> {
  const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);
  
  // Default values passed to every template for branding and anti-spam footer
  const mergedData = {
    subject: templateData.subject || "Verification Code",
    companyName: "Prangon",
    companyAddress: "Prangon Technologies Inc. • 100 Pine Street, Suite 1250 • San Francisco, CA 94111",
    frontendUrl: envVars.FRONTEND_URL || "http://localhost:3000",
    supportEmail: envVars.EMAIL_SENDER.SMTP_FROM,
    currentYear: new Date().getFullYear(),
    previewText: templateData.previewText || "",
    ...templateData,
  };

  const html = await ejs.renderFile(templatePath, mergedData);
  const text = templateData.plainText || htmlToPlainText(html);

  return { html, text };
}

/**
 * Sends a transactional email with high deliverability headers,
 * dual-part MIME (HTML + Plain Text), and SPF/DKIM friendly formatting.
 */
export const sendEmail = async ({
  subject,
  templateData,
  templateName,
  to,
  previewText,
  plainText,
  replyTo,
  attachments,
}: SendEmailOptions): Promise<{ messageId: string }> => {
  try {
    const { html, text } = await renderEmail(templateName, {
      subject,
      ...templateData,
      previewText: previewText || templateData.previewText,
      plainText,
    });

    const senderEmail = envVars.EMAIL_SENDER.SMTP_FROM;
    const senderDomain = senderEmail.split("@")[1] || "prangon.app";
    const uniqueId = `${Date.now()}.${crypto.randomBytes(8).toString("hex")}`;
    const messageId = `<prangon.${uniqueId}@${senderDomain}>`;

    const info = await transporter.sendMail({
      from: `"Prangon" <${senderEmail}>`,
      to,
      replyTo: replyTo || `"Prangon Support" <${senderEmail}>`,
      subject,
      html,
      text, // Vital anti-spam multipart alternative!
      messageId,
      headers: {
        "X-Mailer": "Prangon Mail Delivery Engine v2.0",
        "X-Entity-Ref-ID": `prangon-tx-${uniqueId}`,
        "Auto-Submitted": "auto-generated",
        "X-Auto-Response-Suppress": "All",
        "List-Unsubscribe": `<mailto:${senderEmail}?subject=unsubscribe>, <${envVars.FRONTEND_URL}/unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        Precedence: "bulk",
      },
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`[Email Sent] To: ${to} | Subject: "${subject}" | MessageID: ${info.messageId}`);
    return { messageId: info.messageId };
  } catch (error: any) {
    console.error(`[Email Error] Failed to send to ${to}:`, error.message);
    throw new AppError(status.INTERNAL_SERVER_ERROR, `Failed to send email: ${error.message}`);
  }
};