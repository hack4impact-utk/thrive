import { NextResponse } from "next/server";

import { sendDailyReminders } from "@/lib/send-reminders";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await sendDailyReminders();

    return NextResponse.json({ success: true, ...result });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
