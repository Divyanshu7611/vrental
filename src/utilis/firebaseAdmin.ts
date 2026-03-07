import * as admin from "firebase-admin";

let initializationAttempted = false;
let initializationError: string | null = null;

// Initialize Firebase Admin lazily (only when needed)
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return true; // Already initialized
  }

  if (initializationAttempted) {
    return false; // Already tried and failed
  }

  initializationAttempted = true;

  try {
    // Check if required environment variables are present
    // Check multiple possible variable name formats
    const projectId = 
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 
      process.env.NEXT_FIREBASE_PROJECT_ID ||
      process.env.NEXT_FIREBASE_PUBLIC_PROJECT_ID ||
      process.env.FIREBASE_PROJECT_ID;
    const clientEmail = 
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL || 
      process.env.NEXT_FIREBASE_CLIENT_EMAIL ||
      process.env.NEXT_FIREBASE_PUBLIC_CLIENT_EMAIL ||
      process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = 
      process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY || 
      process.env.NEXT_FIREBASE_PRIVATE_KEY ||
      process.env.NEXT_FIREBASE_PUBLIC_PRIVATE_KEY ||
      process.env.FIREBASE_PRIVATE_KEY;

    console.log("=== Firebase Admin Initialization Check ===");
    console.log("Environment check at:", new Date().toISOString());
    
    // Check all possible variable names
    const projectIdSources = {
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID": process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      "NEXT_FIREBASE_PROJECT_ID": process.env.NEXT_FIREBASE_PROJECT_ID,
      "NEXT_FIREBASE_PUBLIC_PROJECT_ID": process.env.NEXT_FIREBASE_PUBLIC_PROJECT_ID,
      "FIREBASE_PROJECT_ID": process.env.FIREBASE_PROJECT_ID,
    };
    
    const clientEmailSources = {
      "NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL": process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      "NEXT_FIREBASE_CLIENT_EMAIL": process.env.NEXT_FIREBASE_CLIENT_EMAIL,
      "NEXT_FIREBASE_PUBLIC_CLIENT_EMAIL": process.env.NEXT_FIREBASE_PUBLIC_CLIENT_EMAIL,
      "FIREBASE_CLIENT_EMAIL": process.env.FIREBASE_CLIENT_EMAIL,
    };
    
    const privateKeySources = {
      "NEXT_PUBLIC_FIREBASE_PRIVATE_KEY": process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY,
      "NEXT_FIREBASE_PRIVATE_KEY": process.env.NEXT_FIREBASE_PRIVATE_KEY,
      "NEXT_FIREBASE_PUBLIC_PRIVATE_KEY": process.env.NEXT_FIREBASE_PUBLIC_PRIVATE_KEY,
      "FIREBASE_PRIVATE_KEY": process.env.FIREBASE_PRIVATE_KEY,
    };
    
    console.log("Project ID sources:");
    Object.entries(projectIdSources).forEach(([key, value]) => {
      console.log(`  ${key}:`, value ? `✓ Set (${value.substring(0, 10)}...)` : "✗ Missing");
    });
    
    console.log("Client Email sources:");
    Object.entries(clientEmailSources).forEach(([key, value]) => {
      console.log(`  ${key}:`, value ? `✓ Set (${value.substring(0, 20)}...)` : "✗ Missing");
    });
    
    console.log("Private Key sources:");
    Object.entries(privateKeySources).forEach(([key, value]) => {
      console.log(`  ${key}:`, value ? `✓ Set (length: ${value.length})` : "✗ Missing");
    });

    // Trim whitespace
    const trimmedProjectId = projectId?.trim();
    const trimmedClientEmail = clientEmail?.trim();
    const trimmedPrivateKey = privateKey?.trim();

    if (!trimmedProjectId || !trimmedClientEmail || !trimmedPrivateKey) {
      const missing = [];
      if (!trimmedProjectId) missing.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_FIREBASE_PROJECT_ID, NEXT_FIREBASE_PUBLIC_PROJECT_ID, or FIREBASE_PROJECT_ID");
      if (!trimmedClientEmail) missing.push("NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL, NEXT_FIREBASE_CLIENT_EMAIL, NEXT_FIREBASE_PUBLIC_CLIENT_EMAIL, or FIREBASE_CLIENT_EMAIL");
      if (!trimmedPrivateKey) missing.push("NEXT_PUBLIC_FIREBASE_PRIVATE_KEY, NEXT_FIREBASE_PRIVATE_KEY, NEXT_FIREBASE_PUBLIC_PRIVATE_KEY, or FIREBASE_PRIVATE_KEY");
      
      initializationError = `Missing environment variables: ${missing.join(", ")}`;
      console.error("❌ Firebase Admin: Missing required environment variables:");
      missing.forEach(v => console.error(`  - ${v}`));
      console.error("\n💡 Tips:");
      console.error("  1. Make sure .env.local exists in the project root");
      console.error("  2. Restart your dev server after adding variables");
      console.error("  3. Check for typos in variable names");
      console.error("  4. Ensure no extra spaces around the = sign");
      console.log("===========================================");
      return false;
    }

    // Validate private key format
    if (!trimmedPrivateKey.includes("BEGIN PRIVATE KEY") && !trimmedPrivateKey.includes("BEGIN RSA PRIVATE KEY")) {
      initializationError = "Invalid private key format. Private key should start with '-----BEGIN PRIVATE KEY-----'";
      console.error("❌ Firebase Admin: Invalid private key format");
      console.error("Private key should start with: -----BEGIN PRIVATE KEY-----");
      console.error("First 50 chars of key:", trimmedPrivateKey.substring(0, 50));
      console.log("===========================================");
      return false;
    }

    // Fix private key formatting - handle various formats
    let formattedPrivateKey = trimmedPrivateKey;
    
    console.log("🔍 Processing private key...");
    console.log("Original key length:", formattedPrivateKey.length);
    console.log("Has quotes:", formattedPrivateKey.startsWith('"') || formattedPrivateKey.startsWith("'"));
    console.log("Has \\n:", formattedPrivateKey.includes("\\n"));
    console.log("Has actual newlines:", formattedPrivateKey.includes("\n"));
    
    // Remove surrounding quotes if present (single or double)
    if ((formattedPrivateKey.startsWith('"') && formattedPrivateKey.endsWith('"')) ||
        (formattedPrivateKey.startsWith("'") && formattedPrivateKey.endsWith("'"))) {
      formattedPrivateKey = formattedPrivateKey.slice(1, -1);
      console.log("✓ Removed surrounding quotes");
    }
    
    // Replace literal \n with actual newlines (handles JSON format)
    if (formattedPrivateKey.includes("\\n")) {
      formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, "\n");
      console.log("✓ Replaced \\n with actual newlines");
    }
    
    // Fix BEGIN/END markers if they have wrong number of dashes or spaces
    formattedPrivateKey = formattedPrivateKey
      .replace(/-{3,6}BEGIN\s+PRIVATE\s+KEY-{3,6}/gi, "-----BEGIN PRIVATE KEY-----")
      .replace(/-{3,6}BEGIN\s+RSA\s+PRIVATE\s+KEY-{3,6}/gi, "-----BEGIN RSA PRIVATE KEY-----")
      .replace(/-{3,6}END\s+PRIVATE\s+KEY-{3,6}/gi, "-----END PRIVATE KEY-----")
      .replace(/-{3,6}END\s+RSA\s+PRIVATE\s+KEY-{3,6}/gi, "-----END RSA PRIVATE KEY-----");
    
    // Remove any spaces around the markers
    formattedPrivateKey = formattedPrivateKey
      .replace(/\s+-----BEGIN/g, "\n-----BEGIN")
      .replace(/BEGIN-----\s+/g, "BEGIN-----\n")
      .replace(/\s+-----END/g, "\n-----END")
      .replace(/END-----\s+/g, "END-----\n");
    
    // Extract the key content and reformat if needed
    // Check if key content is all on one line or has very few newlines
    const newlineCount = (formattedPrivateKey.match(/\n/g) || []).length;
    const hasProperFormatting = newlineCount > 10; // Proper PEM keys have many lines
    
    if (!hasProperFormatting && formattedPrivateKey.includes("BEGIN")) {
      console.log("⚠️  Private key has insufficient line breaks. Reformatting...");
      console.log("Current newline count:", newlineCount);
      
      // Find BEGIN marker (handle various formats)
      const beginPatterns = [
        /-----BEGIN\s+PRIVATE\s+KEY-----/i,
        /-----BEGIN\s+RSA\s+PRIVATE\s+KEY-----/i,
        /----BEGIN\s+PRIVATE\s+KEY-----/i,
        /----BEGIN\s+RSA\s+PRIVATE\s+KEY-----/i,
      ];
      
      const endPatterns = [
        /-----END\s+PRIVATE\s+KEY-----/i,
        /-----END\s+RSA\s+PRIVATE\s+KEY-----/i,
        /----END\s+PRIVATE\s+KEY-----/i,
        /----END\s+RSA\s+PRIVATE\s+KEY-----/i,
      ];
      
      let beginMatch: RegExpMatchArray | null = null;
      let endMatch: RegExpMatchArray | null = null;
      let keyType = "PRIVATE KEY";
      
      for (const pattern of beginPatterns) {
        beginMatch = formattedPrivateKey.match(pattern);
        if (beginMatch) {
          if (pattern.source.includes("RSA")) {
            keyType = "RSA PRIVATE KEY";
          }
          break;
        }
      }
      
      for (const pattern of endPatterns) {
        endMatch = formattedPrivateKey.match(pattern);
        if (endMatch) break;
      }
      
      if (beginMatch && endMatch) {
        const beginMarker = `-----BEGIN ${keyType}-----`;
        const endMarker = `-----END ${keyType}-----`;
        
        // Extract key content - get everything between BEGIN and END
        const beginIndex = beginMatch.index! + beginMatch[0].length;
        const endIndex = endMatch.index!;
        
        if (beginIndex < endIndex) {
          let keyContent = formattedPrivateKey.substring(beginIndex, endIndex);
          
          // Remove all whitespace, newlines, and any other characters to get clean base64 content
          keyContent = keyContent.replace(/[\s\n\r\t]/g, "");
          
          // Remove any non-base64 characters (keep only A-Z, a-z, 0-9, +, /, =)
          keyContent = keyContent.replace(/[^A-Za-z0-9+\/=]/g, "");
          
          console.log("Extracted key content length:", keyContent.length);
          console.log("Key content preview (first 50):", keyContent.substring(0, 50));
          
          if (keyContent.length > 100) { // Valid keys are usually much longer
            // Reconstruct with proper formatting
            // Split the key content into 64-character lines (PEM standard)
            const lines = [];
            for (let i = 0; i < keyContent.length; i += 64) {
              lines.push(keyContent.substring(i, i + 64));
            }
            
            formattedPrivateKey = `${beginMarker}\n${lines.join("\n")}\n${endMarker}\n`;
            console.log("✓ Reformatted private key with proper line breaks");
            console.log("Formatted key has", (formattedPrivateKey.match(/\n/g) || []).length, "newlines");
            console.log("Formatted key length:", formattedPrivateKey.length);
          } else {
            console.error("❌ Extracted key content is too short:", keyContent.length);
            console.error("This suggests the key format is severely corrupted");
          }
        } else {
          console.error("❌ Invalid key structure - END comes before BEGIN");
        }
      } else {
        console.error("❌ Could not find BEGIN/END markers in private key");
        console.error("Key preview:", formattedPrivateKey.substring(0, 200));
      }
    }
    
    // Ensure proper newline at the end
    if (!formattedPrivateKey.endsWith("\n")) {
      formattedPrivateKey += "\n";
    }
    
    // Final validation
    const hasBeginMarker = formattedPrivateKey.includes("-----BEGIN");
    const hasEndMarker = formattedPrivateKey.includes("-----END");
    const hasNewlines = formattedPrivateKey.includes("\n");
    
    if (!hasBeginMarker || !hasEndMarker) {
      initializationError = "Private key format is invalid. Missing BEGIN or END markers.";
      console.error("❌ Firebase Admin: Invalid private key format");
      console.error("Has BEGIN marker:", hasBeginMarker);
      console.error("Has END marker:", hasEndMarker);
      console.error("First 100 chars:", formattedPrivateKey.substring(0, 100).replace(/\n/g, "\\n"));
      console.log("===========================================");
      return false;
    }
    
    if (!hasNewlines) {
      initializationError = "Private key format is invalid. Missing line breaks.";
      console.error("❌ Firebase Admin: Private key has no newlines");
      console.log("===========================================");
      return false;
    }

    // Final validation - ensure key has proper structure
    const finalNewlineCount = (formattedPrivateKey.match(/\n/g) || []).length;
    const hasBeginEnd = formattedPrivateKey.includes("-----BEGIN") && formattedPrivateKey.includes("-----END");
    const keyContentMatch = formattedPrivateKey.match(/-----BEGIN[^-]+-----\n([\s\S]+)\n-----END/);
    
    if (!hasBeginEnd) {
      initializationError = "Private key missing BEGIN or END markers";
      console.error("❌ Private key validation failed: Missing markers");
      console.log("===========================================");
      return false;
    }
    
    if (finalNewlineCount < 5) {
      initializationError = "Private key has insufficient line breaks";
      console.error("❌ Private key validation failed: Only", finalNewlineCount, "newlines (need at least 5)");
      console.log("===========================================");
      return false;
    }
    
    if (!keyContentMatch || keyContentMatch[1].trim().length < 100) {
      initializationError = "Private key content appears to be missing or too short";
      console.error("❌ Private key validation failed: Key content too short or missing");
      console.log("===========================================");
      return false;
    }

    console.log("Attempting to initialize Firebase Admin...");
    console.log("Private key length:", formattedPrivateKey.length);
    console.log("Newline count:", finalNewlineCount);
    console.log("Private key starts with:", formattedPrivateKey.substring(0, 50).replace(/\n/g, "\\n"));
    console.log("Private key ends with:", formattedPrivateKey.substring(Math.max(0, formattedPrivateKey.length - 50)).replace(/\n/g, "\\n"));
    
    try {
      // Test the key format by trying to create the credential
      const credential = admin.credential.cert({
        projectId: trimmedProjectId,
        clientEmail: trimmedClientEmail,
        privateKey: formattedPrivateKey,
      });
      
      // If credential creation succeeds, initialize the app
      admin.initializeApp({
        credential: credential,
      });
      
      console.log("✅ Credential created and app initialized successfully");
    } catch (certError: any) {
      initializationError = `Failed to parse private key: ${certError.message}`;
      console.error("❌ Error creating certificate:", certError);
      console.error("Error message:", certError.message);
      console.error("\n🔍 Debugging info:");
      console.error("  Formatted key length:", formattedPrivateKey.length);
      console.error("  Newline count:", finalNewlineCount);
      console.error("  Has BEGIN marker:", formattedPrivateKey.includes("-----BEGIN"));
      console.error("  Has END marker:", formattedPrivateKey.includes("-----END"));
      console.error("  First 200 chars:", formattedPrivateKey.substring(0, 200).replace(/\n/g, "\\n"));
      console.error("\n💡 Common issues:");
      console.error("  1. Private key missing proper line breaks (\\n)");
      console.error("  2. Private key has extra spaces or characters");
      console.error("  3. Private key is truncated or incomplete");
      console.error("  4. Private key content is corrupted");
      console.error("\n📝 How to fix:");
      console.error("  1. Open your Firebase Service Account JSON file");
      console.error("  2. Copy the 'private_key' value EXACTLY as it appears");
      console.error("  3. Paste it in .env.local with quotes:");
      console.error('     NEXT_FIREBASE_PUBLIC_PRIVATE_KEY="[paste here]"');
      console.error("  4. Make sure it includes \\n for line breaks");
      console.log("===========================================");
      return false;
    }
    
    console.log("✅ Firebase Admin Initialized Successfully");
    console.log("Project ID:", trimmedProjectId);
    console.log("Client Email:", trimmedClientEmail);
    console.log("===========================================");
    return true;
  } catch (error: any) {
    initializationError = error.message;
    console.error("❌ Firebase Admin Initialization Error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 5).join('\n'),
    });
    console.log("===========================================");
    return false;
  }
}

// Helper function to get Firestore instance with error checking
export function getFirestore() {
  // Always try to initialize when getFirestore is called (lazy initialization)
  if (!admin.apps.length) {
    initializeFirebaseAdmin();
  }

  if (!admin.apps.length) {
    const errorMsg = initializationError || 
      "Firebase Admin is not initialized. Please check your environment variables:\n" +
      "- NEXT_PUBLIC_FIREBASE_PROJECT_ID (or FIREBASE_PROJECT_ID)\n" +
      "- NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL (or FIREBASE_CLIENT_EMAIL)\n" +
      "- NEXT_PUBLIC_FIREBASE_PRIVATE_KEY (or FIREBASE_PRIVATE_KEY)\n\n" +
      "Make sure these are set in your .env.local file and restart your dev server.";
    
    throw new Error(errorMsg);
  }
  return admin.firestore();
}

export default admin;
