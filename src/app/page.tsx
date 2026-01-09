"use client";
import Box from "@mui/material/Box";
import { ReactNode } from "react";

import VolunteerEventCard from "@/app/VolunteerEventCard";
import VolunteerEventCardHeader from "@/app/VolunteerEventCardHeader";
import WelcomeCard from "@/app/WelcomeCard";

export default function HomePage(): ReactNode {
  return (
    <div>
      <Box
        sx={{
          width: "80%",
          maxWidth: 1000,
          mx: "auto",
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <WelcomeCard />
        <VolunteerEventCardHeader />
        <VolunteerEventCard />
      </Box>
    </div>
  );
}
