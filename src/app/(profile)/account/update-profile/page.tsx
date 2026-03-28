import { Box, Typography } from "@mui/material";
import React from "react";

import getUserInfo from "@/actions/get-user-info";
import BasicInfoForm from "@/app/(profile)/info/page";

export default async function UpdateProfile(): Promise<React.ReactElement> {
  const userData = await getUserInfo();
  const mode = userData ? "editForm" : "submitForm";

  return (
    <>
      <Box
        sx={{
          backgroundColor: "secondary.main",
          color: "white",
          px: 10,
          py: 5,
          width: "100%",
        }}
      >
        <Typography variant="h4">Update Profile</Typography>
      </Box>

      <Box sx={{ px: 10, py: 5 }}>
        <BasicInfoForm
          initialData={userData ?? {}}
          mode={mode}
        />
      </Box>
    </>
  );
}
