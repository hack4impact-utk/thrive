export async function sendTransactionalSms(to: string, content: string) {
  const apiKey = process.env.BREVO_API_KEY || process.env.EMAIL_API_KEY;
  if (!apiKey) throw new Error("Missing BREVO_API_KEY");

  const res = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: "Thrive",      // must be valid in your Brevo setup/region
      recipient: to,         // E.164 format, e.g. +1865...
      content,               // plain SMS text
      type: "transactional", // use "marketing" only if it’s actually marketing
    }),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`Brevo SMS error ${res.status}: ${text}`);

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}