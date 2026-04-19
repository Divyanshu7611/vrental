import { NextResponse, NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwtSecret";

export async function verifyToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      isValid: false,
      response: NextResponse.json(
        { message: "Unauthorized: No token provided", success: false },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });

    // Ensure decoded is a JwtPayload (object) and contains the `id` field
    if (typeof decoded !== "string" && "id" in decoded) {
      return { isValid: true, userId: (decoded as JwtPayload).id };
    } else {
      return {
        isValid: false,
        response: NextResponse.json(
          { message: "Unauthorized: Invalid token payload", success: false },
          { status: 401 }
        ),
      };
    }
  } catch (error) {
    return {
      isValid: false,
      response: NextResponse.json(
        { message: "Unauthorized: Invalid token", success: false },
        { status: 401 }
      ),
    };
  }
}
