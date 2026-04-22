import AutoModeIcon from "@mui/icons-material/AutoMode";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CampaignIcon from "@mui/icons-material/Campaign";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import GroupsIcon from "@mui/icons-material/Groups";
import HubIcon from "@mui/icons-material/Hub";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PlaceIcon from "@mui/icons-material/Place";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  alpha,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { ElementType } from "react";

import PageContainer from "@/components/layout/PageContainer";
import { auth } from "@/lib/auth";

type DashboardAction = {
  title: string;
  description: string;
  href?: string;
  status: "available" | "planned";
  icon: ElementType;
};

const actions: DashboardAction[] = [
  {
    title: "Create Event",
    description:
      "Build one-time volunteer opportunities with scheduling details.",
    href: "/dashboard/create-event",
    status: "available",
    icon: CalendarMonthIcon,
  },
  {
    title: "Recurring Templates",
    description: "Set up repeating events and manage reusable schedules.",
    href: "/dashboard/recurring-event",
    status: "available",
    icon: AutoModeIcon,
  },
  {
    title: "Events Library",
    description: "Browse, edit, and organize the events your team is running.",
    href: "/dashboard/events-library",
    status: "available",
    icon: FolderSharedIcon,
  },
  {
    title: "Manage Locations",
    description: "Add named venues that can be assigned to events.",
    href: "/dashboard/create-location",
    status: "available",
    icon: PlaceIcon,
  },
  {
    title: "Event Groups",
    description:
      "Bundle related events together for larger programs and campaigns.",
    status: "planned",
    icon: HubIcon,
  },
  {
    title: "User Management",
    description:
      "Review volunteer profiles, roles, and account access in one place.",
    href: "/dashboard/user-management",
    status: "available",
    icon: ManageAccountsIcon,
  },
  {
    title: "User Groups",
    description:
      "Create cohorts for teams, partnerships, and targeted outreach.",
    status: "planned",
    icon: GroupsIcon,
  },
  {
    title: "Hour Approvals",
    description: "Approve, audit, and resolve volunteer hour submissions.",
    status: "planned",
    icon: FactCheckIcon,
  },
  {
    title: "QR Check-In",
    description: "Support faster onsite attendance tracking for volunteers.",
    status: "planned",
    icon: QrCode2Icon,
  },
  {
    title: "Import Users",
    description:
      "Bring in volunteer rosters from spreadsheets or partner systems.",
    status: "planned",
    icon: PersonAddAlt1Icon,
  },
  {
    title: "Reports",
    description:
      "Track engagement, participation, and program health over time.",
    status: "planned",
    icon: BarChartIcon,
  },
  {
    title: "Communications",
    description: "Reach volunteers with announcements, reminders, and updates.",
    status: "planned",
    icon: CampaignIcon,
  },
  {
    title: "Settings",
    description:
      "Control defaults, permissions, and workflow-wide configuration.",
    status: "planned",
    icon: SettingsIcon,
  },
];

const rolePalettes = {
  admin: {
    solid: "#22305B",
    solidAlt: "#31487f",
    accent: "#22A27E",
  },
  manager: {
    solid: "#276636",
    solidAlt: "#3d8450",
    accent: "#1f8f72",
  },
} as const;

function AvailableTile({
  title,
  description,
  href,
  icon: Icon,
  palette,
}: Omit<DashboardAction, "status"> & {
  palette: (typeof rolePalettes)[keyof typeof rolePalettes];
}): React.ReactElement {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: alpha(palette.solid, 0.18),
        background: `linear-gradient(160deg, ${palette.solid} 0%, ${palette.solidAlt} 100%)`,
        boxShadow: `0 12px 28px ${alpha(palette.solid, 0.16)}`,
        transition:
          "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 18px 32px ${alpha(palette.solid, 0.22)}`,
          borderColor: alpha(palette.accent, 0.4),
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={href ?? "#"}
        sx={{
          height: "100%",
          alignItems: "flex-start",
          "&:hover .MuiCardActionArea-focusHighlight": { opacity: 0 },
        }}
      >
        <CardContent sx={{ p: 2.5, height: "100%" }}>
          <Stack spacing={1.5} height="100%">
            <Box
              sx={{
                width: 44,
                height: 44,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                bgcolor: alpha("#ffffff", 0.14),
                border: "1px solid",
                borderColor: alpha("#ffffff", 0.18),
                flexShrink: 0,
              }}
            >
              <Icon sx={{ fontSize: 22, color: "#ffffff" }} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={0.75}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, lineHeight: 1.25, color: "#ffffff" }}
                >
                  {title}
                </Typography>
                <ChevronRightIcon
                  sx={{
                    fontSize: 18,
                    color: alpha("#ffffff", 0.6),
                    flexShrink: 0,
                  }}
                />
              </Stack>

              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.82rem",
                  lineHeight: 1.5,
                  color: alpha("#ffffff", 0.82),
                }}
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

function PlannedTile({
  title,
  description,
  icon: Icon,
  palette,
}: Omit<DashboardAction, "status" | "href"> & {
  palette: (typeof rolePalettes)[keyof typeof rolePalettes];
}): React.ReactElement {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: alpha(palette.solid, 0.1),
        background: `linear-gradient(180deg, ${alpha(palette.solid, 0.06)} 0%, ${alpha(palette.solid, 0.03)} 100%)`,
        cursor: "default",
      }}
    >
      <CardContent sx={{ p: 2.5, height: "100%" }}>
        <Stack spacing={1.5} height="100%">
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                display: "grid",
                placeItems: "center",
                borderRadius: 2,
                bgcolor: alpha(palette.solid, 0.07),
                border: "1px solid",
                borderColor: alpha(palette.solid, 0.1),
                flexShrink: 0,
              }}
            >
              <Icon sx={{ fontSize: 22, color: alpha(palette.solid, 0.45) }} />
            </Box>
            <Chip
              label="Coming Soon"
              size="small"
              sx={{
                height: 22,
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
                bgcolor: alpha(palette.solid, 0.08),
                color: alpha(palette.solid, 0.6),
                border: "1px solid",
                borderColor: alpha(palette.solid, 0.12),
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Stack>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                lineHeight: 1.25,
                mb: 0.75,
                color: alpha(palette.solid, 0.7),
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontSize: "0.82rem",
                lineHeight: 1.5,
                color: "text.secondary",
              }}
            >
              {description}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default async function DashboardHubPage(): Promise<React.ReactElement> {
  const session = await auth();
  const role = session?.user?.role;
  const palette =
    role === "manager" ? rolePalettes.manager : rolePalettes.admin;

  const available = actions.filter((a) => a.status === "available");
  const planned = actions.filter((a) => a.status === "planned");

  return (
    <PageContainer sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={5}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a tool below to get started.
          </Typography>
        </Box>

        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={600}
              lineHeight={1}
            >
              Available
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>

          <Grid container spacing={1.5}>
            {available.map((action) => (
              <Grid key={action.title} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <AvailableTile
                  title={action.title}
                  description={action.description}
                  href={action.href}
                  icon={action.icon}
                  palette={palette}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>

        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={600}
              lineHeight={1}
            >
              Coming Soon
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Stack>

          <Grid container spacing={1.5}>
            {planned.map((action) => (
              <Grid key={action.title} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <PlannedTile
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  palette={palette}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </PageContainer>
  );
}
