import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import EventItem from "./EventItem";

export default function DayCell({ day }: { day: number }): React.ReactElement {
  return (
    <div>
      <Box
        sx={{
          bgcolor: "white",
        }}
      >
        <Typography sx={{ padding: 1, fontWeight: "1" }}>{day}</Typography>
        <EventItem />
        <EventItem />
        <EventItem />
      </Box>
    </div>
  );
}
