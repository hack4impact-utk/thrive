import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import { alpha, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { asc, eq } from "drizzle-orm";
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

  if (fullName) {
    return fullName;
  }

  return name || "Profile incomplete";
}

function UserRow({
  user,
  isFirst,
}: {
  user: UserRecord;
  isFirst: boolean;
}): React.ReactElement {
  const fullName = formatFullName(user.firstName, user.lastName, user.name);

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: 1.75,
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 1fr)",
          md: "minmax(0, 1.35fr) minmax(0, 1fr) 140px",
        },
        gap: 1.5,
        alignItems: "center",
        borderTop: isFirst ? "none" : "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            fontWeight: 700,
            color: "#22305B",
            lineHeight: 1.2,
          }}
        >
          <Typography
            variant="subtitle1"
            component="span"
            sx={{ fontWeight: 700, color: "#22305B", lineHeight: 1.2 }}
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
                <WarningAmberRoundedIcon sx={{ fontSize: 18 }} />
              </Box>
            </Tooltip>
          )}
        </Box>
        <Typography
          variant="body2"
          sx={{
            mt: 0.4,
            color: "text.secondary",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {user.email ?? "No email on file"}
        </Typography>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            color: "text.secondary",
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          Phone
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#31487f" }}>
          {user.phoneNumber ?? "No phone number"}
        </Typography>
      </Box>

      <Stack
        direction="row"
        justifyContent={{ xs: "flex-start", md: "flex-end" }}
      >
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
      </Stack>
    </Box>
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

  if (session?.user?.role !== "admin") {
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
          User Managment
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          A condensed view of each user&apos;s name, contact details, and
          account role.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.25,
            display: { xs: "none", md: "grid" },
            gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr) 140px",
            gap: 1.5,
            bgcolor: "#dfe7f2",
            borderBottom: "1px solid",
            borderColor: "#cfd8e6",
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, letterSpacing: 1.1, color: "#4b6287" }}
          >
            USER
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, letterSpacing: 1.1, color: "#4b6287" }}
          >
            PHONE
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              letterSpacing: 1.1,
              color: "#4b6287",
              textAlign: "right",
            }}
          >
            ROLE
          </Typography>
        </Box>

        {people.length > 0 ? (
          people.map((user, index) => (
            <UserRow key={user.id} user={user} isFirst={index === 0} />
          ))
        ) : (
          <Box sx={{ px: 3, py: 5 }}>
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
          </Box>
        )}
      </Paper>
    </Box>
  );
}
