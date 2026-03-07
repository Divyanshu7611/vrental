import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "@/utilis/firebaseAdmin";
import admin from "@/utilis/firebaseAdmin";

export async function GET(req: NextRequest) {
  try {
    const db = getFirestore();
    
    // Test write
    const testRef = db.collection("test").doc("connection-test");
    await testRef.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      message: "Firestore connection test",
    });
    
    // Test read
    const doc = await testRef.get();
    
    // Clean up
    await testRef.delete();
    
    return NextResponse.json(
      {
        success: true,
        message: "Firestore connection successful",
        data: {
          writeSuccess: true,
          readSuccess: doc.exists,
          timestamp: doc.data()?.timestamp?.toDate?.()?.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Firestore test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Firestore connection failed",
        error: {
          message: error.message,
          code: error.code,
          stack: error.stack,
        },
      },
      { status: 500 }
    );
  }
}





