import { Box, Typography } from "@mui/material";
import React from "react";

import PageContainer from "@/components/layout/PageContainer";

export default function ManageAffiliations(): React.ReactElement {
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
          Manage Affiliations
        </Typography>
      </Box>

      <Box sx={{ color: "black", py: 5 }}>
        <Typography variant="body1">
          Manage Affiliations will go here later
        </Typography>
      </Box>
    </PageContainer>
  );
}
