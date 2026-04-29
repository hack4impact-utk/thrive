"use client";

import AutoModeIcon from "@mui/icons-material/AutoMode";
import BlockIcon from "@mui/icons-material/Block";
import {
  alpha,
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
  Stack,
  type SxProps,
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
  accentColor: string;
};

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Every 2 weeks",
  monthly: "Monthly",
};

const headerCellSx = (accentColor: string): SxProps => ({
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
});

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
  accentColor,
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
          <Typography variant="h5" fontWeight={700} gutterBottom>
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
          overflow: "auto",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {["Title", "Frequency", "Location", "Dates", "Status"].map(
                (heading) => (
                  <TableCell key={heading} sx={headerCellSx(accentColor)}>
                    {heading}
                  </TableCell>
                ),
              )}
              <TableCell
                sx={{ ...headerCellSx(accentColor), width: 48, p: 0 }}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {patterns.length > 0 ? (
              patterns.map((pattern) => (
                <TableRow
                  key={pattern.id}
                  sx={{
                    "&:last-child td": { border: 0 },
                    "&:hover": { bgcolor: alpha(accentColor, 0.03) },
                    transition: "background-color 120ms ease",
                    opacity: pattern.active ? 1 : 0.55,
                  }}
                >
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {pattern.title}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {FREQUENCY_LABELS[pattern.frequency] ?? pattern.frequency}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {pattern.locationName ?? "—"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(pattern.startDate)} —{" "}
                      {pattern.endDate ? formatDate(pattern.endDate) : "No end"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Chip
                      label={pattern.active ? "Active" : "Stopped"}
                      color={pattern.active ? "success" : "default"}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell sx={{ width: 48, p: 0, pr: 1, textAlign: "right" }}>
                    {pattern.active && <StopPatternButton pattern={pattern} />}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ border: 0, py: 6 }}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Typography variant="body2" fontWeight={600}>
                      No recurring events yet.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create one above to get started.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
