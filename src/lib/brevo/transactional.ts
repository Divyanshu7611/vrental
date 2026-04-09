import { getBrevoClient } from "./client";

export interface SendTransactionalEmailParams {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  /** Defaults from BREVO_SENDER_EMAIL or BREVO_SMTP_USER */
  senderEmail?: string;
  /** Defaults from BREVO_SENDER_NAME or "VRENTAL" */
  senderName?: string;
}

/**
 * Send a single transactional email via Brevo REST API.
 * Requires a Brevo **API v3 key** (Dashboard → SMTP & API → API keys).
 */
export async function sendTransactionalEmail(params: SendTransactionalEmailParams) {
  const client = getBrevoClient();
  const senderEmail =
    params.senderEmail?.trim() ||
    process.env.BREVO_SENDER_EMAIL?.trim() ||
    process.env.BREVO_SMTP_USER?.trim();
  const senderName =
    params.senderName?.trim() || process.env.BREVO_SENDER_NAME?.trim() || "VRENTAL";

  if (!senderEmail) {
    throw new Error("Set BREVO_SENDER_EMAIL or BREVO_SMTP_USER for the sender address");
  }

  const to = params.toName
    ? [{ email: params.to, name: params.toName }]
    : [{ email: params.to }];

  const response = await client.transactionalEmails.sendTransacEmail({
    sender: { email: senderEmail, name: senderName },
    to,
    subject: params.subject,
    htmlContent: params.htmlContent,
    textContent: params.textContent,
  });

  return response;
}
