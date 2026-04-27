"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db";
import { users } from "@/db/schema";
import getUserSession from "@/utils/auth/get-user-session";

export type Role = "user" | "kiosk" | "manager" | "admin";

const ALLOWED_ROLES: Role[] = ["user", "kiosk", "manager", "admin"];

export async function updateUserRole(
  targetUserId: string,
  newRole: Role,
): Promise<void> {
  const session = await getUserSession();
  const callerRole = session?.user?.role;

  if (callerRole !== "admin" && callerRole !== "manager") {
    throw new Error("Unauthorized");
  }

  if (callerRole === "manager" && newRole === "admin") {
    throw new Error("Managers cannot promote users to admin");
  }

  if (!ALLOWED_ROLES.includes(newRole)) {
    throw new Error("Invalid role");
  }

  await db.update(users).set({ role: newRole }).where(eq(users.id, targetUserId));

  revalidatePath("/dashboard/user-management");
}
