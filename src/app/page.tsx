"use client";
import Box from "@mui/material/Box";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

import VolunteerEventCard from "@/app/VolunteerEventCard";
import VolunteerEventCardHeader from "@/app/VolunteerEventCardHeader";
import WelcomeCard from "@/app/WelcomeCard";
import { DefaultButton } from "@/components/Button/DefaultButton";

export default function HomePage(): ReactNode {
  const { status } = useSession();
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
        {/* Temporary event creation form */}
        {status === "authenticated" && (
          <DefaultButton
            label="temporary one time event creation button"
            href="/admin/one-time-event-creation"
          />
        )}
      </Box>
    </div>
  );
}
