"use server";

import { eq, InferInsertModel } from "drizzle-orm";

import db from "@/db";
import { userInfo } from "@/db/schema/user-info";
import { users } from "@/db/schema/users";
import getUserSession from "@/utils/auth/get-user-session";

type Payload = Omit<InferInsertModel<typeof userInfo>, "userId">;

export async function addUserInfo(data: Payload): Promise<void> {
  const session = await getUserSession();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db.insert(userInfo).values({
    userId: session.user.id,
    ...data,
  });

  await db
    .update(users)
    .set({ infoFilled: true })
    .where(eq(users.id, session.user.id));
}
