import { NextRequest, NextResponse } from "next/server";
import * as admin from "firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // Get the private key from environment
    const privateKey = 
      process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY || 
      process.env.NEXT_FIREBASE_PRIVATE_KEY ||
      process.env.NEXT_FIREBASE_PUBLIC_PRIVATE_KEY ||
      process.env.FIREBASE_PRIVATE_KEY;

    if (!privateKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Private key not found in environment variables",
        },
        { status: 400 }
      );
    }

    // Analyze the key format
    const analysis = {
      length: privateKey.length,
      hasQuotes: privateKey.startsWith('"') || privateKey.startsWith("'"),
      startsWithBegin: privateKey.includes("BEGIN PRIVATE KEY") || privateKey.includes("BEGIN RSA PRIVATE KEY"),
      endsWithEnd: privateKey.includes("END PRIVATE KEY") || privateKey.includes("END RSA PRIVATE KEY"),
      hasNewlines: privateKey.includes("\n"),
      hasEscapedNewlines: privateKey.includes("\\n"),
      first50Chars: privateKey.substring(0, 50),
      last50Chars: privateKey.substring(Math.max(0, privateKey.length - 50)),
      newlineCount: (privateKey.match(/\n/g) || []).length,
      escapedNewlineCount: (privateKey.match(/\\n/g) || []).length,
    };

    // Try to format and test the key
    let formattedKey = privateKey.trim();
    
    // Remove quotes
    if ((formattedKey.startsWith('"') && formattedKey.endsWith('"')) ||
        (formattedKey.startsWith("'") && formattedKey.endsWith("'"))) {
      formattedKey = formattedKey.slice(1, -1);
    }
    
    // Replace \n with actual newlines
    formattedKey = formattedKey.replace(/\\n/g, "\n");
    
    // Test if it can be parsed
    let parseTest = "Not attempted";
    try {
      // Try to create a credential (this will fail if key is invalid)
      const testCredential = admin.credential.cert({
        projectId: "test",
        clientEmail: "test@test.com",
        privateKey: formattedKey,
      });
      parseTest = "Success - Key format is valid";
    } catch (error: any) {
      parseTest = `Failed: ${error.message}`;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Private key analysis",
        data: {
          analysis,
          formattedKeyLength: formattedKey.length,
          formattedKeyFirst100: formattedKey.substring(0, 100).replace(/\n/g, "\\n"),
          formattedKeyLast100: formattedKey.substring(Math.max(0, formattedKey.length - 100)).replace(/\n/g, "\\n"),
          parseTest,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Error analyzing private key",
        error: error.message,
      },
      { status: 500 }
    );
  }
}





