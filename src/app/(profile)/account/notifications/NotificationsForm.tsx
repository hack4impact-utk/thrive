"use client";

import {
  Box,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

import { updateNotificationPreferences } from "@/actions/update-notification-preferences";
import PageContainer from "@/components/layout/PageContainer";
import { useSnackbar } from "@/providers/snackbar-provider";

type NotificationPrefs = {
  emailRegistrationReminder: boolean;
  emailUnregistrationReminder: boolean;
  emailDayOfReminder: boolean;
  emailStaffRegistrationNotifications: boolean;
  emailStaffUnregistrationNotifications: boolean;
};

type Props = {
  initialValues: NotificationPrefs;
  isStaff: boolean;
};

type NotificationSetting = {
  field: keyof NotificationPrefs;
  label: string;
  description: string;
};

const SETTINGS: NotificationSetting[] = [
  {
    field: "emailRegistrationReminder",
    label: "Registration confirmation",
    description: "Receive an email when you register for an event.",
  },
  {
    field: "emailUnregistrationReminder",
    label: "Unregistration confirmation",
    description: "Receive an email when you unregister from an event.",
  },
  {
    field: "emailDayOfReminder",
    label: "Day-of reminder",
    description:
      "Receive a reminder email on the day of your registered events.",
  },
];

const STAFF_SETTINGS: NotificationSetting[] = [
  {
    field: "emailStaffRegistrationNotifications",
    label: "New volunteer registrations",
    description:
      "Receive an email when a volunteer registers for an event you manage.",
  },
  {
    field: "emailStaffUnregistrationNotifications",
    label: "Volunteer unregistrations",
    description:
      "Receive an email when a volunteer unregisters from an event you manage.",
  },
];

export default function NotificationsForm({
  initialValues,
  isStaff,
}: Props): React.ReactElement {
  const { showSnackbar } = useSnackbar();
  const [prefs, setPrefs] = useState<NotificationPrefs>(initialValues);
  const [saving, setSaving] = useState<keyof NotificationPrefs | null>(null);

  async function handleToggle(field: keyof NotificationPrefs): Promise<void> {
    const updated = { ...prefs, [field]: !prefs[field] };
    setPrefs(updated);
    setSaving(field);
    try {
      await updateNotificationPreferences(updated);
      showSnackbar("Notification preferences saved.", "success");
    } catch {
      setPrefs(prefs);
      showSnackbar("Failed to save preferences. Please try again.", "error");
    } finally {
      setSaving(null);
    }
  }

  return (
    <PageContainer maxWidth={600} sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h5" fontWeight={700} mb={1}>
        Notification Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Control which email notifications you receive from Thrive.
      </Typography>

      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {SETTINGS.map((setting, index) => (
          <React.Fragment key={setting.field}>
            {index > 0 && <Divider />}
            <Box sx={{ px: 3, py: 2.5 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={prefs[setting.field]}
                    disabled={saving === setting.field}
                    onChange={() => void handleToggle(setting.field)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {setting.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {setting.description}
                    </Typography>
                  </Box>
                }
                labelPlacement="start"
                sx={{ width: "100%", justifyContent: "space-between", ml: 0 }}
              />
            </Box>
          </React.Fragment>
        ))}
      </Box>

      {isStaff && (
        <>
          <Typography variant="h6" fontWeight={700} mt={4} mb={1}>
            Staff notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Admins receive notifications for every location. Managers receive
            them only for their assigned location.
          </Typography>

          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            {STAFF_SETTINGS.map((setting, index) => (
              <React.Fragment key={setting.field}>
                {index > 0 && <Divider />}
                <Box sx={{ px: 3, py: 2.5 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={prefs[setting.field]}
                        disabled={saving === setting.field}
                        onChange={() => void handleToggle(setting.field)}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {setting.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {setting.description}
                        </Typography>
                      </Box>
                    }
                    labelPlacement="start"
                    sx={{
                      width: "100%",
                      justifyContent: "space-between",
                      ml: 0,
                    }}
                  />
                </Box>
              </React.Fragment>
            ))}
          </Box>
        </>
      )}
    </PageContainer>
  );
}
