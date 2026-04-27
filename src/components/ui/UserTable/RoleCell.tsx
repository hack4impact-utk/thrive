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
  Menu,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";

import type { Role } from "@/actions/update-user-role";
import { updateUserRole } from "@/actions/update-user-role";

const ROLE_LABELS: Record<Role, string> = {
  user: "User",
  kiosk: "Kiosk",
  manager: "Manager",
  admin: "Admin",
};

const ALL_ROLES: Role[] = ["user", "kiosk", "manager", "admin"];
const MANAGER_ROLES: Role[] = ["user", "kiosk", "manager"];
const LOCATION_ROLES = new Set<Role>(["manager", "kiosk"]);

export type LocationOption = {
  id: string;
  name: string;
};

function formatRole(role: string): string {
  return role
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

type RoleCellProps = {
  userId: string;
  currentRole: string;
  callerRole: string;
  userName: string;
  locations: LocationOption[];
};

export default function RoleCell({
  userId,
  currentRole,
  callerRole,
  userName,
  locations,
}: RoleCellProps): React.ReactElement {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableRoles = callerRole === "admin" ? ALL_ROLES : MANAGER_ROLES;
  const showLocationPicker =
    callerRole === "admin" &&
    pendingRole !== null &&
    LOCATION_ROLES.has(pendingRole);

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setMenuAnchor(null);
  };

  const handleRoleSelect = (newRole: Role): void => {
    setPendingRole(newRole);
    setSelectedLocationId("");
    setMenuAnchor(null);
    setError(null);
    setConfirmOpen(true);
  };

  const handleConfirmClose = (): void => {
    setConfirmOpen(false);
    setPendingRole(null);
    setSelectedLocationId("");
    setError(null);
  };

  const handleConfirm = async (): Promise<void> => {
    if (!pendingRole) return;
    setLoading(true);
    setError(null);
    try {
      await updateUserRole(
        userId,
        pendingRole,
        showLocationPicker ? selectedLocationId || null : undefined,
      );
      setRole(pendingRole);
      handleConfirmClose();
    } catch {
      setError("Failed to update role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        component="button"
        onClick={handleButtonClick}
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
          "&:hover .role-label": { color: "primary.main" },
          "&:hover .role-arrow": { color: "primary.main" },
        }}
      >
        <Typography
          className="role-label"
          variant="body2"
          sx={{ transition: "color 0.15s" }}
        >
          {formatRole(role)}
        </Typography>
        <ArrowDropDownRoundedIcon
          className="role-arrow"
          sx={{
            fontSize: 18,
            color: "text.disabled",
            transition: "color 0.15s",
          }}
        />
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            elevation: 2,
            sx: { minWidth: 140, borderRadius: 1.5, mt: 0.5 },
          },
        }}
      >
        {availableRoles.map((r) => (
          <MenuItem
            key={r}
            selected={r === role}
            disabled={r === role}
            onClick={() => handleRoleSelect(r)}
            sx={{ fontSize: 14 }}
          >
            {ROLE_LABELS[r]}
          </MenuItem>
        ))}
      </Menu>

      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: { elevation: 4, sx: { borderRadius: 2 } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 0.5 }}>
          Confirm role change
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            Change{" "}
            <Box
              component="span"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {userName}
            </Box>
            {"'s role to "}
            <Box
              component="span"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {pendingRole ? ROLE_LABELS[pendingRole] : ""}
            </Box>
            ?
          </Typography>

          {showLocationPicker && (
            <FormControl size="small" fullWidth>
              <InputLabel shrink id="location-select-label">
                Home Location
              </InputLabel>
              <Select
                labelId="location-select-label"
                label="Home Location"
                notched
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
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
          )}

          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            size="small"
            onClick={handleConfirmClose}
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
