"use client";

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import * as React from "react";

import FormLayout from "@/components/layout/FormLayout";

type Location = {
  id: string;
  name: string;
  streetLine: string;
  city: string;
  state: string;
  postalCode: string;
};

type CreateEventFormState = {
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: string;
  locationId: string;
  description: string;
};

export default function OneTimeEventCreationForm(): React.ReactElement {
  const [form, setForm] = React.useState<CreateEventFormState>({
    title: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    capacity: "",
    locationId: "",
    description: "",
  });

  const [unlimitedCapacity, setUnlimitedCapacity] = React.useState(false);
  const [locationOptions, setLocationOptions] = React.useState<Location[]>([]);

  const router = useRouter();

  React.useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then(setLocationOptions)
      .catch(console.error);
  }, []);

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
        capacity: unlimitedCapacity
          ? null
          : form.capacity
            ? Number(form.capacity)
            : null,
        locationId: form.locationId || null,
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
      locationId: "",
      description: "",
    });
    setUnlimitedCapacity(false);
  }

  return (
    <FormLayout
      title="Create Event"
      description="* indicates required field"
      submitLabel="Create Event"
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

      <Box>
        <TextField
          name="capacity"
          type="number"
          label="Capacity"
          fullWidth
          value={unlimitedCapacity ? "" : form.capacity}
          onChange={handleChange}
          disabled={unlimitedCapacity}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={unlimitedCapacity}
              onChange={(e) => {
                setUnlimitedCapacity(e.target.checked);
                if (e.target.checked) {
                  setForm((prev) => ({ ...prev, capacity: "" }));
                }
              }}
            />
          }
          label="Unlimited capacity"
          sx={{ mt: 0.5 }}
        />
      </Box>

      <FormControl fullWidth>
        <InputLabel id="location-label">Location</InputLabel>
        <Select
          labelId="location-label"
          value={form.locationId}
          label="Location"
          onChange={(e) =>
            setForm((prev) => ({ ...prev, locationId: e.target.value }))
          }
        >
          <MenuItem value="">
            <em>No location selected</em>
          </MenuItem>
          {locationOptions.map((loc) => (
            <MenuItem key={loc.id} value={loc.id}>
              {loc.name} — {loc.streetLine}, {loc.city}, {loc.state}{" "}
              {loc.postalCode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FormLayout>
  );
}
