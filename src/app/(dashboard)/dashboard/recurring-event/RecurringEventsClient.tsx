"use client";

import AutoModeIcon from "@mui/icons-material/AutoMode";
import BlockIcon from "@mui/icons-material/Block";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  alpha,
  Badge,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Popover,
  Select,
  Stack,
  type SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
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

// ── Filter popover ────────────────────────────────────────────────────────────

type FilterPopoverProps = {
  accentColor: string;
  locationOptions: string[];
  location: string;
  setLocation: (v: string) => void;
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  showStopped: boolean;
  setShowStopped: (v: boolean) => void;
  activeFilterCount: number;
  onClear: () => void;
};

function FilterPopover({
  accentColor,
  locationOptions,
  location,
  setLocation,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  showStopped,
  setShowStopped,
  activeFilterCount,
  onClear,
}: FilterPopoverProps): React.ReactElement {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  return (
    <>
      <Badge badgeContent={activeFilterCount || null} color="primary">
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            color: "text.secondary",
            borderColor: "divider",
            "&:hover": { bgcolor: alpha(accentColor, 0.04) },
          }}
        >
          Filter
        </Button>
      </Badge>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box
          sx={{
            p: 2.5,
            width: 280,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="subtitle2" fontWeight={700}>
            Filters
          </Typography>

          <FormControl size="small" fullWidth>
            <InputLabel id="recurring-filter-location-label">
              Location
            </InputLabel>
            <Select
              labelId="recurring-filter-location-label"
              value={location}
              label="Location"
              onChange={(e) => setLocation(e.target.value)}
            >
              <MenuItem value="">
                <em>All locations</em>
              </MenuItem>
              {locationOptions.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Start date from"
            type="date"
            size="small"
            fullWidth
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: dateTo || undefined }}
          />

          <TextField
            label="Start date to"
            type="date"
            size="small"
            fullWidth
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: dateFrom || undefined }}
          />

          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={showStopped}
                onChange={(e) => setShowStopped(e.target.checked)}
                sx={{
                  color: alpha(accentColor, 0.5),
                  "&.Mui-checked": { color: accentColor },
                }}
              />
            }
            label={
              <Typography variant="body2">Show stopped templates</Typography>
            }
          />

          {activeFilterCount > 0 && (
            <Button
              variant="text"
              size="small"
              onClick={onClear}
              sx={{ alignSelf: "flex-start", color: accentColor, p: 0 }}
            >
              Clear filters
            </Button>
          )}
        </Box>
      </Popover>
    </>
  );
}

// ── Stop button ───────────────────────────────────────────────────────────────

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

// ── Main component ────────────────────────────────────────────────────────────

export default function RecurringEventsClient({
  patterns,
  accentColor,
}: Props): React.ReactElement {
  const [location, setLocation] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [showStopped, setShowStopped] = React.useState(false);

  const locationOptions = React.useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const p of patterns) {
      if (p.locationName && !seen.has(p.locationName)) {
        seen.add(p.locationName);
        result.push(p.locationName);
      }
    }
    return result.sort();
  }, [patterns]);

  const filtered = React.useMemo(() => {
    return patterns.filter((p) => {
      if (!showStopped && !p.active) return false;
      if (location && p.locationName !== location) return false;
      // Date range overlap: pattern overlaps [dateFrom, dateTo] if
      // pattern.startDate <= dateTo AND (pattern.endDate is null OR pattern.endDate >= dateFrom)
      if (dateTo && p.startDate > dateTo) return false;
      if (dateFrom && p.endDate && p.endDate < dateFrom) return false;
      return true;
    });
  }, [patterns, showStopped, location, dateFrom, dateTo]);

  const activeFilterCount = [location, dateFrom || dateTo].filter(
    Boolean,
  ).length;

  function handleClear(): void {
    setLocation("");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Recurring Templates
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.75, mb: 2 }}
        >
          Patterns that automatically generate events each day they occur.
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <FilterPopover
            accentColor={accentColor}
            locationOptions={locationOptions}
            location={location}
            setLocation={setLocation}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            showStopped={showStopped}
            setShowStopped={setShowStopped}
            activeFilterCount={activeFilterCount}
            onClear={handleClear}
          />

          <Button
            component={Link}
            href="/dashboard/recurring-event/create"
            variant="contained"
            startIcon={<AutoModeIcon />}
          >
            Create Recurring Event
          </Button>
        </Box>
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
                  <TableCell
                    key={heading}
                    sx={{
                      ...headerCellSx(accentColor),
                      minWidth: heading === "Dates" ? 210 : 180,
                    }}
                  >
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
            {filtered.length > 0 ? (
              filtered.map((pattern) => (
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
                  <TableCell
                    sx={{ width: 48, p: 0, pr: 1, textAlign: "right" }}
                  >
                    {pattern.active && <StopPatternButton pattern={pattern} />}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ border: 0, py: 6 }}>
                  <Stack alignItems="center" spacing={0.5}>
                    <Typography variant="body2" fontWeight={600}>
                      {patterns.filter((p) => p.active).length === 0 &&
                      !showStopped
                        ? "No active recurring templates."
                        : "No templates match the current filters."}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {patterns.filter((p) => p.active).length === 0 &&
                      !showStopped
                        ? "Create one above to get started."
                        : "Try adjusting or clearing the filters."}
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
