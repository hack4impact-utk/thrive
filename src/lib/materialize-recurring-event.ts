import { and, eq, inArray } from "drizzle-orm";

import db from "@/db";
import { events, recurringEvents } from "@/db/schema";
import { getMaterializationDates } from "@/lib/recurrence";

type RecurringEvent = typeof recurringEvents.$inferSelect;

export async function materializeRecurringEvent(
  pattern: RecurringEvent,
  fromDate: string,
  throughDate: string,
): Promise<number> {
  const occurrenceDates = getMaterializationDates(
    pattern,
    fromDate,
    throughDate,
  );
  if (occurrenceDates.length === 0) return 0;

  const existing = await db
    .select({ eventDate: events.eventDate })
    .from(events)
    .where(
      and(
        eq(events.recurringEventId, pattern.id),
        inArray(events.eventDate, occurrenceDates),
      ),
    );
  const existingDates = new Set(existing.map((event) => event.eventDate));

  const missingEvents = occurrenceDates
    .filter((eventDate) => !existingDates.has(eventDate))
    .map((eventDate) => ({
      title: pattern.title,
      eventDate,
      startTime: pattern.startTime,
      endTime: pattern.endTime,
      capacity: pattern.capacity,
      registeredUsers: 0,
      locationId: pattern.locationId,
      description: pattern.description,
      recurringEventId: pattern.id,
    }));

  if (missingEvents.length === 0) return 0;

  const inserted = await db
    .insert(events)
    .values(missingEvents)
    .returning({ id: events.id });
  return inserted.length;
}
