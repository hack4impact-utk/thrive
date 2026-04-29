"use client";

import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { updateUserLocation } from "@/actions/update-user-location";

import type { LocationOption } from "./RoleCell";

type LocationCellProps = {
  userId: string;
  currentLocationId: string | null;
  currentLocationName: string | null;
  callerRole: string;
  locations: LocationOption[];
};

export default function LocationCell({
  userId,
  currentLocationId,
  currentLocationName,
  callerRole,
  locations,
}: LocationCellProps): React.ReactElement {
  const [locationId, setLocationId] = useState(currentLocationId ?? "");
  const [locationName, setLocationName] = useState(
    currentLocationName ?? null,
  );
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(currentLocationId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (callerRole !== "admin") {
    return (
      <Typography variant="body2" color="text.secondary">
        {locationName ?? "—"}
      </Typography>
    );
  }

  const handleOpen = (): void => {
    setSelected(locationId);
    setError(null);
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setError(null);
  };

  const handleConfirm = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await updateUserLocation(userId, selected || null);
      setLocationId(selected);
      setLocationName(
        locations.find((l) => l.id === selected)?.name ?? null,
      );
      handleClose();
    } catch {
      setError("Failed to update location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        component="button"
        onClick={handleOpen}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.25,
          background: "none",
          border: "none",
          cursor: "pointer",
          p: 0,
          color: "text.secondary",
          fontFamily: "inherit",
          "&:hover .loc-label": { color: "primary.main" },
          "&:hover .loc-arrow": { color: "primary.main" },
        }}
      >
        <Typography
          className="loc-label"
          variant="body2"
          sx={{ transition: "color 0.15s" }}
        >
          {locationName ?? "—"}
        </Typography>
        <ArrowDropDownRoundedIcon
          className="loc-arrow"
          sx={{ fontSize: 18, color: "text.disabled", transition: "color 0.15s" }}
        />
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { elevation: 4, sx: { borderRadius: 2 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 0.5 }}>
          Change assigned location
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Select a new assigned location below.
          </Typography>

          <FormControl size="small" fullWidth>
            <InputLabel shrink id="loc-cell-select-label">
              Assigned Location
            </InputLabel>
            <Select
              labelId="loc-cell-select-label"
              label="Assigned Location"
              notched
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">
                <Typography variant="body2" color="text.secondary">
                  No location
                </Typography>
              </MenuItem>
              {locations.map((loc) => (
                <MenuItem key={loc.id} value={loc.id}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            size="small"
            onClick={handleClose}
            disabled={loading}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleConfirm}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={12} color="inherit" /> : null
            }
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
