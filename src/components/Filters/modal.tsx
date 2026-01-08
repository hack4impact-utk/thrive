/* This is a card with all the filter options on it. 
    Needs open/close information passed in as a prop from 
    where it is being used. */

"use client";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";

import CheckboxesGroup from "./check-boxes";
import DatePickerValue from "./date-picker";
import Dropdown from "./dropdown-menu";

type FiltersModalProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
type CheckedStateDays = {
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
};

type CheckedStateTime = {
  morning: boolean;
  afternoon: boolean;
};

const days = [
  { option: "sunday", label: "Sunday" },
  { option: "monday", label: "Monday" },
  { option: "tuesday", label: "Tuesday" },
  { option: "wednesday", label: "Wednesday" },
  { option: "thursday", label: "Thursday" },
  { option: "friday", label: "Friday" },
  { option: "saturday", label: "Saturday" },
] as const;

const times = [
  { option: "morning", label: "Morning" },
  { option: "afternoon", label: "Afternoon" },
] as const;

export default function FiltersModal({
  open,
  setOpen,
}: FiltersModalProps): React.ReactElement {
  const [location, setLocation] = React.useState("");
  const locations = ["290 your house", "sample location", "etc"];
  const handleChangeLocation = (event: SelectChangeEvent): void => {
    setLocation(event.target.value as string);
  };
  const [checkedDay, setCheckedDay] = React.useState<CheckedStateDays>({
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
  });
  const [checkedTime, setCheckedTime] = React.useState<CheckedStateTime>({
    morning: false,
    afternoon: false,
  });
  return (
    <Box>
      {open && (
        <Card
          sx={{
            maxWidth: "70%",
            alignContent: "center",
            margin: "auto",
            borderRadius: 0,
            marginTop: 5,
          }}
        >
          <Box
            sx={{
              alignItems: "center",
              bgcolor: "secondary.main",
              height: 80,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              color="#FFFFFF"
              variant="h6"
              sx={{ ml: "3%", fontWeight: "lighter", fontSize: ".9rem" }}
            >
              MORE FILTERS
            </Typography>
            <IconButton
              sx={{ mr: "1%", color: "#FFFFFF" }}
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <CardContent>
            <Typography sx={{ fontWeight: "bold" }}>Date Range</Typography>
            <Box>
              <DatePickerValue />
            </Box>
            <Typography sx={{ fontWeight: "bold", pt: "1%" }}>
              Location
            </Typography>
            <Box sx={{ width: "65%", pt: "1%" }}>
              <Dropdown
                label="location"
                value={location}
                options={locations}
                onChange={handleChangeLocation}
              />
            </Box>
            <Box sx={{ pb: "2%" }}>
              <Typography sx={{ fontWeight: "bold", pt: "1%" }}>
                Day of Week
              </Typography>
              <CheckboxesGroup
                checked={checkedDay}
                setChecked={setCheckedDay}
                options={days}
              />
              <Typography sx={{ fontWeight: "bold", pt: "1%" }}>
                Time of Day
              </Typography>
              <CheckboxesGroup
                checked={checkedTime}
                setChecked={setCheckedTime}
                options={times}
              />
            </Box>
            <Divider />
          </CardContent>
          <CardActions>
            <Box
              sx={{
                justifyContent: "flex-end",
                display: "flex",
                width: "100%",
                pr: "3%",
                pb: "2%",
              }}
            >
              <Button sx={{ pr: "1%" }}>Clear above</Button>
              <Button
                sx={{ bgcolor: "primary.main", color: "#FFF" }}
                onClick={() => setOpen(false)}
              >
                Save
              </Button>
            </Box>
          </CardActions>
        </Card>
      )}
    </Box>
  );
}
