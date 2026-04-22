import { Box, Typography } from "@mui/material";
import React from "react";

import PageContainer from "@/components/layout/PageContainer";

export default function UpdateProfile(): React.ReactElement {
  return (
    <PageContainer>
      <Box
        sx={{
          backgroundColor: "secondary.main",
          color: "white",
          py: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 400 }}>
          Change Password
        </Typography>
      </Box>

      <Box sx={{ color: "black", py: 5 }}>
        <Typography variant="body1">
          Change Password will go here later
        </Typography>
      </Box>
    </PageContainer>
  );
}
