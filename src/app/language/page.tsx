import { Box, Typography } from "@mui/material";
import React from "react";

export default function Language(): React.ReactElement {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "secondary.main",
          color: "white",
          px: 10,
          py: 5,
          width: "100%",
          marginTop: 0,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 400 }}>
          Language
        </Typography>
      </Box>

      <Box
        sx={{
          color: "black",
          px: 10,
          py: 5,
          width: "100%",
        }}
      >
        <Typography variant="body1">Language will go here later</Typography>
      </Box>
    </>
  );
}
