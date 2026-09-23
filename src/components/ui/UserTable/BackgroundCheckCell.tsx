"use client";

import { CircularProgress, MenuItem, Select } from "@mui/material";
import { useState } from "react";

import { updateUserBackgroundCheck } from "@/actions/update-user-background-check";

type Props = {
  userId: string;
  backgroundCheck: boolean;
};

export default function BackgroundCheckCell({
  userId,
  backgroundCheck: initialBackgroundCheck,
}: Props): React.ReactElement {
  const [backgroundCheck, setBackgroundCheck] = useState(
    initialBackgroundCheck,
  );
  const [loading, setLoading] = useState(false);

  const handleChange = async (value: boolean): Promise<void> => {
    setLoading(true);
    try {
      await updateUserBackgroundCheck(userId, value);
      setBackgroundCheck(value);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress size={16} />;
  }

  return (
    <Select
      value={backgroundCheck ? "complete" : "incomplete"}
      onChange={(e) => handleChange(e.target.value === "complete")}
      size="small"
      sx={{ fontSize: 14, minWidth: 110 }}
    >
      <MenuItem value="incomplete" sx={{ fontSize: 14 }}>
        Incomplete
      </MenuItem>
      <MenuItem value="complete" sx={{ fontSize: 14 }}>
        Complete
      </MenuItem>
    </Select>
  );
}
