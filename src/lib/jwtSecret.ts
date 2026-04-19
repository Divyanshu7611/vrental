/**
 * Single source for JWT HMAC secret. Signing (login/register/google) and verification
 * must use the same value. Trims JWT_SECRET so stray whitespace in `.env` does not
 * break tokens (a common cause of "Invalid token" right after a good login).
 */
export function getJwtSecret(): string {
  const raw = process.env.JWT_SECRET;
  if (typeof raw === "string") {
    const t = raw.trim();
    if (t.length > 0) return t;
  }
  return "Divyanshu";
}
