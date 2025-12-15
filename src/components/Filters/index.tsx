/* 
    This is the filters bar. 
    Has a few basic dropdowns, and a button that opens a card for more filter options.
*/
"use client";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import MapIcon from "@mui/icons-material/Map";
import { Box, Button, ButtonGroup, IconButton } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";

import Dropdown from "./dropdown-menu";
import FiltersModal from "./modal";

export default function Filters(): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const [event, setEvent] = React.useState("");
  const [slot, setSlots] = React.useState("");
  const events = [
    "Cornestone/Westland",
    "Spring Semester Meal Train",
    "Kappa Kappa Gamma Opportunities",
    "Etc",
  ];
  const slots = ["1", "2", "3"];
  const handleChangeEvent = (event: SelectChangeEvent): void => {
    setEvent(event.target.value as string);
  };
  const handleChangeSlot = (event: SelectChangeEvent): void => {
    setSlots(event.target.value as string);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "70%",
          justifySelf: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "60%",
            alignItems: "center",
          }}
        >
          <Dropdown
            label="Events"
            value={event}
            options={events}
            onChange={handleChangeEvent}
          />
          <Dropdown
            label="Slots"
            value={slot}
            options={slots}
            onChange={handleChangeSlot}
          />
          <Button
            size="large"
            variant="outlined"
            sx={{ color: "GrayText", borderColor: "#0000003B" }}
            onClick={() => setOpen(true)}
          >
            Filters
          </Button>
        </Box>
        <ButtonGroup variant="outlined">
          <IconButton>
            <FormatListBulletedIcon sx={{ color: "#000000" }} />
          </IconButton>
          <IconButton>
            <MapIcon sx={{ color: "#000000" }} />
          </IconButton>
          <IconButton>
            <CalendarMonthIcon sx={{ color: "#000000" }} />
          </IconButton>
        </ButtonGroup>
      </Box>
      <FiltersModal open={open} setOpen={setOpen} />
    </Box>
  );
}
