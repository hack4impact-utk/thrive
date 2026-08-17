import { and, eq, isNotNull, isNull, or } from "drizzle-orm";

import db from "@/db";
import { userInfo, users } from "@/db/schema";

type StaffNotificationType = "registration" | "unregistration";

export async function getStaffNotificationEmails(
  locationId: string | null,
  notificationType: StaffNotificationType,
): Promise<string[]> {
  const staffRoleFilter = locationId
    ? or(
        eq(users.role, "admin"),
        and(eq(users.role, "manager"), eq(users.locationId, locationId)),
      )
    : eq(users.role, "admin");

  const preferenceColumn =
    notificationType === "registration"
      ? userInfo.emailStaffRegistrationNotifications
      : userInfo.emailStaffUnregistrationNotifications;

  const recipients = await db
    .select({ email: users.email })
    .from(users)
    .leftJoin(userInfo, eq(userInfo.userId, users.id))
    .where(
      and(
        isNotNull(users.email),
        staffRoleFilter,
        or(isNull(preferenceColumn), eq(preferenceColumn, true)),
      ),
    );

  return [
    ...new Set(
      recipients
        .map(({ email }) => email)
        .filter((email): email is string => email !== null),
    ),
  ];
}
