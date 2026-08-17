"use server";

import { and, count, eq } from "drizzle-orm";

import db from "@/db";
import { eventAttendees, events, locations } from "@/db/schema";
import { userInfo } from "@/db/schema/user-info";
import {
  buildEmailHtml,
  escapeEmailHtml,
  formatEmailDate,
  formatEmailTime,
  sendEmail,
} from "@/lib/email";
import { getStaffNotificationEmails } from "@/lib/staff-notification-recipients";
import getUserSession from "@/utils/auth/get-user-session";

export async function leaveEvent(eventId: string): Promise<void> {
  const session = await getUserSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const result = await db
    .select()
    .from(events)
    .leftJoin(locations, eq(events.locationId, locations.id))
    .where(eq(events.id, eventId))
    .then((res) => res[0]);

  const event = result?.events;
  const location = result?.locations;

  if (!event) {
    throw new Error("Event not found");
  }

  const removed = await db
    .delete(eventAttendees)
    .where(
      and(
        eq(eventAttendees.eventId, eventId),
        eq(eventAttendees.userId, session.user.id),
      ),
    )
    .returning();

  if (removed.length === 0) return;

  const [{ liveCount }] = await db
    .select({ liveCount: count() })
    .from(eventAttendees)
    .where(eq(eventAttendees.eventId, eventId));

  await db
    .update(events)
    .set({ registeredUsers: liveCount })
    .where(eq(events.id, eventId));

  const info = await db.query.userInfo.findFirst({
    where: eq(userInfo.userId, session.user.id),
    columns: {
      emailUnregistrationReminder: true,
      firstName: true,
      lastName: true,
    },
  });

  if (session.user.email && info?.emailUnregistrationReminder !== false) {
    await sendEmail({
      to: session.user.email,
      subject: `You've unregistered from "${event.title}"`,
      html: buildEmailHtml(`
        <p style="margin:0 0 8px;font-size:16px;color:#22305B;font-weight:600;">
          Hi${session.user.name ? ` ${session.user.name}` : ""},
        </p>
        <p style="margin:0 0 24px;font-size:15px;color:#444444;line-height:1.6;">
          You have been successfully unregistered from the following event:
        </p>

        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#fdf7f7;border-left:4px solid #d9534f;border-radius:4px;padding:20px;margin-bottom:24px;">
          <tr>
            <td>
              <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#22305B;">
                ${event.title}
              </p>
              <p style="margin:0;font-size:14px;color:#555555;">
                <strong style="color:#22305B;">Date:</strong>&nbsp;${formatEmailDate(event.eventDate)}
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:0;font-size:15px;color:#444444;line-height:1.6;">
          If this was a mistake, you can re-register anytime on the
          <a href="https://thrive.utkh4i.com" style="color:#22A27E;text-decoration:none;font-weight:600;">Thrive volunteer site</a>.
        </p>
      `),
    }).catch(console.error);
  }

  const recipientEmails = await getStaffNotificationEmails(
    event.locationId,
    "unregistration",
  );
  const attendeeName = info
    ? `${info.firstName} ${info.lastName}`
    : (session.user.name ?? "A volunteer");
  const attendeeEmail = session.user.email
    ? escapeEmailHtml(session.user.email)
    : "Not provided";

  await Promise.allSettled(
    recipientEmails.map((email) =>
      sendEmail({
        to: email,
        subject: `Unregistration from "${event.title}"`,
        html: buildEmailHtml(`
          <p style="margin:0 0 8px;font-size:16px;color:#22305B;font-weight:600;">
            Event unregistration
          </p>
          <p style="margin:0 0 24px;font-size:15px;color:#444444;line-height:1.6;">
            ${escapeEmailHtml(attendeeName)} has unregistered from the following event.
          </p>

          <table width="100%" cellpadding="0" cellspacing="0"
                 style="background:#fdf7f7;border-left:4px solid #d9534f;border-radius:4px;padding:20px;margin-bottom:24px;">
            <tr>
              <td>
                <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#22305B;">
                  ${escapeEmailHtml(event.title)}
                </p>
                <p style="margin:0 0 6px;font-size:14px;color:#555555;">
                  <strong style="color:#22305B;">Volunteer:</strong>&nbsp;${escapeEmailHtml(attendeeName)}
                </p>
                <p style="margin:0 0 6px;font-size:14px;color:#555555;">
                  <strong style="color:#22305B;">Email:</strong>&nbsp;${attendeeEmail}
                </p>
                <p style="margin:0 0 6px;font-size:14px;color:#555555;">
                  <strong style="color:#22305B;">Date:</strong>&nbsp;${formatEmailDate(event.eventDate)}
                </p>
                <p style="margin:0 0 6px;font-size:14px;color:#555555;">
                  <strong style="color:#22305B;">Time:</strong>&nbsp;${formatEmailTime(event.startTime)} &ndash; ${formatEmailTime(event.endTime)}
                </p>
                ${
                  location
                    ? `<p style="margin:0 0 6px;font-size:14px;color:#555555;">
                  <strong style="color:#22305B;">Location:</strong>&nbsp;${escapeEmailHtml(location.name)} &mdash; ${escapeEmailHtml(location.streetLine)}, ${escapeEmailHtml(location.city)}, ${escapeEmailHtml(location.state)} ${escapeEmailHtml(location.postalCode)}
                </p>`
                    : ""
                }
                <p style="margin:0;font-size:14px;color:#555555;">
                  <strong style="color:#22305B;">Total registered:</strong>&nbsp;${liveCount}
                </p>
              </td>
            </tr>
          </table>
        `),
      }),
    ),
  );
}
