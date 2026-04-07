import { signOut } from "next-auth/react";

export const handleLogout = (callbackUrl?: string): void => {
  if (callbackUrl) {
    void signOut({ callbackUrl });
  } else {
    void signOut();
  }
};
