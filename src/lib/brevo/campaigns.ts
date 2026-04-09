import { getBrevoClient } from "./client";

export interface CreateClassicCampaignParams {
  name: string;
  subject: string;
  sender: { name: string; email: string };
  htmlContent: string;
  listIds: number[];
  /** e.g. "2018-01-01 00:00:01" — optional; omit to send per Brevo campaign flow */
  scheduledAt?: string;
}

/**
 * Create a classic email campaign (marketing) sent to Brevo contact lists.
 * Requires BREVO_API_KEY with campaign permissions and valid list IDs in your Brevo account.
 */
export async function createClassicEmailCampaign(params: CreateClassicCampaignParams) {
  const client = getBrevoClient();
  return client.emailCampaigns.createEmailCampaign({
    name: params.name,
    subject: params.subject,
    sender: params.sender,
    htmlContent: params.htmlContent,
    recipients: { listIds: params.listIds },
    ...(params.scheduledAt ? { scheduledAt: params.scheduledAt } : {}),
  });
}
