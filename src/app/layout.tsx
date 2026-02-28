import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

import Header from "@/app/Header";
import db from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import NextAuthProvider from "@/providers/next-auth-provider";
import NotistackProvider from "@/providers/notistack-provider";
import theme from "@/styles/theme";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "thrive",
  description: "Volunteer management system for Thrive",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({
  children,
}: RootLayoutProps): Promise<ReactNode> {
  const session = await auth();
  if (session?.user) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);
    if (user && user.info_filled && !user.name) {
      await db
        .update(users)
        .set({ info_filled: false })
        .where(eq(users.id, session.user.id));
    }
    if (user && !user.info_filled) {
      await db
        .update(users)
        .set({ info_filled: true })
        .where(eq(users.id, session.user.id));
      redirect("/create-account/basic-info");
    }
  }
  return (
    <html lang="en" data-scroll-behavior="smooth" className={roboto.variable}>
      <body suppressHydrationWarning>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <NotistackProvider>
              <NextAuthProvider>
                <CssBaseline />
                <Header />
                {children}
              </NextAuthProvider>
            </NotistackProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
