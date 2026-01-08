"use client";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MapIcon from "@mui/icons-material/Map";
import { Box, ButtonGroup, IconButton } from "@mui/material";
import * as React from "react";

import CalendarView from "./calendar-view";
import ListView from "./list-view";
import MapView from "./map-view";
import { View } from "./view-types";

export default function ToggleViews(): React.ReactElement {
  const [activeView, setActiveView] = React.useState<View>(null);
  const toggleView = (view: View): void => {
    setActiveView((current) => (current === view ? null : view));
  };

  return (
    <Box>
      <Box>
        <ButtonGroup variant="outlined">
          <IconButton
            onClick={() => toggleView("list")}
            sx={{
              backgroundColor:
                activeView === "list" ? "#E0E0E0" : "transparent",
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
      <Box>
        <ListView activeView={activeView} />
        <MapView activeView={activeView} />
        <CalendarView activeView={activeView} />
      </Box>
    </Box>
  );
}
