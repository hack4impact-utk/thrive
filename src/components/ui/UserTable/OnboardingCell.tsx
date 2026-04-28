"use client";

import { CircularProgress, MenuItem, Select } from "@mui/material";
import { useState } from "react";

import { updateUserOnboarding } from "@/actions/update-user-onboarding";

type Props = {
  userId: string;
  onboarded: boolean;
};

export default function OnboardingCell({
  userId,
  onboarded: initialOnboarded,
}: Props): React.ReactElement {
  const [onboarded, setOnboarded] = useState(initialOnboarded);
  const [loading, setLoading] = useState(false);

  const handleChange = async (value: boolean): Promise<void> => {
    setLoading(true);
    try {
      await updateUserOnboarding(userId, value);
      setOnboarded(value);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress size={16} />;
  }

  return (
    <Select
      value={onboarded ? "complete" : "pending"}
      onChange={(e) => handleChange(e.target.value === "complete")}
      size="small"
      sx={{ fontSize: 14, minWidth: 110 }}
    >
      <MenuItem value="pending" sx={{ fontSize: 14 }}>
        Pending
      </MenuItem>
      <MenuItem value="complete" sx={{ fontSize: 14 }}>
        Complete
      </MenuItem>
    </Select>
  );
}
