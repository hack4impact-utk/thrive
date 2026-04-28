"use client";

import AutoModeIcon from "@mui/icons-material/AutoMode";
import BlockIcon from "@mui/icons-material/Block";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useSnackbar } from "@/providers/snackbar-provider";

type RecurringEventRow = {
  id: string;
  title: string;
  frequency: string;
  startDate: string;
  endDate: string | null;
  active: boolean;
  locationName: string | null;
};

type Props = {
  patterns: RecurringEventRow[];
};

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  monthly: "Monthly",
};

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StopPatternButton({
  pattern,
}: {
  pattern: RecurringEventRow;
}): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  async function handleConfirm(): Promise<void> {
    setLoading(true);
    try {
      const res = await fetch("/api/recurring-events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: pattern.id }),
      });

      if (!res.ok) {
        showSnackbar("Failed to stop recurring event.", "error");
        return;
      }

      showSnackbar(`"${pattern.title}" stopped.`, "success");
      router.refresh();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Tooltip title="Stop recurrence" arrow>
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
        >
          <BlockIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Stop recurring event?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>{pattern.title}</strong> will stop generating new events.
            All previously created events and their data will be kept.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            disabled={loading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            variant="contained"
            color="error"
          >
            Stop
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function RecurringEventsClient({
  patterns,
}: Props): React.ReactElement {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Recurring Templates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            Patterns that automatically generate events each day they occur.
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/dashboard/recurring-event/create"
          variant="contained"
          startIcon={<AutoModeIcon />}
          sx={{ flexShrink: 0 }}
        >
          Create Recurring Event
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {["Title", "Frequency", "Location", "Dates", "Status", ""].map(
                (heading, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontWeight: 700,
                      letterSpacing: 1.1,
                      color: "#4b6287",
                      fontSize: 12,
                      textTransform: "uppercase",
                      bgcolor: "#dfe7f2",
                      borderBottom: "1px solid #cfd8e6",
                      ...(i === 5 && { width: 48, p: 0 }),
                    }}
                  >
                    {heading}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {patterns.length > 0 ? (
              patterns.map((pattern) => (
                <TableRow
                  key={pattern.id}
                  hover
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                    opacity: pattern.active ? 1 : 0.55,
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {pattern.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {FREQUENCY_LABELS[pattern.frequency] ?? pattern.frequency}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {pattern.locationName ?? "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(pattern.startDate)} —{" "}
                      {pattern.endDate ? formatDate(pattern.endDate) : "No end"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={pattern.active ? "Active" : "Stopped"}
                      color={pattern.active ? "success" : "default"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell
                    sx={{ width: 48, p: 0, pr: 1, textAlign: "right" }}
                  >
                    {pattern.active && <StopPatternButton pattern={pattern} />}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ px: 3, py: 5, border: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    No recurring events yet.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.75 }}
                  >
                    Create one above to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
