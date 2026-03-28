"use server";

import { eq, InferInsertModel } from "drizzle-orm";

import db from "@/db";
import { userInfo } from "@/db/schema/user-info";
import { users } from "@/db/schema/users";
import { auth } from "@/lib/auth";

type UserInfoInsert = InferInsertModel<typeof userInfo>;
type Payload = Partial<Omit<UserInfoInsert, "userId">> & { email?: string };

export async function updateUserInfo(data: Payload): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!data || Object.keys(data).length === 0) {
    console.error("No data to update");
    return;
  }

  const { email, ...rest } = data;

  const safeData = {
    ...rest,
    addressLine2: rest.addressLine2?.trim() || null,
    preferredNeighborhood: rest.preferredNeighborhood?.trim() || null,
    gender: rest.gender?.trim() || null,
    shirtSize: rest.shirtSize?.trim() || null,
    medicalNotes: rest.medicalNotes?.trim() || null,
  };

  try {
    await db
      .update(userInfo)
      .set(safeData)
      .where(eq(userInfo.userId, session.user.id));

    if (email) {
      await db
        .update(users)
        .set({ email: email.trim() })
        .where(eq(users.id, session.user.id));
    }
  } catch (error: any) {
    console.error("UPDATE ERROR:", error);
    console.error("ERROR MESSAGE:", error?.message);
    console.error("ERROR CAUSE:", error?.cause);
    throw error;
  }
}
