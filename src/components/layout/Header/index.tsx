"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import * as React from "react";

import CreateEventDropdown from "@/components/layout/Header/CreateEventDropdown";
import ProfileDropdown from "@/components/layout/Header/ProfileDropdown";
import { AuthButton, DefaultButton } from "@/components/ui/Button";

export default function Header(): React.ReactElement {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const canCreate = role === "admin" || role === "manager";
  const headerColor = { admin: "secondary.main", manager: "#466d50" };
  const fontColor = { admin: "#ffffff", manager: "secondary.main" };
  const appBarSx =
    role && role in headerColor
      ? { backgroundColor: headerColor[role as keyof typeof headerColor] }
      : { backgroundColor: "#fff" };

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <AppBar position="static" sx={appBarSx}>
        <Toolbar
          sx={{
            width: "100%",
            maxWidth: 900,
            mx: "auto",
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Link href="/">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Image
                    src="/logo.svg"
                    alt="Thrive logo"
                    width={35}
                    height={35}
                  />
                </Box>
              </Link>
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  display: { xs: "none", md: "flex" },
                  fontSize: ".9rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  flexGrow: 1,
                  color: fontColor[role as keyof typeof fontColor] || "#22305B",
                }}
              >
                THRIVE
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {canCreate && <CreateEventDropdown />}

            {status === "authenticated" ? (
              <Box sx={{ flexShrink: 0 }}>
                <ProfileDropdown />
              </Box>
            ) : (
              <>
                <AuthButton label="Sign In" />
                <DefaultButton
                  label="Create account"
                  href="/create-account"
                  bgcolor="inherit"
                  color="primary"
                />
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
