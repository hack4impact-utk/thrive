/* Date Picker */
/* Creates two boxes that allow the user to enter a beginning date and end date */

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import * as React from "react";

export default function DateRangePicker(): React.ReactElement {
  const [start, setStart] = React.useState<Dayjs | null>(null);
  const [end, setEnd] = React.useState<Dayjs | null>(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" gap={2} sx={{ alignItems: "center", pt: "1%" }}>
        <DatePicker
          label="Start Date"
          value={start}
          onChange={(newValue) => setStart(newValue)}
        />
        <Typography sx={{ color: "GrayText" }}>TO</Typography>
        <DatePicker
          label="End Date"
          value={end}
          onChange={(newValue) => setEnd(newValue)}
        />
      </Box>
    </LocalizationProvider>
  );
}
