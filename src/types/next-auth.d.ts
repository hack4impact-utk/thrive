/* eslint-disable @typescript-eslint/consistent-type-definitions */

import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      infoFilled: boolean;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    infoFilled: boolean;
    role: string;
  }
}
