import { BrevoClient } from "@getbrevo/brevo";

let cached: BrevoClient | null = null;

export function getBrevoApiKey(): string | undefined {
  return process.env.BREVO_API_KEY?.trim() || undefined;
}

/** Shared SDK client (API v3 key — not the SMTP password). */
export function getBrevoClient(): BrevoClient {
  const apiKey = getBrevoApiKey();
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set");
  }
  if (!cached) {
    cached = new BrevoClient({ apiKey });
  }
  return cached;
}

export function hasBrevoRestApi(): boolean {
  return !!getBrevoApiKey();
}
