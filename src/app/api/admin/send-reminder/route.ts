import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import Apartment from "@/models/Apartment";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/utilis/mailSender";

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();

    // Verify admin authentication
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "Divyanshu", {
        algorithms: ["HS256"],
      });
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid token", success: false },
        { status: 401 }
      );
    }

    const admin = await User.findById(decoded.id);
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Access denied. Admin only.", success: false },
        { status: 403 }
      );
    }

    const { apartmentId, ownerEmail } = await req.json();

    if (!apartmentId || !ownerEmail) {
      return NextResponse.json(
        { message: "Apartment ID and owner email are required", success: false },
        { status: 400 }
      );
    }

    // Get apartment details
    const apartment = await Apartment.findById(apartmentId).populate("ownerID");

    if (!apartment) {
      return NextResponse.json(
        { message: "Apartment not found", success: false },
        { status: 404 }
      );
    }

    const expiryDate = new Date(apartment.memberShipExpiry);
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    // Send reminder email
    const emailSubject = "⚠️ Your VRental Membership is Expiring Soon!";
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">VRental</h1>
          <p style="color: #f3f4f6; margin: 10px 0 0 0;">Membership Expiry Reminder</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">Hello ${apartment.ownerID.firstName},</h2>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #92400e; font-weight: bold;">⚠️ Your property listing is expiring soon!</p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Your property <strong>${apartment.apartmentName}</strong> membership will expire in <strong style="color: #dc2626;">${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}</strong>.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Property Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Property Name:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: bold;">${apartment.apartmentName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Location:</td>
                <td style="padding: 8px 0; color: #1f2937;">${apartment.location}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Expiry Date:</td>
                <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${expiryDate.toLocaleDateString()}</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            To continue showcasing your property and receiving inquiries, please renew your membership before it expires.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/profile" 
               style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              Renew Membership Now
            </a>
          </div>
          
          <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              <strong>💡 Pro Tip:</strong> Renew early to avoid any interruption in your property visibility!
            </p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If you have any questions, feel free to contact our support team.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} VRental. All rights reserved.<br>
            This is an automated reminder email.
          </p>
        </div>
      </div>
    `;

    await sendEmail(ownerEmail, emailSubject, emailBody);

    return NextResponse.json(
      {
        message: "Reminder email sent successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending reminder:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
