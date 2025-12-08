import { Box, Typography } from "@mui/material";
import React from "react";

export default function SignOut(): React.ReactElement {
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
          Sign Out
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
        <Typography variant="body1">Sign out will go here later</Typography>
      </Box>
    </>
  );
}
