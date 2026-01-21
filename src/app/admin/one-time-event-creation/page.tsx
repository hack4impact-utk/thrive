"use client";

import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

export default function CreateEventForm(): React.ReactElement {
  const [form, setForm] = useState({
    title: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    capacity: "",
    streetLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    description: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
        country: "US",
        description: form.description,
      }),
    });

    const text = await res.text();

    if (!res.ok) {
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
      country: "",
      description: "",
    });
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "5%",
        gap: 2,
        width: "100%",
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      <TextField
        name="title"
        label="Title"
        required
        value={form.title}
        onChange={handleChange}
      />

      <TextField
        name="eventDate"
        type="date"
        label="Event Date"
        required
        value={form.eventDate}
        onChange={handleChange}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <TextField
        name="startTime"
        type="time"
        label="Start Time"
        required
        value={form.startTime}
        onChange={handleChange}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: {
            step: 900,
          },
        }}
      />

      <TextField
        name="endTime"
        type="time"
        label="End Time"
        required
        value={form.endTime}
        onChange={handleChange}
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: {
            step: 900,
          },
        }}
      />

      <TextField
        name="capacity"
        type="number"
        label="Capacity"
        value={form.capacity}
        onChange={handleChange}
      />

      <TextField
        name="streetLine"
        label="Street Address"
        required
        value={form.streetLine}
        onChange={handleChange}
      />

      <TextField
        name="city"
        label="City"
        required
        value={form.city}
        onChange={handleChange}
      />

      <TextField
        name="state"
        label="State"
        required
        value={form.state}
        onChange={handleChange}
      />

      <TextField
        name="postalCode"
        label="Postal Code"
        required
        value={form.postalCode}
        onChange={handleChange}
      />

      <TextField
        name="description"
        label="Description"
        multiline
        rows={3}
        required
        value={form.description}
        onChange={handleChange}
      />

      <Button type="submit" variant="contained">
        Create Event
      </Button>
    </Box>
  );
}
