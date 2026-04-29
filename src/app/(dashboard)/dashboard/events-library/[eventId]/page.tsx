import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  alpha,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
import BackButton from "@/components/ui/BackButton";
import db from "@/db";
import { eventAttendees, events, userInfo, users } from "@/db/schema";
import { locations } from "@/db/schema/locations";
import { auth } from "@/lib/auth";
import { ROLE_COLORS } from "@/lib/role-colors";

type EventDetails = {
  id: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationName: string | null;
};

type AttendeeRecord = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  phoneNumber: string | null;
  email: string | null;
  infoFilled: boolean;
  role: string;
};

function fmt12h(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function formatEventDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatSubtitle(event: EventDetails): string {
  const parts = [
    formatEventDate(event.eventDate),
    `${fmt12h(event.startTime)} – ${fmt12h(event.endTime)}`,
    ...(event.locationName ? [event.locationName] : []),
  ];
  return parts.join("  ·  ");
}

function formatRoleLabel(role: string): string {
  return role
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatFullName(attendee: AttendeeRecord): string {
  const fullName = [attendee.firstName, attendee.lastName]
    .filter(Boolean)
    .join(" ");
  return fullName || attendee.name || "Profile incomplete";
}

function AttendeeRow({
  attendee,
  accentColor,
}: {
  attendee: AttendeeRecord;
  accentColor: string;
}): React.ReactElement {
  const fullName = formatFullName(attendee);

  return (
    <TableRow
      sx={{
        "&:last-child td": { border: 0 },
        "&:hover": { bgcolor: alpha(accentColor, 0.03) },
        transition: "background-color 120ms ease",
      }}
    >
      <TableCell sx={{ py: 1.5, whiteSpace: "nowrap" }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <Typography
            component={Link}
            href={`/dashboard/user-management/${attendee.id}`}
            variant="body2"
            sx={{
              fontWeight: 600,
              color: accentColor,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {fullName}
          </Typography>
          {!attendee.infoFilled && (
            <Tooltip title="Profile incomplete" arrow>
              <WarningAmberRoundedIcon
                sx={{ fontSize: 15, color: "warning.main", flexShrink: 0 }}
              />
            </Tooltip>
          )}
        </Box>
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          {attendee.email ?? "—"}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          {attendee.phoneNumber ?? "—"}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          {formatRoleLabel(attendee.role)}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

async function getEventDetails(
  eventId: string,
): Promise<EventDetails | undefined> {
  const [event] = await db
    .select({
      id: events.id,
      title: events.title,
      eventDate: events.eventDate,
      startTime: events.startTime,
      endTime: events.endTime,
      locationName: locations.name,
    })
    .from(events)
    .leftJoin(locations, eq(locations.id, events.locationId))
    .where(eq(events.id, eventId));

  return event;
}

async function getAttendees(eventId: string): Promise<AttendeeRecord[]> {
  return db
    .select({
      id: users.id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      name: users.name,
      phoneNumber: userInfo.phoneNumber,
      email: users.email,
      infoFilled: users.infoFilled,
      role: users.role,
    })
    .from(eventAttendees)
    .innerJoin(users, eq(users.id, eventAttendees.userId))
    .leftJoin(userInfo, eq(userInfo.userId, users.id))
    .where(eq(eventAttendees.eventId, eventId))
    .orderBy(asc(userInfo.lastName), asc(userInfo.firstName), asc(users.email));
}

export default async function EventAttendeesPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}): Promise<React.ReactElement> {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/dashboard");
  }

  const accentColor = ROLE_COLORS.admin;

  const { eventId } = await params;
  const [event, attendees] = await Promise.all([
    getEventDetails(eventId),
    getAttendees(eventId),
  ]);

  if (!event) notFound();

  const headerCellSx = {
    fontWeight: 700,
    fontSize: "0.7rem",
    letterSpacing: 0.9,
    textTransform: "uppercase" as const,
    color: alpha(accentColor, 0.7),
    bgcolor: alpha(accentColor, 0.04),
    borderBottom: "1px solid",
    borderBottomColor: alpha(accentColor, 0.12),
    py: 1.5,
    whiteSpace: "nowrap" as const,
  };

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Box>
          <BackButton label="Back" accentColor={accentColor} />
        </Box>

        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ color: accentColor }}>
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {formatSubtitle(event)}
          </Typography>
        </Box>

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "auto",
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {["Name", "Email", "Phone", "Role"].map((heading) => (
                  <TableCell key={heading} sx={headerCellSx}>
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {attendees.length > 0 ? (
                attendees.map((attendee) => (
                  <AttendeeRow
                    key={attendee.id}
                    attendee={attendee}
                    accentColor={accentColor}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ border: 0, py: 6 }}>
                    <Stack alignItems="center" spacing={0.5}>
                      <Typography variant="body2" fontWeight={600}>
                        No attendees yet.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Registered attendees will appear here once users sign up.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </PageContainer>
  );
}
