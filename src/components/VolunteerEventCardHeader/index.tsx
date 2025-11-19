import { Box, Typography } from "@mui/material";

type Props = {
  date?: Date;
};

export default function VolunteerEventCardHeader({
  date = new Date(),
}: Props): React.ReactElement {
  const weekday = date.toLocaleString("en-US", { weekday: "long" });
  const formattedDate = date.toLocaleDateString("en-US");

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
