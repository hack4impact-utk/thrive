"use server";

import { eq, InferInsertModel } from "drizzle-orm";

import db from "@/db";
import { userInfo } from "@/db/schema/user-info";
import { users } from "@/db/schema/users";
import { auth } from "@/lib/auth";

type Payload = Omit<InferInsertModel<typeof userInfo>, "userId"> & { email?: string };

export async function addUserInfo(data: Payload): Promise<void> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Remving email field 
  const { email, ...rest } = data;

  await db.insert(userInfo).values({
    userId: session.user.id,
    ...rest,
  });

  await db
    .update(users)
    .set({
      infoFilled: true,
      ...(email ? { email: email.trim() } : {}),
    })
    .where(eq(users.id, session.user.id));
}
