"use client";
import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import * as React from "react";

import CreateEventDropdown from "@/components/layout/Header/CreateEventDropdown";
import ProfileDropdown from "@/components/layout/Header/ProfileDropdown";
import { AuthButton, DefaultButton } from "@/components/ui/Button";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },

  width: "auto",

  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

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
            ml: { xs: 0, sm: "10%" },
            mr: { xs: 0, sm: "10%" },
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
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>

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
