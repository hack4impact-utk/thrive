import { between, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db";
import { eventAttendees, events, users } from "@/db/schema";
import { sendEventReminderEvent } from "@/lib/email/email";

export async function GET(req: Request): Promise<NextResponse> {
  // Protect the cron endpoint with a secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Get the date strings for the query window
    const todayStr = now.toISOString().split("T")[0];
    const tomorrowStr = in24Hours.toISOString().split("T")[0];

    // Find events happening in the next 24 hours
    const upcomingEvents = await db
      .select()
      .from(events)
      .where(between(events.eventDate, todayStr, tomorrowStr));

    let sent = 0;
    let failed = 0;

    for (const event of upcomingEvents) {
      // Get all attendees for this event with their user info
      const attendees = await db
        .select({
          email: users.email,
          name: users.name,
        })
        .from(eventAttendees)
        .innerJoin(users, eq(eventAttendees.userId, users.id))
        .where(eq(eventAttendees.eventId, event.id));

      for (const attendee of attendees) {
        if (!attendee.email) continue;

        try {
          await sendEventReminderEvent({
            email: attendee.email,
            firstName: attendee.name?.split(" ")[0],
            eventTitle: event.title,
            eventDate: event.eventDate,
            startTime: event.startTime,
            eventId: event.id,
          });
          sent++;
        } catch (error) {
          console.error(
            `Failed to send reminder to ${attendee.email} for event ${event.id}:`,
            error,
          );
          failed++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      eventsFound: upcomingEvents.length,
      remindersSent: sent,
      remindersFailed: failed,
    });
  } catch (error: unknown) {
    console.error("Event reminder cron error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
