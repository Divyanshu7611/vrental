import { NextRequest } from "next/server";

/**
 * When CRON_SECRET is set in the environment, only requests that pass this check may run the job.
 */
export function isCronRouteAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) {
    return true;
  }
  const auth = req.headers.get("authorization");
  const header = req.headers.get("x-cron-secret");
  return auth === `Bearer ${secret}` || header === secret;
}
