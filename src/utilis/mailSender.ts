import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  title: string;
  body?: string;
  text?: string;
}

const mailerSender = async ({ email, title, body, text }: EmailOptions) => {
  try {
    // Ensure required environment variables are present
    const { HOST_NAME, EMAIL_PORT, MAIL_USER, MAIL_PASSWORD, NODE_ENV } =
      process.env;

    if (!HOST_NAME || !EMAIL_PORT || !MAIL_USER || !MAIL_PASSWORD) {
      throw new Error("Missing required environment variables");
    }

    let transporter = nodemailer.createTransport({
      host: HOST_NAME || "smtpout.secureserver.net",
      port: parseInt(EMAIL_PORT),
      secure: false, // Use TLS
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
      // connectionTimeout: 10000, // 60 secon
    });

    // Verify connection configuration
    await transporter.verify();

    // Mail Body
    let info = await transporter.sendMail({
      from: `"VRENTAL" <${MAIL_USER}>`, // Use the full email address
      to: email,
      subject: title,
      html: body,
      text: text,
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
