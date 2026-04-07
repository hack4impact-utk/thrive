import type { Session } from "next-auth";
import { getServerSession } from "next-auth";

import authOptions from "@/app/api/auth/[...nextauth]/auth-options";

export async function auth(): Promise<Session | null> {
  return getServerSession(authOptions);
}
