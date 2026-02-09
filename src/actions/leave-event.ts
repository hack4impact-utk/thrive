"use server";

import { and, eq } from "drizzle-orm";

import db from "@/db";
import { eventAttendees } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function leaveEvent(eventId: string): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

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
