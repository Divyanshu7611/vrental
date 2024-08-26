import User, { IUser } from "@/models/User";
import Apartment, { IApartment } from "@/models/Apartment";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import mailerSender from "@/utilis/mailSender";
import apartmentRegistrationOwnerTemplate from "@/mail/templates/apartmentOwnerReg";
import apartmentRegistrationTemplate from "@/mail/templates/apartmentReg";

async function sendMailOwner(
  email: string,
  apartmentName: string,
  location: string,
  userName: string,
  userPhone: string
) {
  try {
    await mailerSender({
      email: email,
      title: "User Query",
      body: apartmentRegistrationOwnerTemplate(
        apartmentName,
        location,
        userName,
        userPhone
      ),
    });
    console.log("Email sent to owner successfully");
  } catch (error) {
    console.error("Error occurred while sending email to owner:", error);
    throw new Error("Error occurred while sending email to owner");
  }
}

export async function POST(req: NextRequest) {
  const { UserID, ApartmentID, ownerEmail } = await req.json();

  try {
    await connectMongoDB();

    const user = await User.findById(UserID).exec();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const apartment = await Apartment.findById(ApartmentID)
      .populate("ownerID")
      .exec();
    if (!apartment) {
      return NextResponse.json(
        { success: false, message: "Apartment not found" },
        { status: 404 }
      );
    }

    // Send emails in parallel
    await Promise.all([
      sendMailOwner(
        ownerEmail,
        apartment.apartmentName,
        apartment.location,
        `${user.firstName} ${user.lastName}`,
        user.phone.toString()
      ),
    ]);

    return NextResponse.json(
      { success: true, message: "Email Sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sending Email to Owner:", error);
    return NextResponse.json(
      { success: false, message: "Error Sending Email" },
      { status: 500 }
    );
  }
}
