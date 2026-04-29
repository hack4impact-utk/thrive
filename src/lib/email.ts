const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "Thrive <noreply@thrive.utkh4i.com>";
const LOGO_URL = "https://thrive.utkh4i.com/logo.png";
const NAVY = "#22305B";
const GREEN = "#22A27E";

export function formatEmailDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatEmailTime(timeStr: string): string {
  const [hourStr, minuteStr] = timeStr.split(":");
  const hour = Number.parseInt(hourStr, 10);
  const minute = Number.parseInt(minuteStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  const minuteFormatted = minute.toString().padStart(2, "0");
  return `${hour12}:${minuteFormatted} ${period}`;
}

export function buildEmailHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:${NAVY};padding:28px 40px;border-radius:10px 10px 0 0;text-align:center;">
              <img src="${LOGO_URL}" alt="Thrive" height="52"
                   style="display:inline-block;max-width:200px;" />
            </td>
          </tr>

          <!-- Accent bar -->
          <tr>
            <td style="background:${GREEN};height:4px;line-height:4px;font-size:0;">&nbsp;</td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;border-left:1px solid #e0e0e0;border-right:1px solid #e0e0e0;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${NAVY};padding:20px 40px;border-radius:0 0 10px 10px;text-align:center;">
              <p style="margin:0 0 4px;color:#ffffff;font-size:13px;font-weight:600;letter-spacing:0.5px;">
                The Thrive Team
              </p>
              <p style="margin:0;font-size:12px;">
                <a href="mailto:volunteer@thrivelonsdale.com"
                   style="color:${GREEN};text-decoration:none;">
                  volunteer@thrivelonsdale.com
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

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
