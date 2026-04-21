"use client";

import { Box, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import * as React from "react";

import FormLayout from "@/components/layout/FormLayout";

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
    state: "",
    postalCode: "",
    country: "US",
  });

  const router = useRouter();

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

    router.push("/dashboard");
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

        <TextField
          name="state"
          label="State"
          required
          sx={{ width: 200 }}
          value={form.state}
          onChange={handleChange}
        />

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
