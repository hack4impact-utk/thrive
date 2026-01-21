import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ReactNode } from "react";

import Header from "@/app/Header";
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

export default function RootLayout({ children }: RootLayoutProps): ReactNode {
  return (
    <html lang="en" className={roboto.variable}>
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
