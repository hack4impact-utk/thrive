"use server";

import db from "@/db";
import { eventAttendees } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function attendEvent(eventId: string): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  await db
    .insert(eventAttendees)
    .values({
      eventId,
      userId: session.user.id,
    })
    .onConflictDoNothing();
}
