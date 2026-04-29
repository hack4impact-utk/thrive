import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import db from "@/db";
import { eventAttendees, events, users } from "@/db/schema";
import { userInfo } from "@/db/schema/user-info";
import { buildEmailHtml, formatEmailTime, sendEmail } from "@/lib/email";

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
        emailDayOfReminder: userInfo.emailDayOfReminder,
      })
      .from(eventAttendees)
      .innerJoin(events, eq(eventAttendees.eventId, events.id))
      .innerJoin(users, eq(eventAttendees.userId, users.id))
      .leftJoin(userInfo, eq(userInfo.userId, users.id))
      .where(and(eq(events.eventDate, today), eq(events.deleted, false)));

    await Promise.allSettled(
      registrations
        .filter((r) => !!r.userEmail && r.emailDayOfReminder !== false)
        .map((r) =>
          sendEmail({
            to: r.userEmail!,
            subject: `Reminder: "${r.eventTitle}" is today!`,
            html: buildEmailHtml(`
              <p style="margin:0 0 8px;font-size:16px;color:#22305B;font-weight:600;">
                Hi${r.userName ? ` ${r.userName}` : ""},
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#444444;line-height:1.6;">
                This is a friendly reminder that you are registered for an event happening <strong>today</strong>.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f7faf9;border-left:4px solid #22A27E;border-radius:4px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#22305B;">
                      ${r.eventTitle}
                    </p>
                    <p style="margin:0;font-size:14px;color:#555555;">
                      <strong style="color:#22305B;">Time:</strong>&nbsp;${formatEmailTime(r.startTime)} – ${formatEmailTime(r.endTime)}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:15px;color:#444444;line-height:1.6;">
                We look forward to seeing you there!
              </p>
            `),
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
