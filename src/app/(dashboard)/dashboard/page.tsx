import AutoModeIcon from "@mui/icons-material/AutoMode";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CampaignIcon from "@mui/icons-material/Campaign";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import GroupsIcon from "@mui/icons-material/Groups";
import HubIcon from "@mui/icons-material/Hub";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import SettingsIcon from "@mui/icons-material/Settings";
import { alpha, Box, Container, Paper, Typography } from "@mui/material";
import Link from "next/link";
import { ElementType } from "react";

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
    status: "planned",
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

const colors = {
  primary: "#22A27E",
  white: "#ffffff",
};

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

function ActionTile({
  title,
  description,
  href,
  status,
  icon: Icon,
  palette,
}: DashboardAction & {
  palette: (typeof rolePalettes)[keyof typeof rolePalettes];
}): React.ReactElement {
  const isAvailable = status === "available";

  return (
    <Paper
      component={isAvailable ? Link : "div"}
      href={isAvailable ? href : undefined}
      elevation={0}
      sx={{
        minHeight: 168,
        p: 2,
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        borderRadius: 3,
        border: "1px solid",
        borderColor: isAvailable
          ? alpha(palette.solid, 0.18)
          : alpha(palette.solid, 0.1),
        background: isAvailable
          ? `linear-gradient(160deg, ${palette.solid} 0%, ${palette.solidAlt} 100%)`
          : `linear-gradient(180deg, ${alpha(palette.solid, 0.14)} 0%, ${alpha(palette.solid, 0.07)} 100%)`,
        color: isAvailable ? colors.white : palette.solid,
        boxShadow: isAvailable
          ? `0 12px 28px ${alpha(palette.solid, 0.16)}`
          : "none",
        transition:
          "transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease",
        cursor: isAvailable ? "pointer" : "default",
        "&:hover": isAvailable
          ? {
              transform: "translateY(-2px)",
              boxShadow: `0 18px 32px ${alpha(palette.solid, 0.2)}`,
              borderColor: alpha(palette.accent, 0.35),
            }
          : undefined,
      }}
    >
      <Box>
        <Box
          sx={{
            width: 44,
            height: 44,
            mb: 1.5,
            display: "grid",
            placeItems: "center",
            borderRadius: 2,
            bgcolor: isAvailable
              ? alpha(colors.white, 0.14)
              : alpha(colors.white, 0.62),
            border: "1px solid",
            borderColor: isAvailable
              ? alpha(colors.white, 0.18)
              : alpha(palette.solid, 0.12),
          }}
        >
          <Icon sx={{ fontSize: 24 }} />
        </Box>

        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, mb: 0.75, lineHeight: 1.25 }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontSize: "0.83rem",
            lineHeight: 1.45,
            color: isAvailable ? alpha(colors.white, 0.84) : "text.secondary",
          }}
        >
          {description}
        </Typography>
      </Box>
    </Paper>
  );
}

export default async function DashboardHubPage(): Promise<React.ReactElement> {
  const session = await auth();
  const role = session?.user?.role;
  const palette =
    role === "manager" ? rolePalettes.manager : rolePalettes.admin;

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, md: 3 } }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1.5,
          }}
        >
          {actions.map((action) => (
            <ActionTile key={action.title} {...action} palette={palette} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
