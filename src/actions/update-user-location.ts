"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import db from "@/db";
import { users } from "@/db/schema";
import getUserSession from "@/utils/auth/get-user-session";

export async function updateUserLocation(
  targetUserId: string,
  locationId: string | null,
): Promise<void> {
  const session = await getUserSession();

  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await db.update(users).set({ locationId }).where(eq(users.id, targetUserId));

  revalidatePath("/dashboard/user-management");
}
