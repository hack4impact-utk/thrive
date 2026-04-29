import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import { redirect } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
import UserProfilePanel from "@/components/ui/UserProfilePanel";
import { auth } from "@/lib/auth";
import { ROLE_COLORS } from "@/lib/role-colors";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<React.ReactElement> {
  const session = await auth();

  if (session?.user?.role !== "admin" && session?.user?.role !== "manager") {
    redirect("/dashboard");
  }

  const callerRole = session.user.role;
  const accentColor =
    callerRole === "manager" ? ROLE_COLORS.manager : ROLE_COLORS.admin;

  const { userId } = await params;

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Box>
          <Button
            component={Link}
            href="/dashboard/user-management"
            startIcon={<ArrowBackRoundedIcon />}
            size="small"
            disableRipple
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 500,
              px: 0,
              "&:hover": { bgcolor: "transparent", color: accentColor },
            }}
          >
            User Management
          </Button>
        </Box>

        <UserProfilePanel userId={userId} accentColor={accentColor} />
      </Stack>
    </PageContainer>
  );
}
