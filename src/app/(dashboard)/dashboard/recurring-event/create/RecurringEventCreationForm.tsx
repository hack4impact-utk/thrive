"use client";

import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import * as React from "react";

import FormLayout from "@/components/layout/FormLayout";
import { useSnackbar } from "@/providers/snackbar-provider";

// ── Constants ─────────────────────────────────────────────────────────────────

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;
const DAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const NTH_OPTIONS = [
  { value: 1, label: "1st" },
  { value: 2, label: "2nd" },
  { value: 3, label: "3rd" },
  { value: 4, label: "4th" },
  { value: -1, label: "Last" },
];

const FREQUENCY_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 weeks" },
  { value: "monthly", label: "Monthly" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

function dayOfMonthFromDate(dateStr: string): number | null {
  if (!dateStr) return null;
  return new Date(dateStr + "T00:00:00Z").getUTCDate();
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Location = {
  id: string;
  name: string;
  streetLine: string;
  city: string;
  state: string;
  postalCode: string;
};

type FormState = {
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
  Record<keyof FormState | "capacity" | "daysOfWeek", string>
>;

type Props = {
  managerLocationId: string | null;
  managerLocationName: string | null;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function RecurringEventCreationForm({
  managerLocationId,
  managerLocationName,
}: Props): React.ReactElement {
  const isManager = managerLocationId !== null;

  // ── Core form state ─────────────────────────────────────────────────────────
  const [form, setForm] = React.useState<FormState>({
    title: "",
    frequency: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    capacity: "",
    locationId: managerLocationId ?? "",
    description: "",
  });

  const [unlimitedCapacity, setUnlimitedCapacity] = React.useState(false);
  const [locationOptions, setLocationOptions] = React.useState<Location[]>([]);
  const [errors, setErrors] = React.useState<FormErrors>({});

  // ── Recurrence sub-state ────────────────────────────────────────────────────
  // weekly: which days (multi-select)
  const [weeklyDays, setWeeklyDays] = React.useState<number[]>([]);
  // biweekly: which single day
  const [biweeklyDay, setBiweeklyDay] = React.useState<number>(1); // Mon default
  // daily: weekdays only?
  const [weekdaysOnly, setWeekdaysOnly] = React.useState(false);
  // monthly: 'day-of-month' or 'nth-weekday'
  const [monthlyType, setMonthlyType] = React.useState<
    "day-of-month" | "nth-weekday"
  >("day-of-month");
  const [monthlyNth, setMonthlyNth] = React.useState<number>(1);
  const [monthlyWeekday, setMonthlyWeekday] = React.useState<number>(1); // Mon

  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  // When switching to biweekly (or while on it and changing startDate),
  // default the selected day to whatever day the start date falls on.
  React.useEffect(() => {
    if (form.frequency === "biweekly" && form.startDate) {
      setBiweeklyDay(new Date(form.startDate + "T00:00:00Z").getUTCDay());
    }
  }, [form.frequency, form.startDate]);

  React.useEffect(() => {
    if (!isManager) {
      void fetch("/api/locations")
        .then((r) => r.json())
        .then(setLocationOptions);
    }
  }, [isManager]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
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

    if (form.frequency === "weekly" && weeklyDays.length === 0)
      newErrors.daysOfWeek = "Select at least one day";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build recurrence payload
    let daysOfWeek: number[] | undefined;
    if (form.frequency === "weekly") daysOfWeek = weeklyDays;
    if (form.frequency === "biweekly") daysOfWeek = [biweeklyDay];

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
        daysOfWeek,
        weekdaysOnly: form.frequency === "daily" ? weekdaysOnly : undefined,
        monthlyType: form.frequency === "monthly" ? monthlyType : undefined,
        monthlyNth:
          form.frequency === "monthly" && monthlyType === "nth-weekday"
            ? monthlyNth
            : undefined,
        monthlyWeekday:
          form.frequency === "monthly" && monthlyType === "nth-weekday"
            ? monthlyWeekday
            : undefined,
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

  // ── Derived values ────────────────────────────────────────────────────────────
  const monthlyDayOfMonth = dayOfMonthFromDate(form.startDate);

  // ── Render ────────────────────────────────────────────────────────────────────
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

      {isManager ? (
        <TextField
          label="Location"
          fullWidth
          value={managerLocationName ?? "No location assigned"}
          disabled
          InputLabelProps={{ shrink: true }}
        />
      ) : (
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

      {/* ── Frequency ── */}
      <FormControl fullWidth required error={!!errors.frequency}>
        <InputLabel id="frequency-label">Frequency</InputLabel>
        <Select
          labelId="frequency-label"
          value={form.frequency}
          label="Frequency"
          onChange={(e) => {
            setForm((prev) => ({ ...prev, frequency: e.target.value }));
            setErrors((prev) => ({
              ...prev,
              frequency: undefined,
              daysOfWeek: undefined,
            }));
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

      {/* ── Daily: weekdays only ── */}
      {form.frequency === "daily" && (
        <FormControlLabel
          control={
            <Checkbox
              checked={weekdaysOnly}
              onChange={(e) => setWeekdaysOnly(e.target.checked)}
            />
          }
          label="Weekdays only (Monday – Friday)"
        />
      )}

      {/* ── Weekly: multi-day picker ── */}
      {form.frequency === "weekly" && (
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Repeat on <span style={{ color: "inherit" }}>*</span>
          </Typography>
          <ToggleButtonGroup
            value={weeklyDays}
            onChange={(_, newDays: number[]) => {
              if (newDays.length > 0) {
                setWeeklyDays(newDays);
                setErrors((prev) => ({ ...prev, daysOfWeek: undefined }));
              }
            }}
            aria-label="days of week"
            sx={{ flexWrap: "wrap", gap: 0.5 }}
          >
            {DAY_LABELS.map((label, idx) => (
              <ToggleButton
                key={idx}
                value={idx}
                aria-label={DAY_FULL[idx]}
                sx={{
                  width: 44,
                  height: 44,
                  p: 0,
                  borderRadius: "50% !important",
                }}
              >
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          {errors.daysOfWeek && (
            <FormHelperText error sx={{ mt: 0.5 }}>
              {errors.daysOfWeek}
            </FormHelperText>
          )}
        </Box>
      )}

      {/* ── Biweekly: single-day picker ── */}
      {form.frequency === "biweekly" && (
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Repeats every other
          </Typography>
          <ToggleButtonGroup
            exclusive
            value={biweeklyDay}
            onChange={(_, day: number | null) => {
              if (day !== null) setBiweeklyDay(day);
            }}
            aria-label="day of week"
            sx={{ flexWrap: "wrap", gap: 0.5 }}
          >
            {DAY_LABELS.map((label, idx) => (
              <ToggleButton
                key={idx}
                value={idx}
                aria-label={DAY_FULL[idx]}
                sx={{
                  width: 44,
                  height: 44,
                  p: 0,
                  borderRadius: "50% !important",
                }}
              >
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.75, display: "block" }}
          >
            The every-other-week cadence is anchored to your start date.
          </Typography>
        </Box>
      )}

      {/* ── Monthly: day-of-month vs nth-weekday ── */}
      {form.frequency === "monthly" && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <RadioGroup
            value={monthlyType}
            onChange={(e) =>
              setMonthlyType(e.target.value as "day-of-month" | "nth-weekday")
            }
          >
            <FormControlLabel
              value="day-of-month"
              control={<Radio size="small" />}
              label="Day of the month"
            />
            {monthlyType === "day-of-month" && monthlyDayOfMonth && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 4, mt: -0.5, mb: 0.5, display: "block" }}
              >
                Recurs on the <strong>{ordinal(monthlyDayOfMonth)}</strong> of
                each month.
                {monthlyDayOfMonth >= 29 && (
                  <>
                    {" "}
                    Months without a {ordinal(monthlyDayOfMonth)} are skipped.
                  </>
                )}
              </Typography>
            )}

            <FormControlLabel
              value="nth-weekday"
              control={<Radio size="small" />}
              label="Day of the week"
            />
          </RadioGroup>

          {monthlyType === "nth-weekday" && (
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", ml: 3.5 }}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="monthly-nth-label">Occurrence</InputLabel>
                <Select
                  labelId="monthly-nth-label"
                  value={monthlyNth}
                  label="Occurrence"
                  onChange={(e) => setMonthlyNth(Number(e.target.value))}
                >
                  {NTH_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel id="monthly-weekday-label">Weekday</InputLabel>
                <Select
                  labelId="monthly-weekday-label"
                  value={monthlyWeekday}
                  label="Weekday"
                  onChange={(e) => setMonthlyWeekday(Number(e.target.value))}
                >
                  {DAY_FULL.map((day, idx) => (
                    <MenuItem key={idx} value={idx}>
                      {day}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ alignSelf: "center" }}
              >
                {`The ${NTH_OPTIONS.find((o) => o.value === monthlyNth)?.label ?? ""} ${DAY_FULL[monthlyWeekday]} of every month`}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* ── Dates ── */}
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
          helperText={
            errors.endDate ?? "Events are created on the end date (inclusive)."
          }
        />
      </Box>

      {/* ── Times ── */}
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

      {/* ── Capacity ── */}
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
