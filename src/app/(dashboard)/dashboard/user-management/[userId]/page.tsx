import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
import db from "@/db";
import { userInfo, users } from "@/db/schema";
import { auth } from "@/lib/auth";

type UserDetailRecord = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  infoFilled: boolean;
  firstName: string | null;
  lastName: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  phoneNumber: string | null;
  birthMonth: number | null;
  birthDay: number | null;
  birthYear: number | null;
  preferredNeighborhood: string | null;
  gender: string | null;
  shirtSize: string | null;
  medicalNotes: string | null;
};

function formatDisplayName(user: UserDetailRecord): string {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return fullName || user.name || "Profile incomplete";
}

function formatOptionalValue(value: string | null): string {
  return value?.trim() || "Not provided";
}

function formatBirthDate(user: UserDetailRecord): string {
  if (!user.birthMonth || !user.birthDay || !user.birthYear) {
    return "Not provided";
  }

  const date = new Date(user.birthYear, user.birthMonth - 1, user.birthDay);

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}): React.ReactElement {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mb: 0.2,
          lineHeight: 1.1,
          color: "text.secondary",
          letterSpacing: 0.9,
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: 600, color: "#22305B", lineHeight: 1.25 }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function DetailSection({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string }[];
}): React.ReactElement {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardHeader
        title={
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#22305B", lineHeight: 1.15 }}
          >
            {title}
          </Typography>
        }
        sx={{ px: { xs: 1.75, md: 2.25 }, pt: { xs: 1.75, md: 2.25 }, pb: 0 }}
      />
      <CardContent
        sx={{
          px: { xs: 1.75, md: 2.25 },
          pt: 1.25,
          pb: { xs: 1.75, md: 2.25 },
          "&:last-child": { pb: { xs: 1.75, md: 2.25 } },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            rowGap: 1.25,
            columnGap: 1.75,
          }}
        >
          {items.map((item) => (
            <DetailItem
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}

async function getUserDetails(
  userId: string,
): Promise<UserDetailRecord | undefined> {
  const [record] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      infoFilled: users.infoFilled,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      addressLine1: userInfo.addressLine1,
      addressLine2: userInfo.addressLine2,
      city: userInfo.city,
      state: userInfo.state,
      postalCode: userInfo.postalCode,
      country: userInfo.country,
      phoneNumber: userInfo.phoneNumber,
      birthMonth: userInfo.birthMonth,
      birthDay: userInfo.birthDay,
      birthYear: userInfo.birthYear,
      preferredNeighborhood: userInfo.preferredNeighborhood,
      gender: userInfo.gender,
      shirtSize: userInfo.shirtSize,
      medicalNotes: userInfo.medicalNotes,
    })
    .from(users)
    .leftJoin(userInfo, eq(userInfo.userId, users.id))
    .where(eq(users.id, userId));

  return record;
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}): Promise<React.ReactElement> {
  const session = await auth();

  if (session?.user?.role !== "admin" && session?.user?.role !== "manager") {
    redirect("/dashboard");
  }

  const { userId } = await params;
  const user = await getUserDetails(userId);

  if (!user) {
    notFound();
  }

  return (
    <PageContainer sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Stack spacing={1.75}>
        <Box>
          <Button
            component={Link}
            href="/dashboard/user-management"
            startIcon={<ArrowBackRoundedIcon />}
            size="small"
            sx={{
              color: "#4b6287",
              textTransform: "none",
              fontWeight: 500,
              px: 0,
              "&:hover": {
                bgcolor: "transparent",
                textDecoration: "underline",
              },
            }}
            disableRipple
          >
            Back to User Management
          </Button>
        </Box>

        <DetailSection
          title="Account"
          items={[
            { label: "Full Name", value: formatDisplayName(user) },
            { label: "Email", value: user.email ?? "No email on file" },
            {
              label: "Role",
              value: user.role
                .split("_")
                .map(
                  (segment) =>
                    segment.charAt(0).toUpperCase() + segment.slice(1),
                )
                .join(" "),
            },
            {
              label: "Profile Status",
              value: user.infoFilled ? "Completed" : "Incomplete",
            },
          ]}
        />

        <DetailSection
          title="Contact"
          items={[
            {
              label: "Phone Number",
              value: formatOptionalValue(user.phoneNumber),
            },
            {
              label: "Address Line 1",
              value: formatOptionalValue(user.addressLine1),
            },
            {
              label: "Address Line 2",
              value: formatOptionalValue(user.addressLine2),
            },
            { label: "City", value: formatOptionalValue(user.city) },
            { label: "State", value: formatOptionalValue(user.state) },
            {
              label: "Postal Code",
              value: formatOptionalValue(user.postalCode),
            },
            { label: "Country", value: formatOptionalValue(user.country) },
          ]}
        />

        <DetailSection
          title="Personal"
          items={[
            { label: "First Name", value: formatOptionalValue(user.firstName) },
            { label: "Last Name", value: formatOptionalValue(user.lastName) },
            { label: "Birth Date", value: formatBirthDate(user) },
            { label: "Gender", value: formatOptionalValue(user.gender) },
          ]}
        />

        <DetailSection
          title="Preferences"
          items={[
            {
              label: "Preferred Neighborhood",
              value: formatOptionalValue(user.preferredNeighborhood),
            },
            { label: "Shirt Size", value: formatOptionalValue(user.shirtSize) },
          ]}
        />

        <DetailSection
          title="Medical"
          items={[
            {
              label: "Medical Notes",
              value: formatOptionalValue(user.medicalNotes),
            },
          ]}
        />
      </Stack>
    </PageContainer>
  );
}
