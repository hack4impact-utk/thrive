import { NextResponse } from "next/server";

async function sendBrevoCustomEvent(
  email: string,
  firstName?: string,
): Promise<{ status: number }> {
  const apiKey = process.env.BREVO_API_KEY || process.env.EMAIL_API_KEY;
  if (!apiKey) throw new Error("Missing BREVO_API_KEY");

  const res = await fetch("https://api.brevo.com/v3/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      event_name: "test_email_trigger",
      identifiers: { email_id: email },
      contact_properties: { FIRSTNAME: firstName || "Test" },
      event_properties: { source: "curl_test" },
      event_date: new Date().toISOString(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo event error ${res.status}: ${text}`);
  }

  return { status: res.status }; // usually 204
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim();
    const firstName = String(body?.firstName ?? "").trim();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );
    }

    const result = await sendBrevoCustomEvent(email, firstName);
    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("testBrevoEvent error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
