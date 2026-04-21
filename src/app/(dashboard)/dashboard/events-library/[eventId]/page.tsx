import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
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
import dayjs from "dayjs";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import db from "@/db";
import { eventAttendees, events, userInfo, users } from "@/db/schema";
import { auth } from "@/lib/auth";

type EventDetails = {
  id: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  streetLine: string;
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

  if (fullName) {
    return fullName;
  }

  return attendee.name || "Profile incomplete";
}

function formatEventSchedule(event: EventDetails): string {
  const start = dayjs(`${event.eventDate} ${event.startTime}`);
  const end = dayjs(`${event.eventDate} ${event.endTime}`);

  return `${start.format("MMMM D, YYYY")} | ${start.format("h:mm A")} - ${end.format("h:mm A")}`;
}

function AttendeeRow({
  attendee,
}: {
  attendee: AttendeeRecord;
}): React.ReactElement {
  const fullName = formatFullName(attendee);

  return (
    <TableRow hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <Typography
            component={Link}
            href={`/dashboard/user-management/${attendee.id}`}
            variant="body2"
            sx={{
              fontWeight: 600,
              color: "#22305B",
              textDecoration: "none",
              "&:hover": {
                color: "#31487f",
                textDecoration: "underline",
              },
            }}
          >
            {fullName}
          </Typography>
          {!attendee.infoFilled && (
            <Tooltip title="User has not completed user info form" arrow>
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  color: "#d9822b",
                }}
              >
                <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />
              </Box>
            </Tooltip>
          )}
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {attendee.email ?? "—"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {attendee.phoneNumber ?? "—"}
        </Typography>
      </TableCell>
      <TableCell>
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
      streetLine: events.streetLine,
    })
    .from(events)
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

  const { eventId } = await params;
  const [event, attendees] = await Promise.all([
    getEventDetails(eventId),
    getAttendees(eventId),
  ]);

  if (!event) {
    notFound();
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1120,
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Stack spacing={2}>
        <Typography
          component={Link}
          href="/dashboard/events-library"
          variant="body2"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            color: "#4b6287",
            textDecoration: "none",
            lineHeight: 1.2,
            "&:hover": {
              textDecoration: "underline",
            },
          }}
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
          Back to Events Library
        </Typography>

        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            {formatEventSchedule(event)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
            {event.streetLine}
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
            maxHeight: "calc(100vh - 280px)",
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {["Full Name", "Email", "Phone", "Role"].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      fontWeight: 700,
                      letterSpacing: 1.1,
                      color: "#4b6287",
                      fontSize: 12,
                      textTransform: "uppercase",
                      bgcolor: "#dfe7f2",
                      borderBottom: "1px solid #cfd8e6",
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {attendees.length > 0 ? (
                attendees.map((attendee) => (
                  <AttendeeRow key={attendee.id} attendee={attendee} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ px: 3, py: 5, border: 0 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      No attendees yet.
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.75 }}
                    >
                      Registered attendees will appear here once users sign up
                      for this event.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}
