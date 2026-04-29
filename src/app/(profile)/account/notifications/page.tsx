import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import React from "react";

import db from "@/db";
import { userInfo } from "@/db/schema/user-info";
import getUserSession from "@/utils/auth/get-user-session";

import NotificationsForm from "./NotificationsForm";

export default async function NotificationsPage(): Promise<React.ReactElement> {
  const session = await getUserSession();

  if (!session?.user?.id) {
    notFound();
  }

  const info = await db.query.userInfo.findFirst({
    where: eq(userInfo.userId, session.user.id),
  });

  if (!info) {
    notFound();
  }

  return (
    <NotificationsForm
      initialValues={{
        emailRegistrationReminder: info.emailRegistrationReminder,
        emailUnregistrationReminder: info.emailUnregistrationReminder,
        emailDayOfReminder: info.emailDayOfReminder,
      }}
    />
  );
}
