"use server";

import { and, count, eq } from "drizzle-orm";

import db from "@/db";
import { eventAttendees, events } from "@/db/schema";
import { userInfo } from "@/db/schema/user-info";
import { buildEmailHtml, sendEmail } from "@/lib/email";
import getUserSession from "@/utils/auth/get-user-session";

export async function leaveEvent(eventId: string): Promise<void> {
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
  const attendeeCount = await db
    .select({ count: count() })
    .from(eventAttendees)
    .where(eq(eventAttendees.eventId, eventId));

  const newCount = attendeeCount[0].count - 1;

  await db
    .update(events)
    .set({ registeredUsers: newCount })
    .where(eq(events.id, eventId));

  await db
    .delete(eventAttendees)
    .where(
      and(
        eq(eventAttendees.eventId, eventId),
        eq(eventAttendees.userId, session.user.id),
      ),
    );

  const info = await db.query.userInfo.findFirst({
    where: eq(userInfo.userId, session.user.id),
    columns: { emailUnregistrationReminder: true },
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
              <p style="margin:0;font-size:18px;font-weight:700;color:#22305B;">
                ${event.title}
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
}
