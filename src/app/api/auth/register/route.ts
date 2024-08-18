// import { connectMongoDB } from "@/utilis/dbConnect";
// import User from "@/models/User";
// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcrypt";
// import { nanoid } from "nanoid";
// import OTP from "@/models/OTP";
// import mailerSender from "@/utilis/mailSender";
// import registrationSuccess from "@/mail/templates/registrationSuccess";

// async function generatingTharID() {
//   let clientID;
//   let existingUser;
//   do {
//     clientID = nanoid(6);
//     existingUser = await User.findOne({ clientID });
//   } while (existingUser);
//   return clientID;
// }

// async function sendMail(email: string, clientID: string, firstName: string) {
//   try {
//     await mailerSender({
//       email: email,
//       title: "Registration Successful",
//       body: `${registrationSuccess(clientID, firstName)}`,
//     });
//     console.log(mailerSender);
//     NextResponse.json(
//       {
//         success: true,
//         message: "Email Sent Successful",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       message: "Error Occured While Sending Email",
//     });
//   }
// }

// export async function POST(request: NextRequest) {
//   const {
//     firstName,
//     lastName,
//     email,
//     phone,
//     password,
//     confirmPassword,
//     otp,
//     adharNo,
//     profession,
//     age,
//     bio,
//   } = await request.json();

//   try {
//     await connectMongoDB();

//     // Validation
//     // if (
//     //   !firstName ||
//     //   !lastName ||
//     //   !email ||
//     //   !password ||
//     //   !confirmPassword ||
//     //   !phone ||
//     //   !otp ||
//     //   !adharNo
//     // ) {
//     //   return NextResponse.json(
//     //     {
//     //       success: false,
//     //       message: "Please fill all details",
//     //     },
//     //     { status: 400 }
//     //   );
//     // }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "User Already Exists",
//         },
//         { status: 400 }
//       );
//     }

//     // Match password
//     // if (password !== confirmPassword) {
//     //   return NextResponse.json(
//     //     {
//     //       success: false,
//     //       message: "Passwords do not match",
//     //     },
//     //     { status: 400 }
//     //   );
//     // }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     //  tharID unique function
//     const clientID = await generatingTharID();
//     // check otp valid or not
//     const recentOtp = await OTP.findOne({ email })
//       .sort({ createdAt: -1 })
//       .limit(1);

//     console.log("recent Otp is ", recentOtp);

//     if (recentOtp.length == 0) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "OTP NOT FOUND",
//         },
//         { status: 403 }
//       );
//     } else if (otp !== recentOtp.otp) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "OTP Invalid",
//         },
//         { status: 403 }
//       );
//     }
//     // Create new user

//     const newUser = await User.create({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       phone,
//       image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}&backgroundColor=418FA9`,
//       clientID,
//       adharNo,
//       role: "USER",
//       profession: profession || "",
//       age: age || "",
//       bio: bio || "",
//     });
//     // send tharID to user Email
//     await sendMail(email, clientID, firstName);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "User Entry Created Successfully",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "An error occurred",
//       },
//       { status: 500 }
//     );
//   }
// }

import { connectMongoDB } from "@/utilis/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import OTP from "@/models/OTP";
import mailerSender from "@/utilis/mailSender";
import registrationSuccess from "@/mail/templates/registrationSuccess";

async function generatingTharID() {
  let clientID;
  let existingUser;
  do {
    clientID = nanoid(6);
    existingUser = await User.findOne({ clientID });
  } while (existingUser);
  return clientID;
}

async function sendMail(email: string, clientID: string, firstName: string) {
  try {
    await mailerSender({
      email,
      title: "Registration Successful",
      body: registrationSuccess(clientID, firstName),
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error Occurred While Sending Email" };
  }
}

export async function POST(request: NextRequest) {
  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    otp,
    adharNo,
    profession,
    age,
    bio,
  } = await request.json();

  try {
    await connectMongoDB();

    // Input validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !otp ||
      !adharNo
    ) {
      return NextResponse.json(
        { success: false, message: "Please fill all details" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User Already Exists" },
        { status: 400 }
      );
    }

    // Match password
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique client ID
    const clientID = await generatingTharID();

    // Check OTP validity
    const recentOtp = await OTP.findOne({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (!recentOtp || otp !== recentOtp.otp) {
      return NextResponse.json(
        { success: false, message: "Invalid or Expired OTP" },
        { status: 403 }
      );
    }

    // Create new user
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}&backgroundColor=418FA9`,
      clientID,
      adharNo,
      role: "USER",
      profession: profession || "",
      age: age || "",
      bio: bio || "",
    });

    // Send registration success email
    const mailResult = await sendMail(email, clientID, firstName);
    if (!mailResult.success) {
      return NextResponse.json(
        { success: false, message: mailResult.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "User Entry Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    );
  }
}
