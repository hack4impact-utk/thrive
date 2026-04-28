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

export const config: Config = {
  schedule: "0 0 * * *",
};
