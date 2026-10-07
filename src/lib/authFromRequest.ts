import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getJwtSecret } from "@/lib/jwtSecret";

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  const cookieToken = req.cookies.get("token")?.value;
  const headerToken = req.headers.get("x-auth-token");
  return authHeader?.split(" ")[1] || cookieToken || headerToken || null;
}

export function verifyRequestUser(req: NextRequest): { id: string; role?: string } | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] }) as JwtPayload;
    if (typeof decoded === "string" || !decoded.id) return null;
    return { id: String(decoded.id), role: decoded.role as string | undefined };
  } catch {
    return null;
  }
}
