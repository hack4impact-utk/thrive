import {
  Box,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Link from "next/link";
import { redirect } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
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

function EventStatusBar({
  filled,
  requested,
  isUnlimited,
  progress,
}: {
  filled: number;
  requested: number | null;
  isUnlimited: boolean;
  progress: number;
}): React.ReactElement {
  return (
    <>
      <Stack direction="row" spacing={3} sx={{ mb: 1 }}>
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
      </Stack>

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
              bgcolor: "primary.main",
            },
          }}
        />
      )}
    </>
  );
}

function EventRow({ event }: { event: EventRecord }): React.ReactElement {
  const filled = event.registeredUsers ?? 0;
  const requested = event.capacity;
  const isUnlimited = requested === null || requested === 0;
  const progress =
    requested && requested > 0 ? Math.min((filled / requested) * 100, 100) : 0;

  return (
    <TableRow sx={{ "&:last-child td": { borderBottom: 0 } }}>
      <TableCell
        sx={{
          py: 2,
          px: { xs: 2, md: 3 },
          verticalAlign: "top",
          minWidth: 0,
        }}
      >
        <Typography
          component={Link}
          href={`/dashboard/events-library/${event.id}`}
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "#23437a",
            lineHeight: 1.2,
            textDecoration: "none",
            "&:hover": {
              color: "#31487f",
              textDecoration: "underline",
            },
          }}
        >
          {event.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 0.5, color: "text.secondary", lineHeight: 1.4 }}
        >
          {event.streetLine ?? "—"}
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

        <Box sx={{ display: { xs: "block", sm: "none" }, mt: 1.5 }}>
          <EventStatusBar
            filled={filled}
            requested={requested}
            isUnlimited={isUnlimited}
            progress={progress}
          />
        </Box>
      </TableCell>

      <TableCell
        sx={{
          display: { xs: "none", sm: "table-cell" },
          py: 2,
          px: { xs: 2, md: 3 },
          width: 280,
          verticalAlign: "middle",
        }}
      >
        <EventStatusBar
          filled={filled}
          requested={requested}
          isUnlimited={isUnlimited}
          progress={progress}
        />
      </TableCell>
    </TableRow>
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
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Events Library
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          Every event in the database, organized by date.
        </Typography>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <Table>
          {[...groupedEvents.entries()].map(([date, dayEvents]) => (
            <TableBody key={date}>
              <TableRow sx={{ bgcolor: "#dfe7f2" }}>
                <TableCell
                  colSpan={2}
                  sx={{
                    py: 1,
                    px: { xs: 2, md: 3 },
                    borderBottom: "1px solid",
                    borderColor: "#cfd8e6",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      letterSpacing: 1.2,
                      color: "#4b6287",
                    }}
                  >
                    {formatDateLabel(date)}
                  </Typography>
                </TableCell>
              </TableRow>

              {dayEvents.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </TableBody>
          ))}
        </Table>
      </TableContainer>
    </PageContainer>
  );
}
