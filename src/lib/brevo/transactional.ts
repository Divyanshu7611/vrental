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
 * Uses the same endpoint as Brevo docs: POST /v3/smtp/email
 * Requires a Brevo **API v3 key** (Dashboard → SMTP & API → API keys).
 */
export async function sendTransactionalEmail(params: SendTransactionalEmailParams) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set");
  }

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

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to,
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
    }),
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw new Error(
      `Brevo REST send failed (${res.status} ${res.statusText})${bodyText ? `: ${bodyText}` : ""}`
    );
  }

  // Brevo returns JSON like { messageId: "<...>" }
  return await res.json().catch(() => ({}));
}
