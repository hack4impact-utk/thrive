"use client";

import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import PersonIcon from "@mui/icons-material/Person";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import * as React from "react";

import { attendEvent } from "@/actions/attend-event";
import { leaveEvent } from "@/actions/leave-event";
import { DefaultButton } from "@/components/ui/Button";
import type { RegOverride } from "@/features/home/components/HomePageContent";
import { useSnackbar } from "@/providers/snackbar-provider";

import getTimeRange from "../helpers";

type VolunteerEventCardProps = {
  id: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  registeredUsers: number | null;
  locationName: string | null;
  streetLine: string | null;
  description: string;
  isRegistered?: boolean;
  isAttended?: boolean;
  regOverride?: RegOverride;
  onRegChange: (eventId: string, override: RegOverride) => void;
};

export default function VolunteerEventCard(
  event: VolunteerEventCardProps,
): React.ReactElement {
  const { status } = useSession();
  const { showSnackbar } = useSnackbar();

  const { date, timeRange } = getTimeRange(
    event.eventDate,
    event.startTime,
    event.endTime,
  );

  const isRegistered =
    event.regOverride?.isRegistered ?? event.isRegistered ?? false;
  const registeredUsers =
    event.regOverride?.registeredUsers ?? event.registeredUsers ?? 0;

  const isFull =
    event.capacity !== null && event.capacity - registeredUsers <= 0;

  const [isPending, setIsPending] = React.useState(false);

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

          {status === "authenticated" && (
            <DefaultButton
              label={
                event.isAttended
                  ? "Attended"
                  : isFull && !isRegistered
                    ? "Event Full"
                    : isRegistered
                      ? "Unregister"
                      : "Register"
              }
              href="/"
              disabled={event.isAttended || (isFull && !isRegistered)}
              onClick={async () => {
                if (event.isAttended) return;
                if (isPending) return;

                setIsPending(true);
                try {
                  if (isRegistered) {
                    await leaveEvent(event.id);
                    event.onRegChange(event.id, {
                      isRegistered: false,
                      registeredUsers: Math.max(registeredUsers - 1, 0),
                    });
                    showSnackbar(
                      `You have unregistered from "${event.title}".`,
                      "info",
                    );
                  } else {
                    await attendEvent(event.id);
                    event.onRegChange(event.id, {
                      isRegistered: true,
                      registeredUsers: registeredUsers + 1,
                    });
                    showSnackbar(
                      `You're registered for "${event.title}"!`,
                      "success",
                    );
                  }
                } catch (error) {
                  if (error instanceof Error) {
                    if (error.message === "Registration conflict") {
                      showSnackbar(
                        "Someone else registered at the same time and took the last spot. You were not registered.",
                        "error",
                      );
                    } else if (error.message === "Event capacity reached") {
                      showSnackbar("This event is already full.", "error");
                    } else {
                      showSnackbar(
                        "Something went wrong. Please try again.",
                        "error",
                      );
                      console.error(error.message);
                    }
                  }
                } finally {
                  setIsPending(false);
                }
              }}
              variant={
                event.isAttended || isRegistered ? "outlined" : "contained"
              }
            />
          )}
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
              {event.capacity === null
                ? "Unlimited capacity"
                : `${event.capacity - registeredUsers} slots remaining`}
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
              <LocationPinIcon fontSize="small" />
              <Typography variant="body2">{event.streetLine}</Typography>
            </Box>
          )}
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          {event.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
