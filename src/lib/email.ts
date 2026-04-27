const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "Thrive <onboarding@resend.dev>";

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<void> {
  const apiKey = process.env.RESEND_EMAIL_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_EMAIL_API_KEY is not set");
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }
}
