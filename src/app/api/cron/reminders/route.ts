import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db";
import { eventAttendees, events, users } from "@/db/schema";
import { sendEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  try {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date().toISOString().slice(0, 10);

    const registrations = await db
      .select({
        userName: users.name,
        userEmail: users.email,
        eventTitle: events.title,
        startTime: events.startTime,
        endTime: events.endTime,
      })
      .from(eventAttendees)
      .innerJoin(events, eq(eventAttendees.eventId, events.id))
      .innerJoin(users, eq(eventAttendees.userId, users.id))
      .where(and(eq(events.eventDate, today), eq(events.deleted, false)));

    await Promise.allSettled(
      registrations
        .filter((r) => !!r.userEmail)
        .map((r) =>
          sendEmail({
            to: r.userEmail!,
            subject: `Reminder: "${r.eventTitle}" is today!`,
            html: `
              <p>Hi${r.userName ? ` ${r.userName}` : ""},</p>
              <p>This is a friendly reminder that you are registered for <strong>${r.eventTitle}</strong> today.</p>
              <p><strong>Time:</strong> ${r.startTime} – ${r.endTime}</p>
              <p>We look forward to seeing you there!</p>
              <p>— The Thrive Team</p>
            `,
          }),
        ),
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
