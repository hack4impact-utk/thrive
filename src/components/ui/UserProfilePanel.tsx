import {
  alpha,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Paper,
  Stack,
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

import db from "@/db";
import { eventAttendees, events, locations, userInfo, users } from "@/db/schema";
import { ROLE_COLORS } from "@/lib/role-colors";

type UserDetailRecord = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  infoFilled: boolean;
  onboarded: boolean;
  locationName: string | null;
  firstName: string | null;
  lastName: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  phoneNumber: string | null;
  birthMonth: number | null;
  birthDay: number | null;
  birthYear: number | null;
  preferredNeighborhood: string | null;
  gender: string | null;
  shirtSize: string | null;
  hoursVolunteered: number | null;
  referralSource: string | null;
  medicalNotes: string | null;
};

type AttendedEvent = {
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationName: string | null;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

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

function formatEventDate(dateStr: string): string {
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

function formatDisplayName(user: UserDetailRecord): string {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return fullName || user.name || "";
}

function formatOptionalValue(value: string | null | undefined): string {
  return value?.trim() || "Not provided";
}

function formatBirthDate(user: UserDetailRecord): string {
  if (!user.birthMonth || !user.birthDay || !user.birthYear) return "Not provided";
  const date = new Date(user.birthYear, user.birthMonth - 1, user.birthDay);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function capitalizeRole(role: string): string {
  return role
    .split("_")
    .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
    .join(" ");
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accentColor,
}: {
  label: string;
  value: string;
  accentColor: string;
}): React.ReactElement {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        border: "1px solid",
        borderColor: alpha(accentColor, 0.15),
        borderRadius: 2,
        p: 2.5,
        bgcolor: alpha(accentColor, 0.03),
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={500}>
        {label}
      </Typography>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ color: accentColor, mt: 0.5, lineHeight: 1.2 }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

function DetailItem({
  label,
  value,
  accentColor,
}: {
  label: string;
  value: string;
  accentColor: string;
}): React.ReactElement {
  const isEmpty = value === "Not provided";
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mb: 0.25,
          color: "text.secondary",
          letterSpacing: 0.9,
          textTransform: "uppercase",
          lineHeight: 1.1,
          fontSize: "0.68rem",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontWeight: isEmpty ? 400 : 600,
          color: isEmpty ? "text.disabled" : accentColor,
          fontStyle: isEmpty ? "italic" : "normal",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function InfoCard({
  title,
  items,
  accentColor,
  columns = 2,
}: {
  title: string;
  items: { label: string; value: string }[];
  accentColor: string;
  columns?: number;
}): React.ReactElement {
  return (
    <Card
      elevation={0}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
    >
      <CardHeader
        title={
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: 0.9,
              textTransform: "uppercase",
              color: alpha(accentColor, 0.7),
            }}
          >
            {title}
          </Typography>
        }
        sx={{
          px: { xs: 2, md: 2.5 },
          pt: { xs: 1.75, md: 2 },
          pb: { xs: 1.75, md: 2 },
          bgcolor: alpha(accentColor, 0.04),
          borderBottom: "1px solid",
          borderBottomColor: alpha(accentColor, 0.1),
        }}
      />
      <CardContent
        sx={{
          px: { xs: 2, md: 2.5 },
          py: 2.25,
          "&:last-child": { pb: 2.5 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: `repeat(${columns}, minmax(0, 1fr))`,
            },
            rowGap: 2.25,
            columnGap: 3,
          }}
        >
          {items.map((item) => (
            <DetailItem
              key={item.label}
              label={item.label}
              value={item.value}
              accentColor={accentColor}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getUserDetails(
  userId: string,
): Promise<UserDetailRecord | undefined> {
  const [record] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      infoFilled: users.infoFilled,
      onboarded: users.onboarded,
      locationName: locations.name,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      addressLine1: userInfo.addressLine1,
      addressLine2: userInfo.addressLine2,
      city: userInfo.city,
      state: userInfo.state,
      postalCode: userInfo.postalCode,
      country: userInfo.country,
      phoneNumber: userInfo.phoneNumber,
      birthMonth: userInfo.birthMonth,
      birthDay: userInfo.birthDay,
      birthYear: userInfo.birthYear,
      preferredNeighborhood: userInfo.preferredNeighborhood,
      gender: userInfo.gender,
      shirtSize: userInfo.shirtSize,
      hoursVolunteered: userInfo.hoursVolunteered,
      referralSource: userInfo.referralSource,
      medicalNotes: userInfo.medicalNotes,
    })
    .from(users)
    .leftJoin(userInfo, eq(userInfo.userId, users.id))
    .leftJoin(locations, eq(locations.id, users.locationId))
    .where(eq(users.id, userId));

  return record;
}

async function getAttendedEvents(userId: string): Promise<AttendedEvent[]> {
  return db
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
      and(eq(eventAttendees.userId, userId), eq(eventAttendees.attended, true)),
    )
    .orderBy(desc(events.eventDate), desc(events.startTime));
}

// ── Main component ────────────────────────────────────────────────────────────

export default async function UserProfilePanel({
  userId,
  accentColor = ROLE_COLORS.admin,
}: {
  userId: string;
  accentColor?: string;
}): Promise<React.ReactElement> {
  const [user, attendedEvents] = await Promise.all([
    getUserDetails(userId),
    getAttendedEvents(userId),
  ]);

  if (!user) notFound();

  const displayName = formatDisplayName(user);
  const hours = user.hoursVolunteered ?? 0;
  const displayHours =
    hours % 1 === 0
      ? String(hours)
      : String(Number.parseFloat(hours.toFixed(2)));

  const tableHeaderSx = {
    fontWeight: 700,
    fontSize: "0.7rem",
    letterSpacing: 0.9,
    textTransform: "uppercase" as const,
    color: "text.secondary",
    bgcolor: "grey.50",
    borderBottom: "1px solid",
    borderBottomColor: "divider",
    whiteSpace: "nowrap" as const,
    py: 1.5,
  };

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{ color: accentColor, mb: 0.5 }}
        >
          {displayName || "No name on file"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.75 }}>
          {user.email ?? "No email"}
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={1}>
          <Chip
            label={capitalizeRole(user.role)}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: "0.75rem",
              bgcolor: alpha(accentColor, 0.1),
              color: accentColor,
              border: "1px solid",
              borderColor: alpha(accentColor, 0.25),
            }}
          />
          <Chip
            label={user.infoFilled ? "Profile complete" : "Profile incomplete"}
            size="small"
            color={user.infoFilled ? "success" : "warning"}
            variant="outlined"
          />
          <Chip
            label={user.onboarded ? "Onboarded" : "Not onboarded"}
            size="small"
            color={user.onboarded ? "success" : "default"}
            variant="outlined"
          />
        </Stack>
      </Box>

      {/* Stats */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <StatCard
          label="Hours Volunteered"
          value={displayHours}
          accentColor={accentColor}
        />
        <StatCard
          label="Events Attended"
          value={String(attendedEvents.length)}
          accentColor={accentColor}
        />
        {user.locationName && (
          <StatCard
            label="Assigned Location"
            value={user.locationName}
            accentColor={accentColor}
          />
        )}
      </Stack>

      {/* Contact */}
      <InfoCard
        title="Contact"
        accentColor={accentColor}
        items={[
          {
            label: "Phone Number",
            value: formatOptionalValue(user.phoneNumber),
          },
          {
            label: "Address Line 1",
            value: formatOptionalValue(user.addressLine1),
          },
          ...(user.addressLine2?.trim()
            ? [{ label: "Address Line 2", value: user.addressLine2 }]
            : []),
          { label: "City", value: formatOptionalValue(user.city) },
          { label: "State", value: formatOptionalValue(user.state) },
          { label: "Postal Code", value: formatOptionalValue(user.postalCode) },
          { label: "Country", value: formatOptionalValue(user.country) },
        ]}
      />

      {/* Personal */}
      <InfoCard
        title="Personal"
        accentColor={accentColor}
        items={[
          { label: "First Name", value: formatOptionalValue(user.firstName) },
          { label: "Last Name", value: formatOptionalValue(user.lastName) },
          { label: "Date of Birth", value: formatBirthDate(user) },
          { label: "Gender", value: formatOptionalValue(user.gender) },
        ]}
      />

      {/* Preferences */}
      <InfoCard
        title="Preferences"
        accentColor={accentColor}
        items={[
          {
            label: "Preferred Neighborhood",
            value: formatOptionalValue(user.preferredNeighborhood),
          },
          { label: "Shirt Size", value: formatOptionalValue(user.shirtSize) },
          {
            label: "How Did You Hear About Us?",
            value: formatOptionalValue(user.referralSource),
          },
        ]}
      />

      {/* Medical */}
      <InfoCard
        title="Medical"
        accentColor={accentColor}
        columns={1}
        items={[
          {
            label: "Medical Notes",
            value: formatOptionalValue(user.medicalNotes),
          },
        ]}
      />

      {/* Attended Events */}
      <Box>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: accentColor, mb: 2 }}
        >
          Attended Events
        </Typography>

        {attendedEvents.length === 0 ? (
          <Box
            sx={{
              py: 6,
              textAlign: "center",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: alpha(accentColor, 0.02),
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
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["Event", "Date", "Time", "Location", "Duration"].map(
                    (col) => (
                      <TableCell key={col} sx={tableHeaderSx}>
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
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td": { border: 0 } }}
                    >
                      <TableCell sx={{ py: 1.5, fontWeight: 500 }}>
                        {event.title}
                      </TableCell>
                      <TableCell sx={{ py: 1.5, whiteSpace: "nowrap" }}>
                        <Typography variant="body2" color="text.secondary">
                          {formatEventDate(event.eventDate)}
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
                          fontWeight={600}
                          sx={{ color: accentColor }}
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
      </Box>
    </Stack>
  );
}
