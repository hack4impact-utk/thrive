"use server";

import { count, eq } from "drizzle-orm";

import db from "@/db";
import { eventAttendees, events } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function attendEvent(eventId: string): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const event = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .then((res) => res[0]);

  if (!event) {
    throw new Error("Event not found");
  }

  const capacity = event.capacity ?? 0;

  const attendeeCount = await db
    .select({ count: count() })
    .from(eventAttendees)
    .where(eq(eventAttendees.eventId, eventId));

  if (attendeeCount[0].count >= capacity || capacity == 0) {
    throw new Error("Event capacity reached");
  }

  const newCount = attendeeCount[0].count + 1;

  await db
    .update(events)
    .set({ registeredUsers: newCount })
    .where(eq(events.id, eventId));

  await db
    .insert(eventAttendees)
    .values({
      eventId,
      userId: session.user.id,
    })
    .onConflictDoNothing();
}
