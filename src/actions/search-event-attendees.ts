"use server";

import { and, eq, ilike } from "drizzle-orm";

import db from "@/db";
import { eventAttendees, userInfo, users } from "@/db/schema";
import getUserSession from "@/utils/auth/get-user-session";

export type AttendeeResult = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  attended: boolean;
};

export async function searchEventAttendees(
  eventId: string,
  firstName: string,
  lastName: string,
): Promise<AttendeeResult[]> {
  const session = await getUserSession();

  if (session?.user?.role !== "kiosk") {
    throw new Error("Unauthorized");
  }

  if (!firstName.trim() || !lastName.trim()) {
    return [];
  }

  return db
    .select({
      userId: eventAttendees.userId,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: users.email,
      attended: eventAttendees.attended,
    })
    .from(eventAttendees)
    .innerJoin(userInfo, eq(userInfo.userId, eventAttendees.userId))
    .innerJoin(users, eq(users.id, eventAttendees.userId))
    .where(
      and(
        eq(eventAttendees.eventId, eventId),
        ilike(userInfo.firstName, `%${firstName.trim()}%`),
        ilike(userInfo.lastName, `%${lastName.trim()}%`),
      ),
    );
}
