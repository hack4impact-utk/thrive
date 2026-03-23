import { sendTransactionalSms } from "@/lib/sms/brevoSms";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body?.phone ?? "").trim();
    const firstName = String(body?.firstName ?? "").trim();

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone is required" }, { status: 400 });
    }

    const result = await sendTransactionalSms(
      phone,
      `Hi ${firstName || "there"}, your test SMS is working.`
    );

    return NextResponse.json({ success: true, result });
  } catch (err: any) {
    console.error("SMS route error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to send SMS" },
      { status: 500 }
    );
  }
}