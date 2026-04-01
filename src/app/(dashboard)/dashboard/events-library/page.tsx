import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getAllEvents } from "@/lib/events";

dayjs.extend(duration);

type EventRecord = Awaited<ReturnType<typeof getAllEvents>>[number];

function formatDateLabel(eventDate: string): string {
  return dayjs(eventDate).format("MMMM D, YYYY");
}

function formatTimeAndDuration(
  eventDate: string,
  startTime: string,
  endTime: string,
): string {
  const start = dayjs(`${eventDate} ${startTime}`);
  const end = dayjs(`${eventDate} ${endTime}`);
  const minutes = Math.max(end.diff(start, "minute"), 0);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const durationLabel =
    hours > 0 && remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : hours > 0
        ? `${hours}h`
        : `${remainingMinutes}m`;

  return `${start.format("h:mm A")} - ${end.format("h:mm A")} (${durationLabel})`;
}

function groupEventsByDate(events: EventRecord[]): Map<string, EventRecord[]> {
  const grouped = new Map<string, EventRecord[]>();

  for (const event of events) {
    const existing = grouped.get(event.eventDate) ?? [];
    existing.push(event);
    grouped.set(event.eventDate, existing);
  }

  return grouped;
}

function EventRow({ event }: { event: EventRecord }): React.ReactElement {
  const filled = event.registeredUsers ?? 0;
  const requested = event.capacity;
  const isUnlimited = requested === null || requested === 0;
  const progress =
    requested && requested > 0 ? Math.min((filled / requested) * 100, 100) : 0;

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: 2,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 280px" },
        gap: 2,
        alignItems: "center",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, color: "#23437a", lineHeight: 1.2 }}
        >
          {event.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 0.5, color: "text.secondary", lineHeight: 1.4 }}
        >
          {event.streetLine}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 0.75, color: "#23437a", fontWeight: 500 }}
        >
          {formatTimeAndDuration(
            event.eventDate,
            event.startTime,
            event.endTime,
          )}
        </Typography>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1.5,
            mb: 1,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "text.secondary",
                letterSpacing: 1,
              }}
            >
              REQUESTED
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {isUnlimited ? "Unlimited" : requested}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: "block",
                color: "text.secondary",
                letterSpacing: 1,
              }}
            >
              FILLED
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {filled}
            </Typography>
          </Box>
        </Box>

        {!isUnlimited && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 999,
              bgcolor: "#e4eaf3",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                bgcolor: "#f5a623",
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}

export default async function EventsLibraryPage(): Promise<React.ReactElement> {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const events = await getAllEvents();
  const groupedEvents = groupEventsByDate(events);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1120,
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Events Library
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          Every event in the database, organized by date.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {[...groupedEvents.entries()].map(([date, dayEvents], index) => (
          <Box
            key={date}
            sx={{
              borderTop: index === 0 ? "none" : "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                px: { xs: 2, md: 3 },
                py: 1,
                bgcolor: "#dfe7f2",
                borderBottom: "1px solid",
                borderColor: "#cfd8e6",
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, letterSpacing: 1.2, color: "#4b6287" }}
              >
                {formatDateLabel(date)}
              </Typography>
            </Box>

            {dayEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
