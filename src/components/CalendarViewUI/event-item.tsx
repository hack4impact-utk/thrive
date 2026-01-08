import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function EventItem(): React.ReactElement {
  return (
    <Box sx={{ padding: 1 }}>
      {/* Time */}
      <Typography sx={{ fontWeight: "bold" }}>3 PM – 6 PM</Typography>
      {/* Event Title */}
      <Typography sx={{ color: "primary.main" }}>
        Main Campus All Day Volunteer
      </Typography>
    </Box>
  );
}
