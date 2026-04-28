"use client";

import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { Box, Card, CardContent, Typography } from "@mui/material";
import * as React from "react";

import { DefaultButton } from "@/components/ui/Button";
import getTimeRange from "@/features/home/helpers";

type KioskEventCardProps = {
  id: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  registeredUsers: number;
  locationName: string | null;
  streetLine: string | null;
  description: string;
};

export default function KioskEventCard(
  event: KioskEventCardProps,
): React.ReactElement {
  const { date, timeRange } = getTimeRange(
    event.eventDate,
    event.startTime,
    event.endTime,
  );

  const spotsLeft =
    event.capacity === null ? null : event.capacity - event.registeredUsers;

  return (
    <Card variant="outlined" sx={{ width: "100%" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography variant="h6">{event.title}</Typography>
          <DefaultButton
            label="Select Event"
            href={`/kiosk/${event.id}`}
            variant="contained"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            color: "text.secondary",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <CalendarTodayIcon fontSize="small" />
            <Typography variant="body2">{date}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <QueryBuilderIcon fontSize="small" />
            <Typography variant="body2">{timeRange}</Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <PersonIcon fontSize="small" />
            <Typography variant="body2">
              {spotsLeft === null
                ? "Unlimited capacity"
                : `${spotsLeft} slots remaining`}
            </Typography>
          </Box>

          {event.locationName && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <BusinessIcon fontSize="small" />
              <Typography variant="body2">{event.locationName}</Typography>
            </Box>
          )}

          {event.streetLine && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="body2">{event.streetLine}</Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
