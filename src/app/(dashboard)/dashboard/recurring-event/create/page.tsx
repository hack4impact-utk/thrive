"use client";

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import * as React from "react";

import FormLayout from "@/components/layout/FormLayout";
import { useSnackbar } from "@/providers/snackbar-provider";

type Location = {
  id: string;
  name: string;
  streetLine: string;
  city: string;
  state: string;
  postalCode: string;
};

type RecurringEventFormState = {
  title: string;
  frequency: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  capacity: string;
  locationId: string;
  description: string;
};

type FormErrors = Partial<
  Record<keyof RecurringEventFormState | "capacity", string>
>;

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Monthly" },
];

export default function RecurringEventCreationForm(): React.ReactElement {
  const [form, setForm] = React.useState<RecurringEventFormState>({
    title: "",
    frequency: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    capacity: "",
    locationId: "",
    description: "",
  });

  const [unlimitedCapacity, setUnlimitedCapacity] = React.useState(false);
  const [locationOptions, setLocationOptions] = React.useState<Location[]>([]);
  const [errors, setErrors] = React.useState<FormErrors>({});

  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  React.useEffect(() => {
    void fetch("/api/locations")
      .then((r) => r.json())
      .then(setLocationOptions);
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.locationId) newErrors.locationId = "Location is required";
    if (!form.frequency) newErrors.frequency = "Frequency is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (form.endDate && form.endDate < form.startDate)
      newErrors.endDate = "End date must be after start date";
    if (!form.startTime) newErrors.startTime = "Start time is required";
    if (!form.endTime) newErrors.endTime = "End time is required";
    if (!unlimitedCapacity && !form.capacity)
      newErrors.capacity = "Enter a capacity or check Unlimited capacity";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const res = await fetch("/api/recurring-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        frequency: form.frequency,
        startDate: form.startDate,
        endDate: form.endDate || null,
        startTime: form.startTime,
        endTime: form.endTime,
        capacity: unlimitedCapacity ? null : Number(form.capacity),
        unlimitedCapacity,
        locationId: form.locationId,
        description: form.description,
      }),
    });

    if (!res.ok) {
      showSnackbar(
        "Failed to create recurring event. Please try again.",
        "error",
      );
      return;
    }

    showSnackbar("Recurring event created successfully!", "success");
    router.push("/dashboard/recurring-event");
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
        error={!!errors.title}
        helperText={errors.title}
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
        error={!!errors.description}
        helperText={errors.description}
      />

      <FormControl fullWidth required error={!!errors.locationId}>
        <InputLabel id="location-label">Location</InputLabel>
        <Select
          labelId="location-label"
          value={form.locationId}
          label="Location"
          onChange={(e) => {
            setForm((prev) => ({ ...prev, locationId: e.target.value }));
            setErrors((prev) => ({ ...prev, locationId: undefined }));
          }}
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
        {errors.locationId && (
          <FormHelperText>{errors.locationId}</FormHelperText>
        )}
      </FormControl>

      <FormControl fullWidth required error={!!errors.frequency}>
        <InputLabel id="frequency-label">Frequency</InputLabel>
        <Select
          labelId="frequency-label"
          value={form.frequency}
          label="Frequency"
          onChange={(e) => {
            setForm((prev) => ({ ...prev, frequency: e.target.value }));
            setErrors((prev) => ({ ...prev, frequency: undefined }));
          }}
        >
          <MenuItem value="">
            <em>Select frequency</em>
          </MenuItem>
          {FREQUENCY_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {errors.frequency && (
          <FormHelperText>{errors.frequency}</FormHelperText>
        )}
      </FormControl>

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          name="startDate"
          type="date"
          label="Start Date"
          required
          fullWidth
          value={form.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.startDate}
          helperText={errors.startDate}
        />
        <TextField
          name="endDate"
          type="date"
          label="End Date (optional)"
          fullWidth
          value={form.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          error={!!errors.endDate}
          helperText={errors.endDate ?? "Leave blank for no end date"}
        />
      </Box>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TimePicker
            label="Start Time *"
            minutesStep={5}
            value={
              form.startTime ? dayjs(`2000-01-01T${form.startTime}`) : null
            }
            onChange={(v: Dayjs | null) => {
              setForm((prev) => ({
                ...prev,
                startTime: v ? v.format("HH:mm") : "",
              }));
              setErrors((prev) => ({ ...prev, startTime: undefined }));
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.startTime,
                helperText: errors.startTime,
              },
            }}
          />
          <TimePicker
            label="End Time *"
            minutesStep={5}
            value={form.endTime ? dayjs(`2000-01-01T${form.endTime}`) : null}
            onChange={(v: Dayjs | null) => {
              setForm((prev) => ({
                ...prev,
                endTime: v ? v.format("HH:mm") : "",
              }));
              setErrors((prev) => ({ ...prev, endTime: undefined }));
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.endTime,
                helperText: errors.endTime,
              },
            }}
          />
        </Box>
      </LocalizationProvider>

      <Box>
        <TextField
          name="capacity"
          type="number"
          label="Capacity"
          required={!unlimitedCapacity}
          fullWidth
          value={unlimitedCapacity ? "" : form.capacity}
          onChange={handleChange}
          disabled={unlimitedCapacity}
          error={!!errors.capacity}
          helperText={errors.capacity}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={unlimitedCapacity}
              onChange={(e) => {
                setUnlimitedCapacity(e.target.checked);
                setErrors((prev) => ({ ...prev, capacity: undefined }));
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
    </FormLayout>
  );
}
