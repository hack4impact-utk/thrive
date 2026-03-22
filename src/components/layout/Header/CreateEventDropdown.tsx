"use client";

import AddIcon from "@mui/icons-material/Add";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Button, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function CreateEventDropdown(): React.ReactElement {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string): void => {
    handleClose();
    router.push(path);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        startIcon={<AddIcon />}
        endIcon={<ArrowDropDownIcon />}
        variant="contained"
        sx={{
          ml: 2,
          mr: 2,
          minHeight: 30,
          px: 2,
          textTransform: "none",
          bgcolor: "#22A27E",
        }}
      >
        Create
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
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
        <MenuItem onClick={() => handleNavigate("/dashboard/create-event")}>
          One-time Event
        </MenuItem>

        <MenuItem onClick={() => handleNavigate("/dashboard/recurring-event")}>
          Recurring Event
        </MenuItem>
      </Menu>
    </>
  );
}
