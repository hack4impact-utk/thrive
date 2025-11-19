"use client";
import Box from "@mui/material/Box";
import { ReactNode } from "react";

import VolunteerEventCard from "@/components/VolunteerEventCard";
import VolunteerEventCardHeader from "@/components/VolunteerEventCardHeader";
import WelcomeCard from "@/components/WelcomeCard";

export default function HomePage(): ReactNode {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
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
        <VolunteerEventCard />
        <VolunteerEventCard />
        <VolunteerEventCard />
        <VolunteerEventCardHeader date={tomorrow} />
        <VolunteerEventCard />
        <VolunteerEventCard />
        <VolunteerEventCard />
        <VolunteerEventCard />
        <VolunteerEventCard />
        <VolunteerEventCard />
        <VolunteerEventCard />
      </Box>
    </div>
  );
}
