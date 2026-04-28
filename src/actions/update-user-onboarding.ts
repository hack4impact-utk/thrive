"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db";
import { users } from "@/db/schema";
import getUserSession from "@/utils/auth/get-user-session";

export async function updateUserOnboarding(
  targetUserId: string,
  onboarded: boolean,
): Promise<void> {
  const session = await getUserSession();
  const callerRole = session?.user?.role;

  if (callerRole !== "admin" && callerRole !== "manager") {
    throw new Error("Unauthorized");
  }

  await db.update(users).set({ onboarded }).where(eq(users.id, targetUserId));

  revalidatePath("/dashboard/user-management");
}
