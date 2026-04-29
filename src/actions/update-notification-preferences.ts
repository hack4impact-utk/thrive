"use server";

import { eq } from "drizzle-orm";

import db from "@/db";
import { userInfo } from "@/db/schema/user-info";
import getUserSession from "@/utils/auth/get-user-session";

type Payload = {
  emailRegistrationReminder: boolean;
  emailUnregistrationReminder: boolean;
  emailDayOfReminder: boolean;
};

export async function updateNotificationPreferences(
  data: Payload,
): Promise<void> {
  const session = await getUserSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db
    .update(userInfo)
    .set(data)
    .where(eq(userInfo.userId, session.user.id));
}
