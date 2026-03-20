import { MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useRef, useState } from "react";

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
          onClick={() => {
            void router.push("/account/update-profile");
            handleClose();
          }}
        >
          Update Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            void router.push("/account/change-password");
            handleClose();
          }}
        >
          Change Password
        </MenuItem>
        <MenuItem
          onClick={() => {
            void router.push("/account/manage-affiliations");
            handleClose();
          }}
        >
          Manage Affiliations
        </MenuItem>
        <MenuItem
          onClick={() => {
            void router.push("/account/view-hours");
            handleClose();
          }}
        >
          View Hours
        </MenuItem>
        <MenuItem
          onClick={() => {
            void router.push("/account/notification-settings");
            handleClose();
          }}
        >
          Notification Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            void signOut({ callbackUrl: "/" });
            handleClose();
          }}
        >
          Log out
        </MenuItem>
      </Popover>
    </>
  );
}
