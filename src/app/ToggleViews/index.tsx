"use client";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MapIcon from "@mui/icons-material/Map";
import { Box, ButtonGroup, IconButton } from "@mui/material";
import * as React from "react";

import { View } from "./view-types";

type ToggleViewsProps = {
  activeView: View;
  onViewChange: (view: View) => void;
};

export default function ToggleViews({
  activeView,
  onViewChange,
}: ToggleViewsProps): React.ReactElement {
  const toggleView = (view: View): void => {
    onViewChange(activeView === view ? null : view);
  };

  return (
    <Box>
      <ButtonGroup variant="outlined">
        <IconButton
          onClick={() => toggleView("list")}
          sx={{
            backgroundColor: activeView === "list" ? "#E0E0E0" : "transparent",
            "&:hover": {
              backgroundColor: activeView === "list" ? "#D3D3D3" : "#f5f5f5",
            },
          }}
        >
          <FormatListBulletedIcon sx={{ color: "#555555" }} />
        </IconButton>

        <IconButton
          onClick={() => toggleView("map")}
          sx={{
            backgroundColor: activeView === "map" ? "#E0E0E0" : "transparent",
            "&:hover": {
              backgroundColor: activeView === "map" ? "#D3D3D3" : "#f5f5f5",
            },
          }}
        >
          <MapIcon sx={{ color: "#555555" }} />
        </IconButton>

        <IconButton
          onClick={() => toggleView("calendar")}
          sx={{
            backgroundColor:
              activeView === "calendar" ? "#E0E0E0" : "transparent",
            "&:hover": {
              backgroundColor:
                activeView === "calendar" ? "#D3D3D3" : "#f5f5f5",
            },
          }}
        >
          <CalendarMonthIcon sx={{ color: "#555555" }} />
        </IconButton>
      </ButtonGroup>
    </Box>
  );
}
