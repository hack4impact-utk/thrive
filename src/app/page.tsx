"use client";
import Box from "@mui/material/Box";
import { ReactNode } from "react";

import CalendarView from "@/components/CalendarViewUI/calendar-view";
import VolunteerEventCard from "@/components/VolunteerEventCard";
import VolunteerEventCardHeader from "@/components/VolunteerEventCardHeader";
import WelcomeCard from "@/components/WelcomeCard";

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
      <CalendarView />
    </div>
  );
}
