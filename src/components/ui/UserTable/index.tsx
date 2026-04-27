"use client";

import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  alpha,
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

import RoleCell, { type LocationOption } from "./RoleCell";

export type UserRecord = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  hoursVolunteered: number | null;
  infoFilled: boolean;
  role: string;
  locationName: string | null;
  preferredNeighborhood: string | null;
};

type UserTableProps = {
  users: UserRecord[];
  callerRole: string;
  locationOptions: LocationOption[];
  accentColor: string;
  hoursSort: "desc" | "asc" | null;
  onHoursSortToggle: () => void;
  onHoursSortClear: () => void;
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

function formatFullName(
  firstName: string | null,
  lastName: string | null,
  name: string | null,
): string {
  const full = [firstName, lastName].filter(Boolean).join(" ");
  return full || name || "";
}

function UserRow({
  user,
  callerRole,
  locationOptions,
  accentColor,
}: {
  user: UserRecord;
  callerRole: string;
  locationOptions: LocationOption[];
  accentColor: string;
}): React.ReactElement {
  const displayName = formatFullName(user.firstName, user.lastName, user.name);

  return (
    <TableRow
      sx={{
        "&:last-child td": { border: 0 },
        "&:hover": { bgcolor: alpha(accentColor, 0.03) },
        transition: "background-color 120ms ease",
      }}
    >
      <TableCell sx={{ py: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {displayName ? (
            <Typography
              component={Link}
              href={`/dashboard/user-management/${user.id}`}
              variant="body2"
              sx={{
                fontWeight: 600,
                color: accentColor,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {displayName}
            </Typography>
          ) : (
            <Typography
              component={Link}
              href={`/dashboard/user-management/${user.id}`}
              variant="body2"
              sx={{
                fontWeight: 500,
                color: "text.disabled",
                fontStyle: "italic",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              No name
            </Typography>
          )}
          {!user.infoFilled && (
            <Tooltip title="Profile incomplete" arrow>
              <WarningAmberRoundedIcon
                sx={{ fontSize: 15, color: "warning.main", flexShrink: 0 }}
              />
            </Tooltip>
          )}
        </Stack>
      </TableCell>

      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          {user.email ?? "—"}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          {user.phoneNumber ?? "—"}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          {(user.hoursVolunteered ?? 0).toFixed(2)}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 1.5 }}>
        <RoleCell
          userId={user.id}
          currentRole={user.role}
          callerRole={callerRole}
          userName={displayName || user.email || user.id}
          locations={locationOptions}
        />
      </TableCell>

      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          {user.locationName ?? "—"}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 1.5 }}>
        <Typography variant="body2" color="text.secondary">
          {user.preferredNeighborhood ?? "—"}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

export default function UserTable({
  users,
  callerRole,
  locationOptions,
  accentColor,
  hoursSort,
  onHoursSortToggle,
  onHoursSortClear,
}: UserTableProps): React.ReactElement {
  const staticLeftCols = ["Name", "Email", "Phone"];
  const staticRightCols = ["Role", "Assigned Location", "Neighborhood"];

  return (
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
            {staticLeftCols.map((col) => (
              <TableCell key={col} sx={headerCellSx(accentColor)}>
                {col}
              </TableCell>
            ))}

            <TableCell
              onClick={onHoursSortToggle}
              sx={{
                ...headerCellSx(accentColor),
                cursor: "pointer",
                userSelect: "none",
                "&:hover": {
                  bgcolor: alpha(accentColor, 0.08),
                },
              }}
            >
              <Stack direction="row" alignItems="center" gap={0.5}>
                <span>Hours</span>
                {hoursSort === "desc" && (
                  <ArrowDownwardRoundedIcon sx={{ fontSize: 13 }} />
                )}
                {hoursSort === "asc" && (
                  <ArrowUpwardRoundedIcon sx={{ fontSize: 13 }} />
                )}
                {!hoursSort && (
                  <SwapVertRoundedIcon sx={{ fontSize: 13, opacity: 0.45 }} />
                )}
                {hoursSort && (
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onHoursSortClear();
                    }}
                    sx={{
                      p: 0,
                      ml: 0.25,
                      color: "inherit",
                      "&:hover": { bgcolor: "transparent", opacity: 0.6 },
                    }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 11 }} />
                  </IconButton>
                )}
              </Stack>
            </TableCell>

            {staticRightCols.map((col) => (
              <TableCell key={col} sx={headerCellSx(accentColor)}>
                {col}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                callerRole={callerRole}
                locationOptions={locationOptions}
                accentColor={accentColor}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} sx={{ border: 0, py: 6 }}>
                <Stack alignItems="center" spacing={0.5}>
                  <Typography variant="body2" fontWeight={600}>
                    No users found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No users match the current filters.
                  </Typography>
                </Stack>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export { type LocationOption } from "./RoleCell";
