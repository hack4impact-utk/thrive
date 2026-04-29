import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PlaceIcon from "@mui/icons-material/Place";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import {
  alpha,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { ElementType } from "react";

import PageContainer from "@/components/layout/PageContainer";
import { auth } from "@/lib/auth";
import { ROLE_COLORS } from "@/lib/role-colors";

type DashboardAction = {
  title: string;
  description: string;
  href: string;
  icon: ElementType;
  adminOnly?: boolean;
};

const actions: DashboardAction[] = [
  {
    title: "Create Event",
    description:
      "Build one-time volunteer opportunities with scheduling details.",
    href: "/dashboard/create-event",
    icon: CalendarMonthIcon,
  },
  {
    title: "Recurring Templates",
    description: "Set up repeating events and manage reusable schedules.",
    href: "/dashboard/recurring-event",
    icon: AutoModeIcon,
  },
  {
    title: "Events Library",
    description: "Browse, edit, and organize the events your team is running.",
    href: "/dashboard/events-library",
    icon: FolderSharedIcon,
  },
  {
    title: "Manage Locations",
    description: "Add named venues that can be assigned to events.",
    href: "/dashboard/manage-locations",
    icon: PlaceIcon,
    adminOnly: true,
  },
  {
    title: "User Management",
    description:
      "Review volunteer profiles, roles, and account access in one place.",
    href: "/dashboard/user-management",
    icon: ManageAccountsIcon,
  },
  {
    title: "Volunteer Hours",
    description:
      "Track hours volunteered across all locations and date ranges.",
    href: "/dashboard/volunteer-hours",
    icon: VolunteerActivismIcon,
    adminOnly: true,
  },
];

function ActionCard({
  title,
  description,
  href,
  icon: Icon,
  color,
}: DashboardAction & { color: string }): React.ReactElement {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
        "&:hover": {
          borderColor: alpha(color, 0.5),
          boxShadow: `0 4px 20px ${alpha(color, 0.1)}`,
          "& .card-arrow": { opacity: 1, transform: "translateX(0)" },
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={href}
        sx={{
          height: "100%",
          alignItems: "flex-start",
          "& .MuiCardActionArea-focusHighlight": { bgcolor: color },
        }}
      >
        <CardContent sx={{ p: 3, height: "100%" }}>
          <Stack spacing={2.5} height="100%">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: alpha(color, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon sx={{ fontSize: 24, color }} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                gap={1}
                mb={1}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: "text.primary",
                  }}
                >
                  {title}
                </Typography>
                <ArrowForwardIcon
                  className="card-arrow"
                  sx={{
                    fontSize: 16,
                    color,
                    flexShrink: 0,
                    mt: 0.25,
                    opacity: 0,
                    transform: "translateX(-4px)",
                    transition: "opacity 150ms ease, transform 150ms ease",
                  }}
                />
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ lineHeight: 1.6, fontSize: "0.825rem" }}
              >
                {description}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default async function DashboardHubPage(): Promise<React.ReactElement> {
  const session = await auth();
  const role = session?.user?.role;
  const isManager = role === "manager";
  const roleColor = isManager ? ROLE_COLORS.manager : ROLE_COLORS.admin;

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={6}>
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            sx={{ color: "text.primary" }}
          >
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a tool below to get started.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {actions
            .filter((action) => !action.adminOnly || role === "admin")
            .map((action) => (
              <Grid key={action.title} size={{ xs: 12, sm: 6, md: 4 }}>
                <ActionCard
                  title={action.title}
                  description={action.description}
                  href={action.href}
                  icon={action.icon}
                  color={roleColor}
                />
              </Grid>
            ))}
        </Grid>
      </Stack>
    </PageContainer>
  );
}
