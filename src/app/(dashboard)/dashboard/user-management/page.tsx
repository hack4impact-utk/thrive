import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  alpha,
  Avatar,
  Box,
  Chip,
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
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";

import db from "@/db";
import { userInfo, users } from "@/db/schema";
import { auth } from "@/lib/auth";

type UserRecord = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
  phoneNumber: string | null;
  email: string | null;
  infoFilled: boolean;
  role: string;
};

function formatRoleLabel(role: string): string {
  return role
    .split("_")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function formatFullName(
  firstName: string | null,
  lastName: string | null,
  name: string | null,
): string {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  if (fullName) return fullName;
  return name || "Profile incomplete";
}

function getInitials(
  firstName: string | null,
  lastName: string | null,
  name: string | null,
): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  if (firstName) return firstName[0].toUpperCase();
  if (lastName) return lastName[0].toUpperCase();
  if (name) return name[0].toUpperCase();
  return "?";
}

function UserRow({ user }: { user: UserRecord }): React.ReactElement {
  const fullName = formatFullName(user.firstName, user.lastName, user.name);
  const initials = getInitials(user.firstName, user.lastName, user.name);

  return (
    <TableRow hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#22305B",
              fontSize: 13,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Box
              sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}
            >
              <Typography
                component={Link}
                href={`/dashboard/user-management/${user.id}`}
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: "#22305B",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#31487f",
                    textDecoration: "underline",
                  },
                }}
              >
                {fullName}
              </Typography>
              {!user.infoFilled && (
                <Tooltip title="User has not completed user info form" arrow>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      color: "#d9822b",
                    }}
                  >
                    <WarningAmberRoundedIcon sx={{ fontSize: 16 }} />
                  </Box>
                </Tooltip>
              )}
            </Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user.email ?? "No email on file"}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#31487f" }}>
          {user.phoneNumber ?? "No phone number"}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Chip
          label={formatRoleLabel(user.role)}
          size="small"
          sx={{
            fontWeight: 700,
            color: user.role === "admin" ? "#22305B" : "#276636",
            bgcolor:
              user.role === "admin"
                ? alpha("#22305B", 0.1)
                : alpha("#276636", 0.12),
            border: "1px solid",
            borderColor:
              user.role === "admin"
                ? alpha("#22305B", 0.16)
                : alpha("#276636", 0.18),
          }}
        />
      </TableCell>
    </TableRow>
  );
}

async function getUsers(): Promise<UserRecord[]> {
  const records = await db
    .select({
      id: users.id,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      name: users.name,
      phoneNumber: userInfo.phoneNumber,
      email: users.email,
      infoFilled: users.infoFilled,
      role: users.role,
    })
    .from(users)
    .leftJoin(userInfo, eq(userInfo.userId, users.id))
    .orderBy(asc(userInfo.lastName), asc(userInfo.firstName), asc(users.email));

  return records;
}

export default async function UserManagementPage(): Promise<React.ReactElement> {
  const session = await auth();

  if (session?.user?.role !== "admin" && session?.user?.role !== "manager") {
    redirect("/dashboard");
  }

  const people = await getUsers();

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1120,
        mx: "auto",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          A condensed view of each user&apos;s name, contact details, and
          account role.
        </Typography>
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
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#dfe7f2" }}>
              <TableCell
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1.1,
                  color: "#4b6287",
                  fontSize: 12,
                  textTransform: "uppercase",
                  borderBottom: "1px solid #cfd8e6",
                }}
              >
                User
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1.1,
                  color: "#4b6287",
                  fontSize: 12,
                  textTransform: "uppercase",
                  borderBottom: "1px solid #cfd8e6",
                }}
              >
                Phone
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1.1,
                  color: "#4b6287",
                  fontSize: 12,
                  textTransform: "uppercase",
                  borderBottom: "1px solid #cfd8e6",
                }}
              >
                Role
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {people.length > 0 ? (
              people.map((user) => <UserRow key={user.id} user={user} />)
            ) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ px: 3, py: 5, border: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    No users found.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.75 }}
                  >
                    User records will appear here once accounts are created.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
