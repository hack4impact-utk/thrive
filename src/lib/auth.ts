import { getServerSession, Session } from "next-auth";

import authOptions from "@/app/api/auth/[...nextauth]/auth-options";

export const auth = (): Promise<Session | null> =>
  getServerSession(authOptions);
