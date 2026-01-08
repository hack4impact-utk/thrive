"use client";
import SearchIcon from "@mui/icons-material/Search";
import { MenuItem } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import Popover from "@mui/material/Popover";
import { alpha, styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import * as React from "react";

import AuthButton from "../AuthButton";
import DefaultButton from "../DefaultButton";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
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

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

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
        <Toolbar>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              flexGrow: 1,
              ml: "10%",
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
                href="#app-bar-with-responsive-menu"
                sx={{
                  ml: 1,
                  mr: 2,
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

          <Box sx={{ display: "flex", alignItems: "center", mr: "10%" }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            {status === "authenticated" ? (
              <>
                <Box
                  aria-describedby={id}
                  onClick={handleClick}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: 2,
                    borderColor: "primary.main",
                    cursor: "pointer",
                    ml: 1,

                    "&:hover": {
                      borderColor: "primary.dark",
                    },
                  }}
                >
                  {session?.user?.image && (
                    <Image
                      src={session.user.image}
                      width={32}
                      height={32}
                      alt="User avatar"
                    />
                  )}
                </Box>
                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    onClick={async () => {
                      handleClose();
                      await signOut({ callbackUrl: "/" });
                    }}
                  >
                    Log out
                  </MenuItem>
                </Popover>
              </>
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
