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
        {Array.from({ length: dayOffset }).map((_, index) => (
          <Grid key={`offset-${index}`} size={1}>
            <Box />
          </Grid>
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, index) => (
          <Grid
            key={`day-${index + 1}`}
            size={1}
            sx={{ border: "1px solid gray" }}
          >
            <DayCell day={index + 1} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
