import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import PersonIcon from "@mui/icons-material/Person";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import {
  alpha,
  Box,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Link from "next/link";

dayjs.extend(duration);

export type EventRecord = {
  id: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  registeredUsers: number;
  locationName: string | null;
  streetLine: string | null;
};

type EventListProps = {
  events: EventRecord[];
  accentColor: string;
};

function formatDate(eventDate: string): string {
  return dayjs(eventDate).format("ddd, MMMM D");
}

function formatTimeRange(
  eventDate: string,
  startTime: string,
  endTime: string,
): string {
  const start = dayjs(`${eventDate} ${startTime}`);
  const end = dayjs(`${eventDate} ${endTime}`);
  const totalMinutes = end.diff(start, "minute");
  const hours = totalMinutes / 60;
  const formattedHours =
    hours % 1 === 0 ? `${hours}` : `${Number.parseFloat(hours.toFixed(2))}`;

  return `${start.format("h:mm A")} - ${end.format("h:mm A")} (${formattedHours} Hours)`;
}

function CapacityIndicator({
  registered,
  capacity,
}: {
  registered: number;
  capacity: number | null;
}): React.ReactElement {
  const isUnlimited = capacity === null || capacity === 0;
  const progress = isUnlimited
    ? 0
    : Math.min((registered / capacity!) * 100, 100);

  return (
    <Box sx={{ minWidth: 160 }}>
      <Stack direction="row" spacing={3} sx={{ mb: 1 }}>
        <Box>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary", letterSpacing: 1 }}
          >
            REQUESTED
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontWeight: 700 }}
          >
            {isUnlimited ? "Unlimited" : capacity}
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="caption"
            sx={{ display: "block", color: "text.secondary", letterSpacing: 1 }}
          >
            FILLED
          </Typography>
          <Typography
            variant="body2"
            color="text.primary"
            sx={{ fontWeight: 700 }}
          >
            {registered}
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
    </Box>
  );
}

function EventRow({
  event,
  accentColor,
  isLast,
}: {
  event: EventRecord;
  accentColor: string;
  isLast: boolean;
}): React.ReactElement {
  const date = formatDate(event.eventDate);
  const timeRange = formatTimeRange(
    event.eventDate,
    event.startTime,
    event.endTime,
  );
  const slotsLabel =
    event.capacity === null
      ? "Unlimited capacity"
      : `${Math.max(event.capacity - event.registeredUsers, 0)} slots remaining`;

  return (
    <Box
      component={Link}
      href={`/dashboard/events-library/${event.id}`}
      sx={{
        display: "flex",
        flexDirection: "column",
        px: 3,
        py: 2,
        borderBottom: isLast ? "none" : "1px solid",
        borderColor: "divider",
        textDecoration: "none",
        transition: "background-color 120ms ease",
        "&:hover": {
          bgcolor: alpha(accentColor, 0.03),
          "& .event-arrow": { opacity: 1, transform: "translateX(0)" },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="body1"
            sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.3 }}
          >
            {event.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              color: "text.secondary",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{date}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <QueryBuilderIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{timeRange}</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <PersonIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{slotsLabel}</Typography>
            </Box>

            {event.locationName && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <BusinessIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">{event.locationName}</Typography>
              </Box>
            )}

            {event.streetLine && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocationPinIcon sx={{ fontSize: 14 }} />
                <Typography variant="caption">{event.streetLine}</Typography>
              </Box>
            )}
          </Box>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ flexShrink: 0 }}
        >
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <CapacityIndicator
              registered={event.registeredUsers}
              capacity={event.capacity}
            />
          </Box>
          <ArrowForwardIcon
            className="event-arrow"
            sx={{
              fontSize: 15,
              color: "text.secondary",
              opacity: 0,
              transform: "translateX(-4px)",
              transition: "opacity 120ms ease, transform 120ms ease",
            }}
          />
        </Stack>
      </Box>

      <Box sx={{ display: { xs: "block", sm: "none" }, mt: 1.5 }}>
        <CapacityIndicator
          registered={event.registeredUsers}
          capacity={event.capacity}
        />
      </Box>
    </Box>
  );
}

export default function EventList({
  events,
  accentColor,
}: EventListProps): React.ReactElement {
  if (events.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          py: 8,
        }}
      >
        <Stack alignItems="center" spacing={0.5}>
          <Typography variant="body2" fontWeight={600}>
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Events will appear here once they are created.
          </Typography>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {events.map((event, index) => (
        <EventRow
          key={event.id}
          event={event}
          accentColor={accentColor}
          isLast={index === events.length - 1}
        />
      ))}
    </Paper>
  );
}
