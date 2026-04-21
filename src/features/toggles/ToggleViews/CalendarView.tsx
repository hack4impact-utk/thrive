"use client";

import LocationPinIcon from "@mui/icons-material/LocationPin";
import PersonIcon from "@mui/icons-material/Person";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import { Box, Divider, Paper, Popover, Typography } from "@mui/material";
import dayjs from "dayjs";
import * as React from "react";

import type { View } from "./view-types";

export type CalendarEvent = {
  id: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  registeredUsers: number | null;
  streetLine: string;
  description: string;
  isRegistered?: boolean;
};

type CalendarViewProps = {
  activeView: View;
  events: CalendarEvent[];
};

/** Format a "HH:MM:SS" time string → "3 PM" or "3:30 PM" */
function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  if (m === 0) return `${hour} ${period}`;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarView({
  activeView,
  events,
}: CalendarViewProps): React.ReactElement | null {
  // ── Hooks (must all appear before any conditional return) ─────────────────
  const eventsByDate = React.useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const event of events) {
      if (!map[event.eventDate]) map[event.eventDate] = [];
      map[event.eventDate].push(event);
    }
    return map;
  }, [events]);

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedEvent, setSelectedEvent] =
    React.useState<CalendarEvent | null>(null);

  // ── Early return after hooks ───────────────────────────────────────────────
  if (activeView !== "calendar") return null;

  // ── Derived values ────────────────────────────────────────────────────────
  const today = dayjs();
  const months = [today, today.add(1, "month"), today.add(2, "month")];
  const open = Boolean(anchorEl);

  const handleEventClick = (
    e: React.MouseEvent<HTMLElement>,
    event: CalendarEvent,
  ): void => {
    e.stopPropagation();
    setSelectedEvent(event);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
    setSelectedEvent(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ mt: 2, width: "100%" }}>
      {months.map((month) => {
        const daysInMonth = month.daysInMonth();
        const firstDayOfWeek = month.startOf("month").day(); // 0 = Sun

        const cells: (number | null)[] = [
          ...Array.from({ length: firstDayOfWeek }, (): null => null),
          ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
        ];
        while (cells.length % 7 !== 0) cells.push(null);

        return (
          <Box key={month.format("YYYY-MM")} sx={{ mb: 5 }}>
            {/* Month label */}
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
            >
              {month.format("MMMM YYYY")}
            </Typography>

            {/* Day-of-week headers */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                mb: 0.5,
              }}
            >
              {DAYS_OF_WEEK.map((d) => (
                <Typography
                  key={d}
                  variant="caption"
                  sx={{
                    textAlign: "center",
                    fontWeight: 600,
                    color: "text.secondary",
                    fontSize: "0.75rem",
                  }}
                >
                  {d}
                </Typography>
              ))}
            </Box>

            {/* Day grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                overflow: "hidden",
              }}
            >
              {cells.map((day, idx) => {
                const dateStr = day
                  ? `${month.format("YYYY-MM")}-${String(day).padStart(2, "0")}`
                  : "";
                const dayEvents =
                  day && eventsByDate[dateStr] ? eventsByDate[dateStr] : [];
                const isToday =
                  day !== null &&
                  month.year() === today.year() &&
                  month.month() === today.month() &&
                  day === today.date();
                const isLastRow =
                  Math.floor(idx / 7) === Math.floor((cells.length - 1) / 7);
                const isLastCol = idx % 7 === 6;

                return (
                  <Box
                    key={idx}
                    sx={{
                      minHeight: 90,
                      borderRight: isLastCol ? "none" : "1px solid",
                      borderBottom: isLastRow ? "none" : "1px solid",
                      borderColor: "divider",
                      p: 0.5,
                      backgroundColor: day ? "background.paper" : "grey.50",
                    }}
                  >
                    {day !== null && (
                      <>
                        {/* Day number circle */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: 22,
                            height: 22,
                            ml: "auto",
                            mb: 0.5,
                            borderRadius: "50%",
                            backgroundColor: isToday
                              ? "primary.main"
                              : "transparent",
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: isToday ? 700 : 400,
                              color: isToday ? "white" : "text.primary",
                              fontSize: "0.75rem",
                              lineHeight: 1,
                            }}
                          >
                            {day}
                          </Typography>
                        </Box>

                        {/* Event pills */}
                        {dayEvents.map((event) => (
                          <Box
                            key={event.id}
                            role="button"
                            tabIndex={0}
                            onClick={(e) => handleEventClick(e, event)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                handleEventClick(
                                  e as unknown as React.MouseEvent<HTMLElement>,
                                  event,
                                );
                              }
                            }}
                            sx={{
                              cursor: "pointer",
                              backgroundColor: "primary.light",
                              borderRadius: 0.5,
                              px: 0.75,
                              py: 0.5,
                              mb: 0.5,
                              transition: "background-color 0.15s",
                              "&:hover": {
                                backgroundColor: "primary.main",
                                "& .event-time": {
                                  color: "rgba(255,255,255,0.8)",
                                },
                                "& .event-title": { color: "white" },
                              },
                            }}
                          >
                            {/* Time range */}
                            <Typography
                              className="event-time"
                              variant="caption"
                              sx={{
                                display: "block",
                                fontSize: "0.6rem",
                                color: "text.secondary",
                                lineHeight: 1.3,
                              }}
                            >
                              {formatTime(event.startTime)} –{" "}
                              {formatTime(event.endTime)}
                            </Typography>
                            {/* Title (clamp to 2 lines) */}
                            <Typography
                              className="event-title"
                              variant="caption"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                lineHeight: 1.2,
                                color: "text.primary",
                              }}
                            >
                              {event.title}
                            </Typography>
                          </Box>
                        ))}
                      </>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      })}

      {/* Detail popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { elevation: 4 } }}
      >
        {selectedEvent && (
          <Paper sx={{ p: 2.5, maxWidth: 320, minWidth: 260 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              {selectedEvent.title}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.75,
                mb: 1.5,
              }}
            >
              {/* Date + time */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <QueryBuilderIcon
                  fontSize="small"
                  sx={{ color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {dayjs(selectedEvent.eventDate).format("dddd, MMMM D, YYYY")}
                  &nbsp;&bull;&nbsp;
                  {formatTime(selectedEvent.startTime)} –{" "}
                  {formatTime(selectedEvent.endTime)}
                </Typography>
              </Box>

              {/* Location */}
              {selectedEvent.streetLine && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <LocationPinIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {selectedEvent.streetLine}
                  </Typography>
                </Box>
              )}

              {/* Slots remaining */}
              {selectedEvent.capacity !== null && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                  <PersonIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {(selectedEvent.capacity ?? 0) -
                      (selectedEvent.registeredUsers ?? 0)}{" "}
                    slots remaining
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 1.5 }} />

            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {selectedEvent.description}
            </Typography>
          </Paper>
        )}
      </Popover>
    </Box>
  );
}
