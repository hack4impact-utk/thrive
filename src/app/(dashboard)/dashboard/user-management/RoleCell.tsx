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
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { updateUserRole } from "@/actions/update-user-role";
import type { Role } from "@/actions/update-user-role";

const ROLE_LABELS: Record<Role, string> = {
  user: "User",
  kiosk: "Kiosk",
  manager: "Manager",
  admin: "Admin",
};

const ALL_ROLES: Role[] = ["user", "kiosk", "manager", "admin"];
const MANAGER_ROLES: Role[] = ["user", "kiosk", "manager"];

function formatRole(role: string): string {
  return role
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

interface RoleCellProps {
  userId: string;
  currentRole: string;
  callerRole: string;
  userName: string;
}

export default function RoleCell({
  userId,
  currentRole,
  callerRole,
  userName,
}: RoleCellProps): React.ReactElement {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableRoles = callerRole === "admin" ? ALL_ROLES : MANAGER_ROLES;

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleRoleSelect = (newRole: Role) => {
    setPendingRole(newRole);
    setMenuAnchor(null);
    setError(null);
    setConfirmOpen(true);
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
    setPendingRole(null);
    setError(null);
  };

  const handleConfirm = async () => {
    if (!pendingRole) return;
    setLoading(true);
    setError(null);
    try {
      await updateUserRole(userId, pendingRole);
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
          sx={{ fontSize: 18, color: "text.disabled", transition: "color 0.15s" }}
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
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Change{" "}
            <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
              {userName}
            </Box>
            {"'s role to "}
            <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
              {pendingRole ? ROLE_LABELS[pendingRole] : ""}
            </Box>
            ?
          </Typography>
          {error && (
            <Typography
              variant="caption"
              color="error"
              sx={{ display: "block", mt: 1 }}
            >
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
