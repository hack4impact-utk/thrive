import type { Config } from "@netlify/functions";

export default async function handler(): Promise<void> {
  const baseUrl = process.env.URL;
  const secret = process.env.CRON_SECRET;

  if (!baseUrl || !secret) return;

  await fetch(`${baseUrl}/api/cron/reminders`, {
    method: "POST",
    headers: { "x-api-key": secret },
  });
}

// 8 AM Eastern (UTC-5 EST / UTC-4 EDT). Using 13:00 UTC = 8 AM EST / 9 AM EDT.
export const config: Config = {
  schedule: "0 13 * * *",
};
