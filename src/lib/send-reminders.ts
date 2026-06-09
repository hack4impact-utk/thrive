import { and, eq } from "drizzle-orm";

import db from "@/db";
import { eventAttendees, events, locations, users } from "@/db/schema";
import { userInfo } from "@/db/schema/user-info";
import {
  buildEmailHtml,
  formatEmailDate,
  formatEmailTime,
  sendEmail,
} from "@/lib/email";

export async function sendDailyReminders(): Promise<{
  sent: number;
  skipped: number;
}> {
  const today = new Date().toISOString().slice(0, 10);

  const registrations = await db
    .select({
      userName: users.name,
      userEmail: users.email,
      eventTitle: events.title,
      eventDate: events.eventDate,
      startTime: events.startTime,
      endTime: events.endTime,
      emailDayOfReminder: userInfo.emailDayOfReminder,
      locationStreetLine: locations.streetLine,
      locationCity: locations.city,
      locationState: locations.state,
      locationPostalCode: locations.postalCode,
    })
    .from(eventAttendees)
    .innerJoin(events, eq(eventAttendees.eventId, events.id))
    .innerJoin(users, eq(eventAttendees.userId, users.id))
    .leftJoin(userInfo, eq(userInfo.userId, users.id))
    .leftJoin(locations, eq(events.locationId, locations.id))
    .where(and(eq(events.eventDate, today), eq(events.deleted, false)));

  const eligible = registrations.filter(
    (r) => !!r.userEmail && r.emailDayOfReminder !== false,
  );

  const skipped = registrations.length - eligible.length;

  await Promise.allSettled(
    eligible.map((r) =>
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
                <p style="margin:0 0 6px;font-size:14px;color:#555555;">
                  <strong style="color:#22305B;">Date:</strong>&nbsp;${formatEmailDate(r.eventDate)}
                </p>
                <p style="margin:0 0 6px;font-size:14px;color:#555555;">
                  <strong style="color:#22305B;">Time:</strong>&nbsp;${formatEmailTime(r.startTime)} – ${formatEmailTime(r.endTime)}
                </p>
                ${
                  r.locationStreetLine
                    ? `<p style="margin:0;font-size:14px;color:#555555;">
                  <strong style="color:#22305B;">Location:</strong>&nbsp;${r.locationStreetLine}, ${r.locationCity}, ${r.locationState} ${r.locationPostalCode}
                </p>`
                    : ""
                }
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

  return { sent: eligible.length, skipped };
}
