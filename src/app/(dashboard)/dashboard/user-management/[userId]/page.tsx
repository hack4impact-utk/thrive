import { Box, Stack } from "@mui/material";
import { redirect } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
import BackButton from "@/components/ui/BackButton";
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
          <BackButton label="Back" accentColor={accentColor} />
        </Box>

        <UserProfilePanel userId={userId} accentColor={accentColor} />
      </Stack>
    </PageContainer>
  );
}
