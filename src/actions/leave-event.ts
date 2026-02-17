"use server";

import { and, eq } from "drizzle-orm";

import db from "@/db";
import { eventAttendees, events } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function leaveEvent(eventId: string): Promise<void> {
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

  let newCount = event.registeredUsers ?? 0;

  newCount--;

  await db
    .update(events)
    .set({ registeredUsers: newCount })
    .where(eq(events.id, eventId));

  // ✅ Remove the attendee row for this user + event
  await db
    .delete(eventAttendees)
    .where(
      and(
        eq(eventAttendees.eventId, eventId),
        eq(eventAttendees.userId, session.user.id),
      ),
    );
}
