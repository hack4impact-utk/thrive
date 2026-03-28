"use server";

import { eq } from "drizzle-orm";

import db from "@/db";
import { userInfo } from "@/db/schema/user-info";
import { users } from "@/db/schema/users";
import { auth } from "@/lib/auth";

type UserInfoWithEmail = typeof userInfo.$inferSelect & { email: string | null };

export default async function getUserInfo(): Promise<UserInfoWithEmail | null> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const userInfoData = await db
      .select()
      .from(userInfo)
      .where(eq(userInfo.userId, session.user.id))
      .limit(1);

    if (!userInfoData[0]) {
      return null;
    }

    const userData = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    return {
      ...userInfoData[0],
      email: userData[0]?.email ?? null,
    };
  } catch (error) {
    console.error("GET USER INFO ERROR:", error);
    throw error;
  }
}
