import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // This endpoint helps debug environment variable loading
  const envVars = {
    // Standard names
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID 
      ? `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.substring(0, 10)}... (length: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID.length})`
      : "NOT SET",
    NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL
      ? `${process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL.substring(0, 20)}... (length: ${process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL.length})`
      : "NOT SET",
    NEXT_PUBLIC_FIREBASE_PRIVATE_KEY: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY
      ? `Set (length: ${process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.length}, starts with: ${process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.substring(0, 30)}...)`
      : "NOT SET",
    // Alternative names
    NEXT_FIREBASE_PROJECT_ID: process.env.NEXT_FIREBASE_PROJECT_ID 
      ? `${process.env.NEXT_FIREBASE_PROJECT_ID.substring(0, 10)}... (length: ${process.env.NEXT_FIREBASE_PROJECT_ID.length})`
      : "NOT SET",
    NEXT_FIREBASE_CLIENT_EMAIL: process.env.NEXT_FIREBASE_CLIENT_EMAIL
      ? `${process.env.NEXT_FIREBASE_CLIENT_EMAIL.substring(0, 20)}... (length: ${process.env.NEXT_FIREBASE_CLIENT_EMAIL.length})`
      : "NOT SET",
    NEXT_FIREBASE_PRIVATE_KEY: process.env.NEXT_FIREBASE_PRIVATE_KEY
      ? `Set (length: ${process.env.NEXT_FIREBASE_PRIVATE_KEY.length}, starts with: ${process.env.NEXT_FIREBASE_PRIVATE_KEY.substring(0, 30)}...)`
      : "NOT SET",
    // Your current naming convention
    NEXT_FIREBASE_PUBLIC_PROJECT_ID: process.env.NEXT_FIREBASE_PUBLIC_PROJECT_ID 
      ? `${process.env.NEXT_FIREBASE_PUBLIC_PROJECT_ID.substring(0, 10)}... (length: ${process.env.NEXT_FIREBASE_PUBLIC_PROJECT_ID.length})`
      : "NOT SET",
    NEXT_FIREBASE_PUBLIC_CLIENT_EMAIL: process.env.NEXT_FIREBASE_PUBLIC_CLIENT_EMAIL
      ? `${process.env.NEXT_FIREBASE_PUBLIC_CLIENT_EMAIL.substring(0, 20)}... (length: ${process.env.NEXT_FIREBASE_PUBLIC_CLIENT_EMAIL.length})`
      : "NOT SET",
    NEXT_FIREBASE_PUBLIC_PRIVATE_KEY: process.env.NEXT_FIREBASE_PUBLIC_PRIVATE_KEY
      ? `Set (length: ${process.env.NEXT_FIREBASE_PUBLIC_PRIVATE_KEY.length}, starts with: ${process.env.NEXT_FIREBASE_PUBLIC_PRIVATE_KEY.substring(0, 30)}...)`
      : "NOT SET",
    // Server-side only names
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? "Set" : "NOT SET",
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? "Set" : "NOT SET",
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? "Set" : "NOT SET",
  };

  return NextResponse.json(
    {
      success: true,
      message: "Environment variables check",
      data: envVars,
      allEnvKeys: Object.keys(process.env).filter(key => 
        key.includes("FIREBASE") || key.includes("firebase")
      ),
    },
    { status: 200 }
  );
}

