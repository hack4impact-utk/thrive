"use server";

import { and, eq, gte, lte, ne, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db";
import { events } from "@/db/schema/events";
import { addDays, formatDateOnly } from "@/lib/recurrence";
import { RECURRING_EVENTS_WINDOW_DAYS } from "@/lib/recurring-events-config";

export async function deleteEvent(id: string): Promise<void> {
  const [event] = await db
    .select({ recurringEventId: events.recurringEventId })
    .from(events)
    .where(eq(events.id, id));

  if (event?.recurringEventId) {
    const today = formatDateOnly(new Date());
    const windowEnd = addDays(today, RECURRING_EVENTS_WINDOW_DAYS);

    await db
      .update(events)
      .set({ deleted: true })
      .where(
        and(
          eq(events.recurringEventId, event.recurringEventId),
          ne(events.deleted, true),
          or(
            eq(events.id, id),
            and(gte(events.eventDate, today), lte(events.eventDate, windowEnd)),
          ),
        ),
      );
  } else {
    await db.update(events).set({ deleted: true }).where(eq(events.id, id));
  }

  revalidatePath("/dashboard/events-library");
}
