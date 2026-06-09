import { and, eq, gte, isNull, lte, or } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db";
import { events, recurringEvents } from "@/db/schema";

export const dynamic = "force-dynamic";

type RecurringPattern = {
  frequency: string;
  startDate: string;
  daysOfWeek: number[] | null;
  weekdaysOnly: boolean;
  monthlyType: string | null;
  monthlyNth: number | null;
  monthlyWeekday: number | null;
};

function occursOnDate(pattern: RecurringPattern, targetDate: string): boolean {
  const start = new Date(pattern.startDate + "T00:00:00Z");
  const target = new Date(targetDate + "T00:00:00Z");

  if (target < start) return false;

  switch (pattern.frequency) {
    case "daily": {
      if (pattern.weekdaysOnly) {
        const d = target.getUTCDay();
        return d >= 1 && d <= 5;
      }
      return true;
    }

    case "weekly": {
      // Support multiple days; fall back to start date's day for legacy records.
      const days =
        pattern.daysOfWeek && pattern.daysOfWeek.length > 0
          ? pattern.daysOfWeek
          : [start.getUTCDay()];
      return days.includes(target.getUTCDay());
    }

    case "biweekly": {
      const selectedDay =
        pattern.daysOfWeek && pattern.daysOfWeek.length > 0
          ? pattern.daysOfWeek[0]
          : start.getUTCDay();

      if (target.getUTCDay() !== selectedDay) return false;

      // Anchor the "every other week" cadence on the first occurrence of
      // selectedDay on or after startDate.
      const daysUntilFirst = (selectedDay - start.getUTCDay() + 7) % 7;
      const firstOccurrence = new Date(start);
      firstOccurrence.setUTCDate(start.getUTCDate() + daysUntilFirst);

      if (target < firstOccurrence) return false;

      const diffWeeks = Math.round(
        (target.getTime() - firstOccurrence.getTime()) /
          (7 * 24 * 60 * 60 * 1000),
      );
      return diffWeeks % 2 === 0;
    }

    case "monthly": {
      if (
        pattern.monthlyType === "nth-weekday" &&
        pattern.monthlyNth !== null &&
        pattern.monthlyWeekday !== null
      ) {
        if (target.getUTCDay() !== pattern.monthlyWeekday) return false;

        if (pattern.monthlyNth === -1) {
          // "Last" occurrence: the next 7 days spill into the following month.
          const nextWeek = new Date(target);
          nextWeek.setUTCDate(target.getUTCDate() + 7);
          return nextWeek.getUTCMonth() !== target.getUTCMonth();
        }

        // nth occurrence within the month (1-4).
        return Math.ceil(target.getUTCDate() / 7) === pattern.monthlyNth;
      }

      // day-of-month: use startDate's day. Months that lack this day are
      // naturally skipped because their dates never equal it (e.g. Feb has
      // no 31st, so a pattern starting on the 31st is skipped in Feb).
      return target.getUTCDate() === start.getUTCDate();
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

    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const targetDate = tomorrow.toISOString().slice(0, 10);

    const patterns = await db
      .select()
      .from(recurringEvents)
      .where(
        and(
          eq(recurringEvents.active, true),
          lte(recurringEvents.startDate, targetDate),
          or(
            isNull(recurringEvents.endDate),
            gte(recurringEvents.endDate, targetDate),
          ),
        ),
      );

    let created = 0;

    for (const pattern of patterns) {
      if (!occursOnDate(pattern, targetDate)) continue;

      const existing = await db
        .select({ id: events.id })
        .from(events)
        .where(
          and(
            eq(events.recurringEventId, pattern.id),
            eq(events.eventDate, targetDate),
          ),
        )
        .limit(1);

      if (existing.length > 0) continue;

      await db.insert(events).values({
        title: pattern.title,
        eventDate: targetDate,
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
