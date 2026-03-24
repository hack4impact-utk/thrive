import { NextResponse } from "next/server";

import { sendTransactionalSms } from "@/lib/sms/brevo-sms";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const phone = String(body?.phone ?? "").trim();
    const firstName = String(body?.firstName ?? "").trim();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone is required" },
        { status: 400 },
      );
    }

    const result = await sendTransactionalSms(
      phone,
      `Hi ${firstName || "there"}, your test SMS is working.`,
    );

    return NextResponse.json({ success: true, result });
  } catch (error: unknown) {
    console.error("SMS route error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to send SMS";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
