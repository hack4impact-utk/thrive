import { Box, Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function Dropdown(): React.ReactElement {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          Tester Tester
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              "aria-labelledby": "basic-button",
            },
          }}
        >
          <MenuItem
            onClick={() => {
              router.push("/update-profile");
              handleClose();
            }}
          >
            Update Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push("/change-password");
              handleClose();
            }}
          >
            Change Password
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push("/manage-affiliations");
              handleClose();
            }}
          >
            Manage Affiliations
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push("/view-hours");
              handleClose();
            }}
          >
            View Hours
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push("/notification-settings");
              handleClose();
            }}
          >
            Notification Settings
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push("/language");
              handleClose();
            }}
          >
            Language
          </MenuItem>
          <MenuItem
            onClick={() => {
              router.push("/sign-out");
              handleClose();
            }}
          >
            Sign Out
          </MenuItem>
        </Menu>
      </div>
    </Box>
  );
}
