import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import authOptions from "@/app/api/auth/[...nextauth]/auth-options";

export default async function getUserSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions);

  return session;
}
