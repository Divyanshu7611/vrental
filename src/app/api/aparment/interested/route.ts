// import User, { IUser } from "@/models/User";
// import Apartment, { IApartment } from "@/models/Apartment";
// import { NextRequest, NextResponse } from "next/server";
// import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";
// import mailerSender from "@/utilis/mailSender";
// import apartmentRegistrationOwnerTemplate from "@/mail/templates/apartmentOwnerReg";
// import apartmentRegistrationTemplate from "@/mail/templates/apartmentReg";

// async function sendMailUser(
//   email: string,
//   apartmentName: string,
//   name: string,
//   location: string
// ) {
//   try {
//     await mailerSender({
//       email: email,
//       title: "Apartment Registration Successful",
//       body: `${apartmentRegistrationTemplate(apartmentName, location, name)}`,
//     });
//     console.log("Email sent to user successfully");
//   } catch (error) {
//     console.error("Error occurred while sending email to user:", error);
//     throw new Error("Error occurred while sending email to user");
//   }
// }

// // send mail to owner
// async function sendMailOwner(
//   email: string,
//   apartmentName: string,
//   location: string,
//   userName: string,
//   userPhone: string
// ) {
//   try {
//     await mailerSender({
//       email: email,
//       title: "User Query",
//       body: `${apartmentRegistrationOwnerTemplate(
//         apartmentName,
//         location,
//         userName,
//         userPhone
//       )}`,
//     });
//     console.log("Email sent to owner successfully");
//   } catch (error) {
//     console.error("Error occurred while sending email to owner:", error);
//     throw new Error("Error occurred while sending email to owner");
//   }
// }

// export async function POST(req: NextRequest) {
//   const { UserID, ApartmentID, ownerEmail } = await req.json();
//   try {
//     await ConnectMongoDB();

//     const user = await User.findById(UserID);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     const apartment = await Apartment.findById(ApartmentID).populate("ownerID");
//     if (!apartment) {
//       return NextResponse.json(
//         { success: false, message: "Apartment not found" },
//         { status: 404 }
//       );
//     }

//     await User.findByIdAndUpdate(
//       UserID,
//       { $addToSet: { participated: ApartmentID } },
//       { new: true }
//     );
//     await Apartment.findByIdAndUpdate(
//       ApartmentID,
//       { $addToSet: { participants: UserID } },
//       { new: true }
//     );

//     await sendMailUser(
//       user.email,
//       apartment.apartmentName,
//       `${user.firstName} ${user.lastName}`,
//       apartment.location
//     );
//     await sendMailOwner(
//       ownerEmail,
//       apartment.apartmentName,
//       apartment.location,
//       `${user.firstName} ${user.lastName}`,
//       user.phone.toString()
//     );

//     await DisconnectMongoDB();

//     return NextResponse.json(
//       { success: true, message: "User added to apartment successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error adding user to apartment:", error);
//     await DisconnectMongoDB();
//     return NextResponse.json(
//       { success: false, message: "Error adding user to apartment" },
//       { status: 500 }
//     );
//   }
// }

import User, { IUser } from "@/models/User";
import Apartment, { IApartment } from "@/models/Apartment";
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/utilis/dbConnect";
import mailerSender from "@/utilis/mailSender";
import apartmentRegistrationOwnerTemplate from "@/mail/templates/apartmentOwnerReg";
import apartmentRegistrationTemplate from "@/mail/templates/apartmentReg";

async function sendMailUser(
  email: string,
  apartmentName: string,
  name: string,
  location: string
) {
  try {
    await mailerSender({
      email: email,
      title: "Apartment Registration Successful",
      body: apartmentRegistrationTemplate(apartmentName, location, name),
    });
    console.log("Email sent to user successfully");
  } catch (error) {
    console.error("Error occurred while sending email to user:", error);
    throw new Error("Error occurred while sending email to user");
  }
}

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

    // Perform updates in parallel
    await Promise.all([
      User.findByIdAndUpdate(
        UserID,
        { $addToSet: { participated: ApartmentID } },
        { new: true }
      ).exec(),
      Apartment.findByIdAndUpdate(
        ApartmentID,
        { $addToSet: { participants: UserID } },
        { new: true }
      ).exec(),
    ]);

    // Send emails in parallel
    await Promise.all([
      sendMailUser(
        user.email,
        apartment.apartmentName,
        `${user.firstName} ${user.lastName}`,
        apartment.location
      ),
      sendMailOwner(
        ownerEmail,
        apartment.apartmentName,
        apartment.location,
        `${user.firstName} ${user.lastName}`,
        user.phone.toString()
      ),
    ]);

    return NextResponse.json(
      { success: true, message: "User added to apartment successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding user to apartment:", error);
    return NextResponse.json(
      { success: false, message: "Error adding user to apartment" },
      { status: 500 }
    );
  }
}
