"use client";

import { Box, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import * as React from "react";

import FormLayout from "@/components/layout/FormLayout";

type CreateEventFormState = {
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: string;
  streetLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  description: string;
};

export default function OneTimeEventCreationForm(): React.ReactElement {
  const [form, setForm] = React.useState<CreateEventFormState>({
    title: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    capacity: "",
    streetLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    description: "",
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

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        eventDate: form.eventDate,
        startTime: form.startTime,
        endTime: form.endTime,
        capacity: form.capacity ? Number(form.capacity) : null,
        streetLine: form.streetLine,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country,
        description: form.description,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Create event failed:", res.status, text);
      return;
    }

    router.push("/");

    setForm({
      title: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      capacity: "",
      streetLine: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
      description: "",
    });
  }

  return (
    <FormLayout
      title="Create Recurring Event"
      description="* indicates required field"
      submitLabel="Create Recurring Event"
      onSubmit={handleSubmit}
    >
      <TextField
        name="title"
        label="Title"
        required
        fullWidth
        value={form.title}
        onChange={handleChange}
      />

      <TextField
        name="description"
        label="Description"
        required
        multiline
        rows={3}
        fullWidth
        value={form.description}
        onChange={handleChange}
      />

      <TextField
        name="eventDate"
        type="date"
        label="Event Date"
        required
        fullWidth
        value={form.eventDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          name="startTime"
          type="time"
          label="Start Time"
          required
          fullWidth
          value={form.startTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 900 }}
        />

        <TextField
          name="endTime"
          type="time"
          label="End Time"
          required
          fullWidth
          value={form.endTime}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 900 }}
        />
      </Box>

      <TextField
        name="capacity"
        type="number"
        label="Capacity (optional)"
        fullWidth
        value={form.capacity}
        onChange={handleChange}
      />

      {/* Location */}
      <Typography variant="h6">Location</Typography>

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
