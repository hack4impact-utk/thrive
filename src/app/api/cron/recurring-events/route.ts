import { and, eq, gte, isNull, lte, or } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db";
import { events, recurringEvents } from "@/db/schema";

export const dynamic = "force-dynamic";

function occursOnDate(
  frequency: string,
  startDate: string,
  targetDate: string,
): boolean {
  const start = new Date(startDate + "T00:00:00Z");
  const target = new Date(targetDate + "T00:00:00Z");

  if (target < start) return false;

  switch (frequency) {
    case "daily": {
      return true;
    }

    case "weekly": {
      return start.getUTCDay() === target.getUTCDay();
    }

    case "biweekly": {
      if (start.getUTCDay() !== target.getUTCDay()) return false;
      const diffWeeks = Math.round(
        (target.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000),
      );
      return diffWeeks % 2 === 0;
    }

    case "monthly": {
      return start.getUTCDate() === target.getUTCDate();
    }

    default: {
      return false;
    }
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().slice(0, 10);

    const patterns = await db
      .select()
      .from(recurringEvents)
      .where(
        and(
          eq(recurringEvents.active, true),
          lte(recurringEvents.startDate, today),
          or(
            isNull(recurringEvents.endDate),
            gte(recurringEvents.endDate, today),
          ),
        ),
      );

    let created = 0;

    for (const pattern of patterns) {
      if (!occursOnDate(pattern.frequency, pattern.startDate, today)) continue;

      const existing = await db
        .select({ id: events.id })
        .from(events)
        .where(
          and(
            eq(events.recurringEventId, pattern.id),
            eq(events.eventDate, today),
          ),
        )
        .limit(1);

      if (existing.length > 0) continue;

      await db.insert(events).values({
        title: pattern.title,
        eventDate: today,
        startTime: pattern.startTime,
        endTime: pattern.endTime,
        capacity: pattern.capacity,
        registeredUsers: 0,
        locationId: pattern.locationId,
        description: pattern.description,
        recurringEventId: pattern.id,
      });

      created++;
    }

    return NextResponse.json({ success: true, created });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
