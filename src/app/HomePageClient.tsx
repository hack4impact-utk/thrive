"use client";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";

import { DefaultButton } from "@/components/Button/DefaultButton";

import VolunteerEventCard from "./VolunteerEventCard";

type HomePageClientProps = {
  events: {
    id: string;
    title: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    capacity: number | null;
    streetLine: string;
    description: string;
    isRegistered?: boolean;
  }[];
};

export default function HomePageClient({
  events,
}: HomePageClientProps): React.ReactElement {
  const { status } = useSession();
  return (
    <>
      {events.map((event) => (
        <VolunteerEventCard
          key={event.id}
          id={event.id}
          title={event.title}
          eventDate={event.eventDate}
          startTime={event.startTime}
          endTime={event.endTime}
          capacity={event.capacity}
          streetLine={event.streetLine}
          description={event.description}
          isRegistered={event.isRegistered}
        />
      ))}
      {/* Temporary event creation form */}
      {status === "authenticated" && (
        <Box
          sx={{
            display: "flex",
          }}
        >
          <DefaultButton
            label="temporary one time event creation button"
            href="/admin/one-time-event-creation"
          />
          <DefaultButton
            label="user info form"
            href="/create-account/basic-info"
          />
        </Box>
      )}
    </>
  );
}
