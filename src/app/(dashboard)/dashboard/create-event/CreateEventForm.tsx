"use client";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
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
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import * as React from "react";

import { updateEvent } from "@/actions/update-event";
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

type CreateEventFormState = {
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: string;
  locationId: string;
  description: string;
};

type FormErrors = Partial<
  Record<keyof CreateEventFormState | "capacity", string>
>;

type InitialValues = {
  id: string;
  title: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  capacity: number | null;
  locationId: string;
  description: string;
};

type Props = {
  managerLocationId: string | null;
  managerLocationName: string | null;
  initialValues?: InitialValues;
};

export default function CreateEventForm({
  managerLocationId,
  managerLocationName,
  initialValues,
}: Props): React.ReactElement {
  const isManager = managerLocationId !== null;
  const isEditMode = initialValues !== undefined;

  const [form, setForm] = React.useState<CreateEventFormState>({
    title: initialValues?.title ?? "",
    eventDate: initialValues?.eventDate ?? "",
    startTime: initialValues?.startTime ?? "",
    endTime: initialValues?.endTime ?? "",
    capacity:
      initialValues?.capacity == null ? "" : String(initialValues.capacity),
    locationId: initialValues?.locationId ?? managerLocationId ?? "",
    description: initialValues?.description ?? "",
  });

  const [unlimitedCapacity, setUnlimitedCapacity] = React.useState(
    isEditMode ? initialValues!.capacity === null : false,
  );
  const [locationOptions, setLocationOptions] = React.useState<Location[]>([]);
  const [errors, setErrors] = React.useState<FormErrors>({});

  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  React.useEffect(() => {
    if (!isManager) {
      fetch("/api/locations")
        .then((r) => r.json())
        .then(setLocationOptions)
        .catch(Boolean);
    }
  }, [isManager]);

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
    if (!isEditMode && !form.locationId)
      newErrors.locationId = "Location is required";
    if (!isEditMode && !form.eventDate)
      newErrors.eventDate = "Event date is required";
    if (!isEditMode && !form.startTime)
      newErrors.startTime = "Start time is required";
    if (!isEditMode && !form.endTime)
      newErrors.endTime = "End time is required";
    if (!unlimitedCapacity && !form.capacity)
      newErrors.capacity = "Enter a capacity or check Unlimited capacity";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isEditMode) {
      try {
        await updateEvent({
          id: initialValues!.id,
          title: form.title,
          description: form.description,
          capacity: unlimitedCapacity ? null : Number(form.capacity),
        });
        showSnackbar("Event updated successfully!", "success");
        router.back();
      } catch {
        showSnackbar("Failed to update event", "error");
      }
      return;
    }

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        eventDate: form.eventDate,
        startTime: form.startTime,
        endTime: form.endTime,
        capacity: unlimitedCapacity ? null : Number(form.capacity),
        unlimitedCapacity,
        locationId: form.locationId,
        description: form.description,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      showSnackbar(`Failed to create event: ${text}`, "error");
      return;
    }

    showSnackbar("Event created successfully!", "success");
    router.push("/");
    setForm({
      title: "",
      eventDate: "",
      startTime: "",
      endTime: "",
      capacity: "",
      locationId: managerLocationId ?? "",
      description: "",
    });
    setErrors({});
    setUnlimitedCapacity(false);
  }

  return (
    <FormLayout
      title={isEditMode ? "Update Event" : "Create Event"}
      description="* indicates required field"
      submitLabel={isEditMode ? "Update Event" : "Create Event"}
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

      {isEditMode && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            color: "text.disabled",
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption">
            Date, time, and location cannot be changed after creation.
          </Typography>
        </Box>
      )}

      {isManager ? (
        <TextField
          label="Location"
          fullWidth
          value={managerLocationName ?? "No location assigned"}
          disabled
          InputLabelProps={{ shrink: true }}
        />
      ) : (
        <FormControl
          fullWidth
          required={!isEditMode}
          error={!!errors.locationId}
          disabled={isEditMode}
        >
          <InputLabel id="location-label">Location</InputLabel>
          <Select
            labelId="location-label"
            value={form.locationId}
            label="Location"
            onChange={(e) => {
              setForm((prev) => ({ ...prev, locationId: e.target.value }));
              setErrors((prev) => ({ ...prev, locationId: undefined }));
            }}
            MenuProps={{
              PaperProps: { sx: { overflowX: "auto" } },
              MenuListProps: { sx: { minWidth: "max-content" } },
            }}
          >
            <MenuItem value="" sx={{ whiteSpace: "nowrap", pr: 3 }}>
              <em>No location selected</em>
            </MenuItem>
            {locationOptions.map((loc) => (
              <MenuItem
                key={loc.id}
                value={loc.id}
                sx={{ whiteSpace: "nowrap", pr: 3 }}
              >
                {loc.name} — {loc.streetLine}, {loc.city}, {loc.state}{" "}
                {loc.postalCode}
              </MenuItem>
            ))}
          </Select>
          {errors.locationId && (
            <FormHelperText>{errors.locationId}</FormHelperText>
          )}
        </FormControl>
      )}

      <TextField
        name="eventDate"
        type="date"
        label="Event Date"
        required={!isEditMode}
        fullWidth
        value={form.eventDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        disabled={isEditMode}
        error={!!errors.eventDate}
        helperText={errors.eventDate}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TimePicker
            label="Start Time *"
            minutesStep={5}
            disabled={isEditMode}
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
            disabled={isEditMode}
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
