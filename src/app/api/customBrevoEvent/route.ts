import { NextResponse } from "next/server";

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

    const apiKey = process.env.BREVO_API_KEY || process.env.EMAIL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Missing BREVO_API_KEY" },
        { status: 500 },
      );
    }

    const eventName = "test_email_trigger";

    const res = await fetch("https://api.brevo.com/v3/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        event_name: eventName,
        identifiers: {
          email_id: email,
        },
        // Optional: updates contact properties if mapped in Brevo
        contact_properties: {
          FIRSTNAME: firstName || "Test",
        },
        // Optional: event-specific payload
        event_properties: {
          source: "curl_test",
          trigger_type: "manual",
        },
        // Optional: explicit timestamp
        event_date: new Date().toISOString(),
      }),
    });

    const text = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Brevo event API error ${res.status}`,
          details: text,
        },
        { status: 500 },
      );
    }

    // Brevo docs show 204 No Content for create event
    return NextResponse.json({
      success: true,
      event: eventName,
      brevoStatus: res.status,
      brevoBody: text || null,
    });
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
