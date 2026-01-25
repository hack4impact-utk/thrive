"use client";

import { Box, Card, CardContent, TextField, Typography } from "@mui/material";
import * as React from "react";

import SubmitFormButton from "@/components/Button/SubmitFormButton";

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

export default function CreateEventForm(): React.ReactElement {
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

    alert("Event created successfully.");

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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 6,
        px: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 600 }}>
        <CardContent sx={{ px: 5, py: 4 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h5">Create Event</Typography>

            <Typography variant="body2" color="text.secondary">
              Fill out the details below to create a new event.
            </Typography>

            {/* Basic info */}
            <TextField
              name="title"
              label="Title"
              required
              fullWidth
              value={form.title}
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
              slotProps={{ inputLabel: { shrink: true } }}
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
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { step: 900 },
                }}
              />

              <TextField
                name="endTime"
                type="time"
                label="End Time"
                required
                fullWidth
                value={form.endTime}
                onChange={handleChange}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: { step: 900 },
                }}
              />
            </Box>

            <TextField
              name="capacity"
              type="number"
              label="Capacity"
              fullWidth
              value={form.capacity}
              onChange={handleChange}
            />

            {/* Location */}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Location
            </Typography>

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
                sx={{ width: 120 }}
                value={form.state}
                onChange={handleChange}
              />

              <TextField
                name="postalCode"
                label="Zip"
                required
                sx={{ width: 140 }}
                value={form.postalCode}
                onChange={handleChange}
              />
            </Box>

            {/* Description */}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Description
            </Typography>

            <TextField
              name="description"
              multiline
              rows={3}
              required
              fullWidth
              value={form.description}
              onChange={handleChange}
            />

            {/* Submit */}
            <SubmitFormButton label="Create Event" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
