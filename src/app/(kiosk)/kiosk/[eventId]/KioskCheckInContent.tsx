"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";

import { checkInAttendee } from "@/actions/check-in-attendee";
import {
  type AttendeeResult,
  searchEventAttendees,
} from "@/actions/search-event-attendees";
import { useSnackbar } from "@/providers/snackbar-provider";

type Props = {
  eventId: string;
  eventTitle: string;
  timeRange: string;
};

export default function KioskCheckInContent({
  eventId,
  eventTitle,
  timeRange,
}: Props): React.ReactElement {
  const { showSnackbar } = useSnackbar();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [results, setResults] = React.useState<AttendeeResult[] | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [checkInPending, setCheckInPending] = React.useState(false);

  const canSearch = firstName.trim().length > 0 && lastName.trim().length > 0;

  async function handleSearch(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!canSearch) return;
    setIsSearching(true);
    try {
      const found = await searchEventAttendees(eventId, firstName, lastName);
      setResults(found);
    } catch {
      showSnackbar("Search failed. Please try again.", "error");
    } finally {
      setIsSearching(false);
    }
  }

  async function handleCheckIn(
    userId: string,
    name: string,
    onboarded: boolean,
  ): Promise<void> {
    if (checkInPending) return;

    if (!onboarded) {
      showSnackbar(
        `${name} has not completed onboarding. Please see a manager.`,
        "warning",
        5000,
      );
    }

    setCheckInPending(true);
    try {
      await checkInAttendee(eventId, userId);
      showSnackbar(`${name} has been checked in!`, "success");
      setFirstName("");
      setLastName("");
      setResults(null);
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : "Check-in failed.",
        "error",
      );
    } finally {
      setCheckInPending(false);
    }
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Event header */}
      <Box>
        <Typography variant="h5" fontWeight={600} color="secondary.main">
          {eventTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {timeRange}
        </Typography>
      </Box>

      <Divider />

      {/* Search form */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="h6" fontWeight={500}>
          Volunteer Check-In
        </Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              setResults(null);
            }}
            size="small"
            sx={{ flex: 1, minWidth: 140 }}
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              setResults(null);
            }}
            size="small"
            sx={{ flex: 1, minWidth: 140 }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!canSearch || isSearching}
            startIcon={
              isSearching ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SearchIcon />
              )
            }
            sx={{ height: 40, alignSelf: "center" }}
          >
            Search
          </Button>
        </Box>
      </Box>

      {/* Search results */}
      {results !== null && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {results.length === 0 ? (
            <Box
              sx={{
                py: 4,
                px: 3,
                textAlign: "center",
                borderRadius: 2,
                backgroundColor: "grey.100",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No registered volunteers found matching that name.
              </Typography>
            </Box>
          ) : (
            results.map((attendee) => (
              <Card key={attendee.userId} variant="outlined">
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1.5,
                    "&:last-child": { pb: 1.5 },
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {attendee.firstName} {attendee.lastName}
                    </Typography>
                    {attendee.email && (
                      <Typography variant="body2" color="text.secondary">
                        {attendee.email}
                      </Typography>
                    )}
                  </Box>

                  {attendee.attended ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "primary.main",
                      }}
                    >
                      <CheckCircleIcon fontSize="small" />
                      <Typography variant="body2" fontWeight={600}>
                        Checked In
                      </Typography>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      disabled={checkInPending}
                      onClick={() =>
                        handleCheckIn(
                          attendee.userId,
                          `${attendee.firstName} ${attendee.lastName}`,
                          attendee.onboarded,
                        )
                      }
                    >
                      Check In
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      )}
    </Box>
  );
}
