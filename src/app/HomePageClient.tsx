"use client";
import { Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { Fragment } from "react";

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

  const groups: Record<string, typeof events> = {};

  for (const event of events) {
    const date = event.eventDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
  }

  const sortedDates = Object.keys(groups).sort();

  return (
    <>
      {sortedDates.map((dateString) => {
        const [year, month, day] = dateString.split("-").map(Number);
        const dateObj = new Date(year, month - 1, day);

        const weekday = dateObj.toLocaleDateString("en-US", {
          weekday: "long",
        });
        const displayDate = `${weekday}, ${month}/${day}/${year}`;

        return (
          <Fragment key={dateString}>
            <Box
              sx={{
                backgroundColor: "secondary.main",
                color: "white",
                position: "sticky",
                top: 56.8,
                zIndex: 1,
                padding: 2,
                width: "100%",
                mt: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {displayDate}
              </Typography>
            </Box>

            {groups[dateString].map((event) => (
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
              />
            ))}
          </Fragment>
        );
      })}

      {status === "authenticated" && (
        <Box sx={{ display: "flex" }}>
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
