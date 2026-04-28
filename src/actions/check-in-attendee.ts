"use server";

import { and, eq } from "drizzle-orm";

import db from "@/db";
import { eventAttendees, events, userInfo } from "@/db/schema";
import getUserSession from "@/utils/auth/get-user-session";

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calcDurationHours(startTime: string, endTime: string): number {
  return (toMinutes(endTime) - toMinutes(startTime)) / 60;
}

export async function checkInAttendee(
  eventId: string,
  attendeeUserId: string,
): Promise<void> {
  const session = await getUserSession();

  if (session?.user?.role !== "kiosk") {
    throw new Error("Unauthorized");
  }

  const attendeeRow = await db
    .select({ attended: eventAttendees.attended })
    .from(eventAttendees)
    .where(
      and(
        eq(eventAttendees.eventId, eventId),
        eq(eventAttendees.userId, attendeeUserId),
      ),
    )
    .then((res) => res[0]);

  if (!attendeeRow) throw new Error("Attendee not registered for this event");
  if (attendeeRow.attended) return;

  const event = await db
    .select({ startTime: events.startTime, endTime: events.endTime })
    .from(events)
    .where(eq(events.id, eventId))
    .then((res) => res[0]);

  if (!event) throw new Error("Event not found");

  const durationHours = calcDurationHours(event.startTime, event.endTime);

  await db
    .update(eventAttendees)
    .set({ attended: true })
    .where(
      and(
        eq(eventAttendees.eventId, eventId),
        eq(eventAttendees.userId, attendeeUserId),
      ),
    );

  const currentInfo = await db
    .select({ hoursVolunteered: userInfo.hoursVolunteered })
    .from(userInfo)
    .where(eq(userInfo.userId, attendeeUserId))
    .then((res) => res[0]);

  if (currentInfo) {
    await db
      .update(userInfo)
      .set({
        hoursVolunteered: (currentInfo.hoursVolunteered ?? 0) + durationHours,
      })
      .where(eq(userInfo.userId, attendeeUserId));
  }
}
