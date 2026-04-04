import User from "@/models/User";
import { nanoid } from "nanoid";
import mailerSender from "@/utilis/mailSender";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  
  try {
    await connectMongoDB();
    
    // Validate email
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No account found with this email address",
        },
        { status: 404 }
      );
    }

    // Generate unique token
    const token = nanoid(32);
    
    // Update user with reset token and expiry (5 minutes)
    await User.findOneAndUpdate(
      { email: email },
      { 
        resetToken: token, 
        resetTokenExpires: Date.now() + 5 * 60 * 1000 
      },
      { new: true }
    );

    // Create reset URL using environment variable or fallback
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/update-password?user=${token}`;

    // Create beautiful HTML email template
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">VRental</h1>
          <p style="color: #f3f4f6; margin: 10px 0 0 0;">Password Reset Request</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello ${user.firstName || 'User'},</h2>
          
          <p style="color: #4b5563; line-height: 1.6;">
            We received a request to reset your password for your VRental account. If you didn't make this request, you can safely ignore this email.
          </p>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>⚠️ Important:</strong> This link will expire in 5 minutes for security reasons.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Reset Your Password
            </a>
          </div>
          
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>💡 Can't click the button?</strong> Copy and paste this link into your browser:
            </p>
            <p style="margin: 10px 0 0 0; word-break: break-all; color: #3b82f6; font-size: 12px;">
              ${resetUrl}
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If you didn't request a password reset, please ignore this email or contact our support team if you have concerns.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} VRental. All rights reserved.<br>
            This is an automated email. Please do not reply.
          </p>
        </div>
      </div>
    `;

    // Send reset email
    await mailerSender({
      email: email,
      title: "🔐 Reset Your VRental Password",
      body: emailBody,
    });

    console.log(`Password reset email sent to: ${email}`);

    return NextResponse.json(
      {
        success: true,
        message: "Password reset link has been sent to your email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in password reset:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send reset email. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
