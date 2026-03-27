"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import * as React from "react";

import AuthenticationActions from "@/components/layout/Header/AuthenticationActions";
import CreateEventDropdown from "@/components/layout/Header/CreateEventDropdown";

export default function Header(): React.ReactElement {
  const { data: session, status } = useSession();
  const role = session?.user?.role;
  const canCreate = role === "admin" || role === "manager";

  return (
    <Box
      sx={{
        flexGrow: 1,
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <AppBar position="static" color="default">
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
                  color: "#22305B",
                  textDecoration: "none",
                  flexGrow: 1,
                }}
              >
                THRIVE
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {canCreate && <CreateEventDropdown />}

            <AuthenticationActions status={status} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
