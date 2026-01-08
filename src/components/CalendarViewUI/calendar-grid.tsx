import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import DayCell from "./day-cell";

export default function CalendarGrid({
  daysInMonth,
  dayOffset = 0,
}: {
  daysInMonth: number;
  dayOffset?: number;
}): React.ReactElement {
  return (
    <div>
      <Grid
        container
        spacing={0}
        columns={7}
        sx={{ width: "100%", bgcolor: "lightgray" }}
      >
        <Grid size={1}>
          <Box
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "gray",
              padding: 1,
            }}
          >
            Sunday
          </Box>
        </Grid>
        <Grid size={1}>
          <Box
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "gray",
              padding: 1,
            }}
          >
            Monday
          </Box>
        </Grid>
        <Grid size={1}>
          <Box
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "gray",
              padding: 1,
            }}
          >
            Tuesday
          </Box>
        </Grid>
        <Grid size={1}>
          <Box
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "gray",
              padding: 1,
            }}
          >
            Wednesday
          </Box>
        </Grid>
        <Grid size={1}>
          <Box
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "gray",
              padding: 1,
            }}
          >
            Thursday
          </Box>
        </Grid>
        <Grid size={1}>
          <Box
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "gray",
              padding: 1,
            }}
          >
            Friday
          </Box>
        </Grid>
        <Grid size={1}>
          <Box
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              color: "gray",
              padding: 1,
            }}
          >
            Saturday
          </Box>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        columns={7}
        sx={{ width: "100%", bgcolor: "lightgray" }}
      >
        {/* Empty cells for offset */}
        {Array.from({ length: dayOffset })
          .fill("")
          .map((_, index) => (
            <Grid size={1}>
              <Box key={index}></Box>
            </Grid>
          ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth })
          .fill("")
          .map((_, index) => (
            <Grid sx={{ border: "1px solid gray" }} size={1}>
              <DayCell key={index + 1} day={index + 1}></DayCell>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
