import { and, eq, gte, isNull, lte, or } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db";
import { recurringEvents } from "@/db/schema";
import { materializeRecurringEvent } from "@/lib/materialize-recurring-event";
import { addDays, formatDateOnly } from "@/lib/recurrence";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = formatDateOnly(new Date());
    const targetDate = addDays(today, 1);

    const patterns = await db
      .select()
      .from(recurringEvents)
      .where(
        and(
          eq(recurringEvents.active, true),
          lte(recurringEvents.startDate, targetDate),
          or(
            isNull(recurringEvents.endDate),
            gte(recurringEvents.endDate, today),
          ),
        ),
      );

    let created = 0;

    for (const pattern of patterns) {
      created += await materializeRecurringEvent(pattern, today, targetDate);
    }

    return NextResponse.json({ success: true, created });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
