import { Box, Typography } from "@mui/material";

export default function VolunteerEventCardHeader(): React.ReactElement {
  const weekday = "Tuesday";
  const formattedDate = "1/2/2026";

  return (
    <Box
      sx={{
        backgroundColor: "secondary.main",
        color: "white",
        px: 2,
        py: 1.5,
        width: "100%",
        marginTop: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {weekday}, {formattedDate}
      </Typography>
    </Box>
  );
}
