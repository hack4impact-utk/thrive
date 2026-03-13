"use client";

import {
  Box,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";

import SubmitFormButton from "@/components/Button/SubmitFormButton";

const US_STATES = [
  { value: "AL", label: "AL" },
  { value: "AK", label: "AK" },
  { value: "AZ", label: "AZ" },
  { value: "AR", label: "AR" },
  { value: "CA", label: "CA" },
  { value: "CO", label: "CO" },
  { value: "CT", label: "CT" },
  { value: "DE", label: "DE" },
  { value: "FL", label: "FL" },
  { value: "GA", label: "GA" },
  { value: "HI", label: "HI" },
  { value: "ID", label: "ID" },
  { value: "IL", label: "IL" },
  { value: "IN", label: "IN" },
  { value: "IA", label: "IA" },
  { value: "KS", label: "KS" },
  { value: "KY", label: "KY" },
  { value: "LA", label: "LA" },
  { value: "ME", label: "ME" },
  { value: "MD", label: "MD" },
  { value: "MA", label: "MA" },
  { value: "MI", label: "MI" },
  { value: "MN", label: "MN" },
  { value: "MS", label: "MS" },
  { value: "MO", label: "MO" },
  { value: "MT", label: "MT" },
  { value: "NE", label: "NE" },
  { value: "NV", label: "NV" },
  { value: "NH", label: "NH" },
  { value: "NJ", label: "NJ" },
  { value: "NM", label: "NM" },
  { value: "NY", label: "NY" },
  { value: "NC", label: "NC" },
  { value: "ND", label: "ND" },
  { value: "OH", label: "OH" },
  { value: "OK", label: "OK" },
  { value: "OR", label: "OR" },
  { value: "PA", label: "PA" },
  { value: "RI", label: "RI" },
  { value: "SC", label: "SC" },
  { value: "SD", label: "SD" },
  { value: "TN", label: "TN" },
  { value: "TX", label: "TX" },
  { value: "UT", label: "UT" },
  { value: "VT", label: "VT" },
  { value: "VA", label: "VA" },
  { value: "WA", label: "WA" },
  { value: "WV", label: "WV" },
  { value: "WI", label: "WI" },
  { value: "WY", label: "WY" },
];

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

  const [errors, setErrors] = React.useState<
    Partial<Record<keyof CreateEventFormState, string>>
  >({});

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ): void {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    const newErrors: Partial<Record<keyof CreateEventFormState, string>> = {};

    // Required fields
    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.eventDate) newErrors.eventDate = "Event date is required.";
    if (!form.startTime) newErrors.startTime = "Start time is required.";
    if (!form.endTime) newErrors.endTime = "End time is required.";
    if (!form.streetLine.trim())
      newErrors.streetLine = "Street address is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    if (!form.state.trim()) newErrors.state = "State is required.";
    if (!form.postalCode.trim()) newErrors.postalCode = "Zip is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";

    // Value-based validations
    if (
      form.eventDate &&
      form.eventDate < new Date().toISOString().split("T")[0]
    ) {
      newErrors.eventDate = "Event date cannot be in the past.";
    }

    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      newErrors.startTime = "Start time must be before end time.";
      newErrors.endTime = "End time must be after start time.";
    }

    if (form.capacity && Number(form.capacity) <= 0) {
      newErrors.capacity = "Capacity must be a positive number.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

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
              height: "2000px",
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
              error={Boolean(errors.title)}
              helperText={errors.title}
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
              error={Boolean(errors.eventDate)}
              helperText={errors.eventDate}
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
                error={Boolean(errors.startTime)}
                helperText={errors.startTime}
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
                error={Boolean(errors.endTime)}
                helperText={errors.endTime}
              />
            </Box>

            <TextField
              name="capacity"
              type="number"
              label="Capacity"
              fullWidth
              value={form.capacity}
              onChange={handleChange}
              error={Boolean(errors.capacity)}
              helperText={errors.capacity}
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
              error={Boolean(errors.streetLine)}
              helperText={errors.streetLine}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                name="city"
                label="City"
                required
                fullWidth
                value={form.city}
                onChange={handleChange}
                sx={{ flex: 1, minWidth: 0 }}
                error={Boolean(errors.city)}
                helperText={errors.city}
              />
              <FormControl
                sx={{ width: 120, flexShrink: 0 }}
                error={Boolean(errors.state)}
              >
                <InputLabel id="state-select-label">State *</InputLabel>
                <Select
                  labelId="state-select-label"
                  id="state-select"
                  name="state"
                  required
                  value={form.state}
                  sx={{ width: 120 }}
                  label="State"
                  onChange={handleChange}
                  MenuProps={{
                    disablePortal: true,
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    transformOrigin: {
                      vertical: "top",
                      horizontal: "left",
                    },
                  }}
                >
                  {US_STATES.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{errors.state}</FormHelperText>
              </FormControl>
              <TextField
                name="postalCode"
                label="Zip"
                required
                sx={{ width: 140, flexShrink: 0 }}
                value={form.postalCode}
                onChange={handleChange}
                error={Boolean(errors.postalCode)}
                helperText={errors.postalCode}
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
              error={Boolean(errors.description)}
              helperText={errors.description}
            />

            {/* Submit */}
            <SubmitFormButton label="Create Event" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
