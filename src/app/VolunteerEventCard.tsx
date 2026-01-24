"use client";

import LocationPinIcon from "@mui/icons-material/LocationPin";
import PersonIcon from "@mui/icons-material/Person";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import * as React from "react";

import { attendEvent } from "@/actions/attend-event";
import { DefaultButton } from "@/components/Button";

import getTimeRange from "./helpers";

type VolunteerEventCardProps = {
  id: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  streetLine: string;
  description: string;
};

export default function VolunteerEventCard(
  event: VolunteerEventCardProps,
): React.ReactElement {
  const { status } = useSession();

  const timeRange = getTimeRange(
    event.eventDate,
    event.startTime,
    event.endTime,
  );

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography variant="h6">{event.title}</Typography>

          {status === "authenticated" && (
            <DefaultButton
              label="Register"
              onClick={() => attendEvent(event.id)}
              href="/"
            />
          )}
        </Box>

        {/* Meta info */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            color: "text.secondary",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <QueryBuilderIcon fontSize="small" />
            <Typography variant="body2">{timeRange}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PersonIcon fontSize="small" />
            <Typography variant="body2">
              {event.capacity} slots remaining
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationPinIcon fontSize="small" />
            <Typography variant="body2">{event.streetLine}</Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          {event.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
