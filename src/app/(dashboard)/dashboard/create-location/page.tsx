"use client";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import * as React from "react";

import FormLayout from "@/components/layout/FormLayout";
import { useSnackbar } from "@/providers/snackbar-provider";

const US_STATES: { label: string; value: string }[] = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
];

type CreateLocationFormState = {
  name: string;
  streetLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export default function CreateLocationPage(): React.ReactElement {
  const [form, setForm] = React.useState<CreateLocationFormState>({
    name: "",
    streetLine: "",
    city: "",
    state: "TN",
    postalCode: "",
    country: "US",
  });

  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    const res = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Create location failed:", res.status, text);
      return;
    }

    showSnackbar("Location added successfully!", "success");
    router.push("/dashboard/manage-locations");
  }

  return (
    <FormLayout
      title="Add Location"
      description="* indicates required field"
      submitLabel="Save Location"
      onSubmit={handleSubmit}
    >
      <TextField
        name="name"
        label="Location Name"
        required
        fullWidth
        value={form.name}
        onChange={handleChange}
        placeholder="e.g. Lonsdale, Parkridge"
      />

      <TextField
        name="streetLine"
        label="Street Address"
        required
        fullWidth
        value={form.streetLine}
        onChange={handleChange}
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          name="city"
          label="City"
          required
          fullWidth
          value={form.city}
          onChange={handleChange}
        />

        <FormControl required sx={{ width: 200 }}>
          <InputLabel id="state-label">State</InputLabel>
          <Select
            labelId="state-label"
            label="State"
            value={form.state}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, state: e.target.value }))
            }
          >
            <MenuItem value="TN">Tennessee</MenuItem>
            <MenuItem divider disabled sx={{ my: 0, py: 0 }} />
            {US_STATES.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          name="postalCode"
          label="Zip"
          required
          sx={{ width: 170 }}
          value={form.postalCode}
          onChange={handleChange}
        />
      </Box>
    </FormLayout>
  );
}
