import type { Config } from "@netlify/functions";

function getBaseUrl() {
  const candidates = [
    process.env.APP_URL,
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_URL
  ].filter(Boolean) as string[];

  const baseUrl = candidates[0];

  if (!baseUrl) {
    throw new Error("APP_URL or Netlify site URL is required for scheduled email reminders.");
  }

  return baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
}

const handler = async () => {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    throw new Error("CRON_SECRET is required for scheduled email reminders.");
  }

  const response = await fetch(`${getBaseUrl()}/api/email-reminders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Scheduled email reminder call failed: ${response.status} ${body}`);
  }

  const result = await response.json();
  console.log("Scheduled email reminder run complete", result);
};

export default handler;

export const config: Config = {
  schedule: "*/5 * * * *"
};
