import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
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

import PageContainer from "@/components/layout/PageContainer";
import db from "@/db";
import { userInfo, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import RoleCell from "./RoleCell";

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

function formatFullName(
  firstName: string | null,
  lastName: string | null,
  name: string | null,
): string {
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  if (fullName) return fullName;
  return name || "Profile incomplete";
}

function UserRow({
  user,
  callerRole,
}: {
  user: UserRecord;
  callerRole: string;
}): React.ReactElement {
  const fullName = formatFullName(user.firstName, user.lastName, user.name);

  return (
    <TableRow hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <Typography
            component={Link}
            href={`/dashboard/user-management/${user.id}`}
            variant="body2"
            sx={{
              fontWeight: 600,
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
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {user.email ?? "—"}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography variant="body2" color="text.secondary">
          {user.phoneNumber ?? "—"}
        </Typography>
      </TableCell>
      <TableCell>
        <RoleCell
          userId={user.id}
          currentRole={user.role}
          callerRole={callerRole}
          userName={fullName}
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
  const callerRole = session?.user?.role ?? "";

  if (callerRole !== "admin" && callerRole !== "manager") {
    redirect("/dashboard");
  }

  const people = await getUsers();

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
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
          overflow: "auto",
          maxHeight: "calc(100vh - 220px)",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {["Full Name", "Email", "Phone", "Role"].map((heading) => (
                <TableCell
                  key={heading}
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 1.1,
                    color: "#4b6287",
                    fontSize: 12,
                    textTransform: "uppercase",
                    bgcolor: "#dfe7f2",
                    borderBottom: "1px solid #cfd8e6",
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {people.length > 0 ? (
              people.map((user) => (
                <UserRow key={user.id} user={user} callerRole={callerRole} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ px: 3, py: 5, border: 0 }}>
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
    </PageContainer>
  );
}
