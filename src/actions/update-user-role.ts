"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db";
import { users } from "@/db/schema";
import getUserSession from "@/utils/auth/get-user-session";

export type Role = "user" | "kiosk" | "manager" | "admin";

const ALLOWED_ROLES = new Set<Role>(["user", "kiosk", "manager", "admin"]);
const LOCATION_ROLES = new Set<Role>(["manager", "kiosk"]);

export async function updateUserRole(
  targetUserId: string,
  newRole: Role,
  locationId?: string | null,
): Promise<void> {
  const session = await getUserSession();
  const callerRole = session?.user?.role;
  const callerId = session?.user?.id;

  if (callerRole !== "admin" && callerRole !== "manager") {
    throw new Error("Unauthorized");
  }

  if (callerRole === "manager" && newRole === "admin") {
    throw new Error("Managers cannot promote users to admin");
  }

  if (!ALLOWED_ROLES.has(newRole)) {
    throw new Error("Invalid role");
  }

  let resolvedLocationId: string | null = null;

  if (LOCATION_ROLES.has(newRole)) {
    if (callerRole === "manager") {
      const [caller] = await db
        .select({ locationId: users.locationId })
        .from(users)
        .where(eq(users.id, callerId!));
      resolvedLocationId = caller?.locationId ?? null;
    } else {
      resolvedLocationId = locationId ?? null;
    }
  }

  await db
    .update(users)
    .set({ role: newRole, locationId: resolvedLocationId })
    .where(eq(users.id, targetUserId));

  revalidatePath("/dashboard/user-management");
}
