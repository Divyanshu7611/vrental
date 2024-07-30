import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  title: string;
  body?: string;
  text?: string;
}

const mailerSender = async ({ email, title, body, text }: EmailOptions) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.HOST_NAME,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Mail Body
    let info = await transporter.sendMail({
      from: "VRENTAL || Choose Right Apartment Now",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
      text: `${text}`,
    });

    console.log(info);
  } catch (error) {
    console.error("Error In Sending Email", error);
    throw new Error("Failed To Send Email");
  }
};

export default mailerSender;
