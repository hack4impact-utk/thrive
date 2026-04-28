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
  Typography,
} from "@mui/material";
import { and, eq, gte, lte, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import PageContainer from "@/components/layout/PageContainer";
import db from "@/db";
import { eventAttendees, events, locations } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ROLE_COLORS } from "@/lib/role-colors";

import VolunteerHoursFilters from "./VolunteerHoursFilters";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function calcHours(start: string, end: string): number {
  return (toMinutes(end) - toMinutes(start)) / 60;
}

function fmtHours(h: number): string {
  return `${h % 1 === 0 ? String(h) : String(Number.parseFloat(h.toFixed(2)))} hrs`;
}

const headerCellSx = (color: string) =>
  ({
    fontWeight: 700,
    fontSize: "0.7rem",
    letterSpacing: 0.9,
    textTransform: "uppercase" as const,
    color: alpha(color, 0.7),
    bgcolor: alpha(color, 0.04),
    borderBottom: "1px solid",
    borderBottomColor: alpha(color, 0.12),
    py: 1.5,
    whiteSpace: "nowrap" as const,
  }) as const;

type Props = { searchParams: SearchParams };

export default async function VolunteerHoursPage({
  searchParams,
}: Props): Promise<React.ReactElement> {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== "admin" && role !== "manager") redirect("/dashboard");

  const accentColor =
    role === "manager" ? ROLE_COLORS.manager : ROLE_COLORS.admin;

  const params = await searchParams;
  const locationId =
    typeof params.locationId === "string" ? params.locationId : undefined;
  const dateFrom =
    typeof params.dateFrom === "string" ? params.dateFrom : undefined;
  const dateTo = typeof params.dateTo === "string" ? params.dateTo : undefined;

  const conditions = [
    eq(eventAttendees.attended, true),
    ne(events.deleted, true),
  ];
  if (locationId) conditions.push(eq(events.locationId, locationId));
  if (dateFrom) conditions.push(gte(events.eventDate, dateFrom));
  if (dateTo) conditions.push(lte(events.eventDate, dateTo));

  const [rows, locationOptions] = await Promise.all([
    db
      .select({
        locationName: locations.name,
        startTime: events.startTime,
        endTime: events.endTime,
      })
      .from(eventAttendees)
      .innerJoin(events, eq(events.id, eventAttendees.eventId))
      .leftJoin(locations, eq(locations.id, events.locationId))
      .where(and(...conditions)),

    db
      .select({ id: locations.id, name: locations.name })
      .from(locations)
      .where(eq(locations.deleted, false))
      .orderBy(locations.name),
  ]);

  const byLocation = new Map<string, number>();
  for (const row of rows) {
    const key = row.locationName ?? "No Location";
    byLocation.set(
      key,
      (byLocation.get(key) ?? 0) + calcHours(row.startTime, row.endTime),
    );
  }

  const locationRows = [...byLocation.entries()]
    .map(([name, hours]) => ({ name, hours }))
    .sort((a, b) => b.hours - a.hours);

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Volunteer Hours
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track hours volunteered across locations and date ranges.
          </Typography>
        </Box>

        <Suspense fallback={null}>
          <VolunteerHoursFilters
            locationOptions={locationOptions}
            accentColor={accentColor}
          />
        </Suspense>

        <Box>
          <Typography
            variant="h6"
            fontWeight={600}
            mb={1.5}
            sx={{ color: accentColor }}
          >
            Hours by Location
          </Typography>
          {locationRows.length === 0 ? (
            <EmptyState />
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
                    {["Location", "Total Hours"].map((col) => (
                      <TableCell key={col} sx={headerCellSx(accentColor)}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {locationRows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{
                        "&:last-child td": { border: 0 },
                        "&:hover": { bgcolor: alpha(accentColor, 0.03) },
                      }}
                    >
                      <TableCell sx={{ py: 1.5, fontWeight: 500 }}>
                        {row.name}
                      </TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: accentColor }}
                        >
                          {fmtHours(row.hours)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Stack>
    </PageContainer>
  );
}

function EmptyState(): React.ReactElement {
  return (
    <Box
      sx={{
        py: 5,
        textAlign: "center",
        borderRadius: 2,
        backgroundColor: "grey.100",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        No attended events match the selected filters.
      </Typography>
    </Box>
  );
}
