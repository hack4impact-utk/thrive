"use server";

import { eq } from "drizzle-orm";

import db from "@/db";
import { userInfo } from "@/db/schema/user-info";
import getUserSession from "@/utils/auth/get-user-session";

type Payload = {
  emailRegistrationReminder: boolean;
  emailUnregistrationReminder: boolean;
  emailDayOfReminder: boolean;
  emailStaffRegistrationNotifications: boolean;
  emailStaffUnregistrationNotifications: boolean;
};

export async function updateNotificationPreferences(
  data: Payload,
): Promise<void> {
  const session = await getUserSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const isStaff =
    session.user.role === "admin" || session.user.role === "manager";
  const preferences = isStaff
    ? data
    : {
        emailRegistrationReminder: data.emailRegistrationReminder,
        emailUnregistrationReminder: data.emailUnregistrationReminder,
        emailDayOfReminder: data.emailDayOfReminder,
      };

  await db
    .update(userInfo)
    .set(preferences)
    .where(eq(userInfo.userId, session.user.id));
}
