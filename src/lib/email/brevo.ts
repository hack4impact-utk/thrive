import { BrevoClient } from "@getbrevo/brevo";

const apiKey = process.env.BREVO_API_KEY || process.env.EMAIL_API_KEY;

if (!apiKey) {
  throw new Error("Missing BREVO_API_KEY (or EMAIL_API_KEY)");
}

export const brevo = new BrevoClient({ apiKey });
