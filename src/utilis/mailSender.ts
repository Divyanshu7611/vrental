import nodemailer from "nodemailer";
import { hasBrevoRestApi, sendTransactionalEmail } from "@/lib/brevo";

interface EmailOptions {
  email: string;
  title: string;
  body?: string;
  text?: string;
}

function escapeTextForHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const mailerSender = async ({ email, title, body, text }: EmailOptions) => {
  try {
    const htmlContent =
      body ??
      (text != null && text !== ""
        ? `<p>${escapeTextForHtml(text)}</p>`
        : undefined);

    if (!htmlContent) {
      throw new Error("Email must include html body or plain text");
    }

    // 1) Brevo REST (API v3 key from dashboard — not the xsmtpsib SMTP password)
    if (hasBrevoRestApi()) {
      const res = await sendTransactionalEmail({
        to: email,
        subject: title,
        htmlContent,
        textContent: text,
      });
      console.log("Brevo transactional sent:", res);
      return;
    }

    const brevoSmtpUser = process.env.BREVO_SMTP_USER?.trim();
    const brevoSmtpKey = process.env.BREVO_SMTP_KEY?.trim();

    // 2) Brevo SMTP relay (login + xsmtpsib-… key)
    if (brevoSmtpUser && brevoSmtpKey) {
      const host = process.env.BREVO_SMTP_HOST?.trim() || "smtp-relay.brevo.com";
      const port = parseInt(process.env.BREVO_SMTP_PORT || "587", 10);
      const fromEmail =
        process.env.BREVO_SENDER_EMAIL?.trim() || brevoSmtpUser;

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user: brevoSmtpUser,
          pass: brevoSmtpKey,
        },
      });

      await transporter.verify();

      const info = await transporter.sendMail({
        from: `"VRENTAL" <${fromEmail}>`,
        to: email,
        subject: title,
        html: htmlContent,
        text,
      });

      console.log("Message sent (Brevo SMTP): %s", info.messageId);
      return;
    }

    // 3) Legacy SMTP (e.g. GoDaddy)
    const { HOST_NAME, EMAIL_PORT, MAIL_USER, MAIL_PASSWORD } = process.env;

    if (!HOST_NAME || !EMAIL_PORT || !MAIL_USER || !MAIL_PASSWORD) {
      throw new Error(
        "Missing email config: set BREVO_API_KEY, or BREVO_SMTP_USER + BREVO_SMTP_KEY, or HOST_NAME / EMAIL_PORT / MAIL_USER / MAIL_PASSWORD"
      );
    }

    const transporter = nodemailer.createTransport({
      host: HOST_NAME || "smtpout.secureserver.net",
      port: parseInt(EMAIL_PORT, 10),
      secure: false,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"VRENTAL" <${MAIL_USER}>`,
      to: email,
      subject: title,
      html: htmlContent,
      text,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error In Sending Email", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    throw new Error("Failed To Send Email");
  }
};

export default mailerSender;
