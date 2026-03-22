"use client";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MapIcon from "@mui/icons-material/Map";
import { Box, ButtonGroup, IconButton } from "@mui/material";
import * as React from "react";

import CalendarView from "./CalendarView";
import MapView from "./MapView";
import TempListView from "./TempListView";
import { View } from "./view-types";

export default function ToggleViews(): React.ReactElement {
  const [activeView, setActiveView] = React.useState<View>("list");
  const toggleView = (view: View): void => {
    setActiveView((current) => (current === view ? null : view));
  };

  return (
    <Box>
      <Box>
        <ButtonGroup
          variant="outlined"
          sx={{
            borderRadius: 1,
            overflow: "hidden",
            border: "1px solid #0000003B",
          }}
        >
          <IconButton
            onClick={() => toggleView("list")}
            sx={{
              borderRadius: 0,
              borderRight: "1px solid rgba(0,0,0,0.12)",

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
              borderRadius: 0,
              borderRight: "1px solid rgba(0,0,0,0.12)",

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
              borderRadius: 0,
              borderRight: "none",

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
        <TempListView activeView={activeView} />
        <MapView activeView={activeView} />
        <CalendarView activeView={activeView} />
      </Box>
    </Box>
  );
}
