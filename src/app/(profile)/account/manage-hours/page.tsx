import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { and, desc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import React from "react";

import PageContainer from "@/components/layout/PageContainer";
import db from "@/db";
import { eventAttendees, events, locations, userInfo } from "@/db/schema";
import getUserSession from "@/utils/auth/get-user-session";

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calcDurationHours(startTime: string, endTime: string): number {
  return (toMinutes(endTime) - toMinutes(startTime)) / 60;
}

function formatHours(hours: number): string {
  return `${hours % 1 === 0 ? String(hours) : String(Number.parseFloat(hours.toFixed(2)))} hrs`;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function fmt12h(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function formatTimeRange(startTime: string, endTime: string): string {
  return `${fmt12h(startTime)} – ${fmt12h(endTime)}`;
}

export default async function ViewHours(): Promise<React.ReactElement> {
  const session = await getUserSession();
  if (!session?.user?.id) notFound();

  const userId = session.user.id;

  const [info, attendedEvents] = await Promise.all([
    db
      .select({ hoursVolunteered: userInfo.hoursVolunteered })
      .from(userInfo)
      .where(eq(userInfo.userId, userId))
      .then((res) => res[0]),

    db
      .select({
        title: events.title,
        eventDate: events.eventDate,
        startTime: events.startTime,
        endTime: events.endTime,
        locationName: locations.name,
      })
      .from(eventAttendees)
      .innerJoin(events, eq(events.id, eventAttendees.eventId))
      .leftJoin(locations, eq(locations.id, events.locationId))
      .where(
        and(
          eq(eventAttendees.userId, userId),
          eq(eventAttendees.attended, true),
        ),
      )
      .orderBy(desc(events.eventDate), desc(events.startTime)),
  ]);

  const totalHours = info?.hoursVolunteered ?? 0;

  return (
    <PageContainer maxWidth={800} sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h5" fontWeight={700} mb={4}>
        My Hours
      </Typography>

      {/* Summary card */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          p: 4,
          mb: 4,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Total Hours Volunteered
        </Typography>
        <Typography variant="h3" fontWeight={700} color="primary.main">
          {totalHours % 1 === 0
            ? String(totalHours)
            : String(Number.parseFloat(totalHours.toFixed(2)))}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          across {attendedEvents.length}{" "}
          {attendedEvents.length === 1 ? "event" : "events"}
        </Typography>
      </Paper>

      {/* Attended events */}
      <Typography variant="h6" fontWeight={600} mb={2} color="secondary.main">
        Attended Events
      </Typography>

      {attendedEvents.length === 0 ? (
        <Box
          sx={{
            py: 6,
            textAlign: "center",
            borderRadius: 2,
            backgroundColor: "grey.100",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No attended events yet.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                {["Event", "Date", "Time", "Location", "Duration"].map(
                  (col) => (
                    <TableCell
                      key={col}
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        letterSpacing: 0.9,
                        textTransform: "uppercase",
                        color: "text.secondary",
                        bgcolor: "grey.50",
                        borderBottom: "1px solid",
                        borderBottomColor: "divider",
                        whiteSpace: "nowrap",
                        py: 1.5,
                      }}
                    >
                      {col}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {attendedEvents.map((event, i) => {
                const duration = calcDurationHours(
                  event.startTime,
                  event.endTime,
                );
                return (
                  <TableRow key={i} sx={{ "&:last-child td": { border: 0 } }}>
                    <TableCell sx={{ py: 1.5, fontWeight: 500 }}>
                      {event.title}
                    </TableCell>
                    <TableCell sx={{ py: 1.5, whiteSpace: "nowrap" }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(event.eventDate)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, whiteSpace: "nowrap" }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatTimeRange(event.startTime, event.endTime)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {event.locationName ?? "—"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 1.5, whiteSpace: "nowrap" }}>
                      <Typography
                        variant="body2"
                        color="primary.main"
                        fontWeight={600}
                      >
                        {formatHours(duration)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </PageContainer>
  );
}
