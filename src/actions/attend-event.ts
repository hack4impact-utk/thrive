"use server";

import { and, count, eq } from "drizzle-orm";

import db from "@/db";
import { eventAttendees, events } from "@/db/schema";
import { userInfo } from "@/db/schema/user-info";
import {
  buildEmailHtml,
  formatEmailDate,
  formatEmailTime,
  sendEmail,
} from "@/lib/email";
import getUserSession from "@/utils/auth/get-user-session";

export async function attendEvent(eventId: string): Promise<void> {
  const session = await getUserSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const event = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .then((res) => res[0]);

  if (!event) {
    throw new Error("Event not found");
  }

  const [{ preCount }] = await db
    .select({ preCount: count() })
    .from(eventAttendees)
    .where(eq(eventAttendees.eventId, eventId));

  if (event.capacity !== null && preCount >= event.capacity) {
    throw new Error("Event capacity reached");
  }

  const inserted = await db
    .insert(eventAttendees)
    .values({ eventId, userId: session.user.id })
    .onConflictDoNothing()
    .returning();

  if (inserted.length === 0) return;

  const [{ liveCount }] = await db
    .select({ liveCount: count() })
    .from(eventAttendees)
    .where(eq(eventAttendees.eventId, eventId));

  if (event.capacity !== null && liveCount > event.capacity) {
    await db
      .delete(eventAttendees)
      .where(
        and(
          eq(eventAttendees.eventId, eventId),
          eq(eventAttendees.userId, session.user.id),
        ),
      );
    throw new Error("Event capacity reached");
  }

  await db
    .update(events)
    .set({ registeredUsers: liveCount })
    .where(eq(events.id, eventId));

  const info = await db.query.userInfo.findFirst({
    where: eq(userInfo.userId, session.user.id),
    columns: { emailRegistrationReminder: true },
  });

  if (session.user.email && info?.emailRegistrationReminder !== false) {
    await sendEmail({
      to: session.user.email,
      subject: `You're registered for "${event.title}"!`,
      html: buildEmailHtml(`
        <p style="margin:0 0 8px;font-size:16px;color:#22305B;font-weight:600;">
          Hi${session.user.name ? ` ${session.user.name}` : ""},
        </p>
        <p style="margin:0 0 24px;font-size:15px;color:#444444;line-height:1.6;">
          You're all set! You have successfully registered for the event below.
        </p>

        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#f7faf9;border-left:4px solid #22A27E;border-radius:4px;padding:20px;margin-bottom:24px;">
          <tr>
            <td>
              <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#22305B;">
                ${event.title}
              </p>
              <p style="margin:0 0 6px;font-size:14px;color:#555555;">
                <strong style="color:#22305B;">Date:</strong>&nbsp;${formatEmailDate(event.eventDate)}
              </p>
              <p style="margin:0;font-size:14px;color:#555555;">
                <strong style="color:#22305B;">Time:</strong>&nbsp;${formatEmailTime(event.startTime)} – ${formatEmailTime(event.endTime)}
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:0;font-size:15px;color:#444444;line-height:1.6;">
          We look forward to seeing you there!
        </p>
      `),
    }).catch(console.error);
  }
}
