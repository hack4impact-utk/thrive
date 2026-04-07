"use client";
import { Box, Typography } from "@mui/material";
import { Fragment } from "react";

import EventCard from "../../home/components/EventCard";

type HomePageClientProps = {
  events: {
    id: string;
    title: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    capacity: number | null;
    registeredUsers: number | null;
    streetLine: string;
    description: string;
    isRegistered?: boolean;
  }[];
};

export default function ListView({
  events,
}: HomePageClientProps): React.ReactElement {
  if (events.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          mt: 4,
          py: 6,
          px: 3,
          textAlign: "center",
          borderRadius: 2,
          backgroundColor: "grey.100",
        }}
      >
        <Typography variant="body1" color="text.secondary">
          There are no upcoming events at this time.
        </Typography>
      </Box>
    );
  }

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
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                eventDate={event.eventDate}
                startTime={event.startTime}
                endTime={event.endTime}
                capacity={event.capacity}
                registeredUsers={event.registeredUsers}
                streetLine={event.streetLine}
                description={event.description}
                isRegistered={event.isRegistered}
              />
            ))}
          </Fragment>
        );
      })}
    </>
  );
}
