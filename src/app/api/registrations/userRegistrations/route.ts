// import Registration from "@/models/registration";
// import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";
// import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/User";
// import Event from "@/models/Event";

// export async function POST(request: NextRequest) {
//   const { captainId, eventId, teamName, users } = await request.json();

//   try {
//     await ConnectMongoDB();

//     // Validation
//     if (!captainId || !eventId || !teamName) {
//       await DisconnectMongoDB();
//       return NextResponse.json(
//         {
//           success: false,
//           message: "All Fields are Mandatory",
//         },
//         { status: 401 }
//       );
//     }
//     //    check captain id exist or not
//     const existUser = await User.findById(captainId);
//     if (!existUser) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "captionId is not exist",
//         },
//         { status: 403 }
//       );
//     }

//     // check event id exiust
//     const existEvent = await Event.findById(eventId);
//     if (!existEvent) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "eventId is not exist",
//         },
//         { status: 403 }
//       );
//     }
//     // Create Entry
//     const newRegistration = new Registration({
//       captainId,
//       eventId,
//       teamName,
//       users,
//     });

//     await newRegistration.save();

//     // Push event into user's participated events
//     await User.updateMany(
//       { _id: { $in: [captainId, ...users] } },
//       { $addToSet: { participated: eventId } }
//     );

//     // Push users into event's participants
//     await Event.findByIdAndUpdate(
//       { _id: eventId },
//       { $addToSet: { participants: { $each: [captainId, ...users] } } },
//       { new: true }
//     );

//     await DisconnectMongoDB();
//     return NextResponse.json(
//       {
//         success: true,
//         message: "User Registered Into Event Successfully",
//         data: newRegistration,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     await DisconnectMongoDB();
//     console.error("Error registering user:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Internal Server Error",
//       },
//       { status: 500 }
//     );
//   } finally {
//     await DisconnectMongoDB();
//   }
// }

import Registration from "@/models/registration";
import { ConnectMongoDB, DisconnectMongoDB } from "@/utilis/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import Event from "@/models/Event";

export async function POST(request: NextRequest) {
  const { captainId, eventId, teamName, users, teamSize } =
    await request.json();

  try {
    await ConnectMongoDB();

    // Validation
    if (!captainId || !eventId || !teamName) {
      await DisconnectMongoDB();
      return NextResponse.json(
        {
          success: false,
          message: "All Fields are Mandatory",
        },
        { status: 401 }
      );
    }

    // Check if captain id exists
    const existUser = await User.findById(captainId);
    if (!existUser) {
      await DisconnectMongoDB();
      return NextResponse.json(
        {
          success: false,
          message: "captainId does not exist",
        },
        { status: 403 }
      );
    }

    // Check if event id exists
    const existEvent = await Event.findById(eventId);
    if (!existEvent) {
      await DisconnectMongoDB();
      return NextResponse.json(
        {
          success: false,
          message: "eventId does not exist",
        },
        { status: 403 }
      );
    }

    // Convert users' tharID to MongoDB _id
    const userObjects = await User.find({ tharID: { $in: users } }, "_id");
    const userIds = userObjects.map((user) => user._id);

    // Check if any user IDs were found
    if (userIds.length !== users.length) {
      await DisconnectMongoDB();
      return NextResponse.json(
        {
          success: false,
          message: "Some user IDs are invalid",
        },
        { status: 404 }
      );
    }
    // user array size
    if (users.length > teamSize) {
      await DisconnectMongoDB();
      return NextResponse.json(
        {
          success: false,
          message: "Team Size Limit Exceed",
        },
        { status: 404 }
      );
    }

    // Create Entry
    const newRegistration = new Registration({
      captainId,
      eventId,
      teamName,
      users: userIds,
    });

    await newRegistration.save();

    // Push event into users' participated events
    await User.updateMany(
      { _id: { $in: [captainId, ...userIds] } },
      { $addToSet: { participated: eventId } },
      { new: true }
    );

    // Push users into event's participants
    await Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { participants: { $each: [captainId, ...userIds] } } },
      { new: true }
    );

    await DisconnectMongoDB();
    return NextResponse.json(
      {
        success: true,
        message: "User Registered Into Event Successfully",
        data: newRegistration,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    await DisconnectMongoDB();
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  } finally {
    await DisconnectMongoDB();
  }
}
