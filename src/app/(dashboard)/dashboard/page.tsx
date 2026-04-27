import AutoModeIcon from "@mui/icons-material/AutoMode";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PlaceIcon from "@mui/icons-material/Place";
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

type DashboardAction = {
  title: string;
  description: string;
  href: string;
  icon: ElementType;
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
  },
  {
    title: "User Management",
    description:
      "Review volunteer profiles, roles, and account access in one place.",
    href: "/dashboard/user-management",
    icon: ManageAccountsIcon,
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
}: DashboardAction & {
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
        href={href}
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

export default async function DashboardHubPage(): Promise<React.ReactElement> {
  const session = await auth();
  const role = session?.user?.role;
  const palette =
    role === "manager" ? rolePalettes.manager : rolePalettes.admin;

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

        <Grid container spacing={1.5}>
          {actions.map((action) => (
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
    </PageContainer>
  );
}
