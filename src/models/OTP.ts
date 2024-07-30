import mongoose, { Schema, Document } from "mongoose";
import mailerSender from "@/utilis/mailSender";
import otpTemplate from "@/mail/templates/mailVerication";

export interface IOTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const OTPSchema: Schema = new Schema<IOTP>({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now(), expires: 5 * 60 },
});

OTPSchema.pre<IOTP>("save", async function (next) {
  console.log("New Document Saved to DateBase");
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

async function sendVerificationEmail(email: string, otp: string) {
  try {
    const mailResponse = await mailerSender({
      email: email,
      title: "OTP Verification",
      body: `${otpTemplate(otp)}`,
    });
    console.log("Email Sent Successfully: ");
  } catch (error) {
    console.log("Error occured while Sending Mail", error);
    throw error;
  }
}

const OTP = mongoose.models.OTP || mongoose.model<IOTP>("OTP", OTPSchema);
export default OTP;
