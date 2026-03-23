import { NextResponse } from "next/server";
import { eq, and, between } from "drizzle-orm";

import db from "@/db";
import { events, eventAttendees, users } from "@/db/schema";
import { sendEventReminderEvent } from "@/lib/email/email";

export async function GET(req: Request) {
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
        } catch (err) {
          console.error(
            `Failed to send reminder to ${attendee.email} for event ${event.id}:`,
            err
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
  } catch (err: any) {
    console.error("Event reminder cron error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
