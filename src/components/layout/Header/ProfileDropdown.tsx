import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";

import { handleLogout } from "@/utils/auth/handle-logout";

export default function ProfileDropdown(): React.ReactElement {
  const router = useRouter();
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
    triggerRef.current?.focus();
  };

  const triggerRef = useRef<HTMLDivElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <>
      <Box
        ref={triggerRef}
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
            draggable={false}
          />
        )}
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        disableScrollLock
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {session?.user?.role === "kiosk" ? (
          <MenuItem
            onClick={() => {
              void router.push("/kiosk");
              handleClose();
            }}
          >
            Today&apos;s Events
          </MenuItem>
        ) : (
          <>
            <MenuItem
              onClick={() => {
                void router.push("/account/update-profile");
                handleClose();
              }}
            >
              Update profile
            </MenuItem>
            {(session?.user?.role === "user" ||
              session?.user?.role === "admin") && (
              <MenuItem
                onClick={() => {
                  void router.push("/account/manage-hours");
                  handleClose();
                }}
              >
                My hours
              </MenuItem>
            )}
          </>
        )}
        <MenuItem
          onClick={() => {
            handleLogout("/");
            handleClose();
          }}
        >
          Log out
        </MenuItem>
      </Popover>
    </>
  );
}
