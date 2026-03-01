/* 
    This is the filters bar. 
    Has a few basic dropdowns, and a button that opens a card for more filter options.
*/
"use client";
import { Box, Button } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";

import Dropdown from "./FiltersDropdown";
import FiltersModal from "./FiltersModal";

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
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          justifySelf: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
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
      </Box>
      <FiltersModal open={open} setOpen={setOpen} />
    </Box>
  );
}
