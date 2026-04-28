"use client";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  alpha,
  Box,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import * as React from "react";

export type AttendeeEntry = {
  volunteerName: string;
  eventTitle: string;
  eventDate: string;
  hours: number;
};

export type LocationRow = {
  name: string;
  hours: number;
  attendees: AttendeeEntry[];
};

type Props = {
  locationRows: LocationRow[];
  accentColor: string;
};

function fmtHours(h: number): string {
  return `${h % 1 === 0 ? String(h) : String(Number.parseFloat(h.toFixed(2)))} hrs`;
}

function fmtEventDate(d: string): string {
  const [year, month, day] = d.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

function LocationDetailRow({
  row,
  accentColor,
  isLast,
}: {
  row: LocationRow;
  accentColor: string;
  isLast: boolean;
}): React.ReactElement {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow
        onClick={() => {
          setOpen((o) => !o);
        }}
        sx={{
          cursor: "pointer",
          "&:last-child td": { border: 0 },
          "&:hover": { bgcolor: alpha(accentColor, 0.03) },
        }}
      >
        <TableCell sx={{ py: 1.5, fontWeight: 500 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {open ? (
              <KeyboardArrowDownIcon
                sx={{
                  fontSize: 18,
                  color: alpha(accentColor, 0.6),
                  flexShrink: 0,
                }}
              />
            ) : (
              <KeyboardArrowRightIcon
                sx={{
                  fontSize: 18,
                  color: alpha(accentColor, 0.6),
                  flexShrink: 0,
                }}
              />
            )}
            {row.name}
          </Box>
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

      <TableRow>
        <TableCell
          colSpan={2}
          sx={{ py: 0, borderBottom: isLast && !open ? 0 : undefined }}
        >
          <Collapse in={open} unmountOnExit>
            <Box
              sx={{
                overflowX: "auto",
                borderTop: "1px solid",
                borderColor: alpha(accentColor, 0.08),
              }}
            >
              <Box sx={{ minWidth: "max-content", py: 1, pl: 4.5, pr: 2 }}>
                {row.attendees.map((a, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(4, minmax(min-content, 1fr))",
                      gap: 1,
                      py: 0.75,
                      borderBottom:
                        i < row.attendees.length - 1 ? "1px solid" : "none",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="body2" fontWeight={500} noWrap>
                      {a.volunteerName}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {a.eventTitle}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{ textAlign: "center" }}
                    >
                      {fmtEventDate(a.eventDate)}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      noWrap
                      sx={{ color: accentColor, textAlign: "right" }}
                    >
                      {fmtHours(a.hours)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function LocationHoursTable({
  locationRows,
  accentColor,
}: Props): React.ReactElement {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
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
          {locationRows.map((row, i) => (
            <LocationDetailRow
              key={row.name}
              row={row}
              accentColor={accentColor}
              isLast={i === locationRows.length - 1}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
