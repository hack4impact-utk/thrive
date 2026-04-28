"use client";

import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

type LocationOption = {
  id: string;
  name: string;
};

type Props = {
  locationOptions: LocationOption[];
  accentColor: string;
};

export default function VolunteerHoursFilters({
  locationOptions,
  accentColor,
}: Props): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [locationId, setLocationId] = React.useState(
    searchParams.get("locationId") ?? "",
  );
  const [dateFrom, setDateFrom] = React.useState<Dayjs | null>(
    searchParams.get("dateFrom") ? dayjs(searchParams.get("dateFrom")) : null,
  );
  const [dateTo, setDateTo] = React.useState<Dayjs | null>(
    searchParams.get("dateTo") ? dayjs(searchParams.get("dateTo")) : null,
  );

  const hasFilters =
    !!locationId ||
    !!searchParams.get("dateFrom") ||
    !!searchParams.get("dateTo");

  function handleApply(): void {
    const params = new URLSearchParams();
    if (locationId) params.set("locationId", locationId);
    if (dateFrom) params.set("dateFrom", dateFrom.format("YYYY-MM-DD"));
    if (dateTo) params.set("dateTo", dateTo.format("YYYY-MM-DD"));
    router.push(`?${params.toString()}`);
  }

  function handleClear(): void {
    setLocationId("");
    setDateFrom(null);
    setDateTo(null);
    router.push("?");
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        flexWrap="wrap"
        gap={2}
        alignItems={{ sm: "center" }}
      >
        <DatePicker
          label="From"
          value={dateFrom}
          onChange={setDateFrom}
          slotProps={{ textField: { size: "small" } }}
        />

        <DatePicker
          label="To"
          value={dateTo}
          minDate={dateFrom ?? undefined}
          onChange={setDateTo}
          slotProps={{ textField: { size: "small" } }}
        />

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="location-filter-label">Location</InputLabel>
          <Select
            labelId="location-filter-label"
            label="Location"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
          >
            <MenuItem value="">
              <em>All locations</em>
            </MenuItem>
            {locationOptions.map((loc) => (
              <MenuItem key={loc.id} value={loc.id}>
                {loc.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={handleApply}
            sx={{ bgcolor: accentColor, "&:hover": { bgcolor: accentColor } }}
          >
            Apply
          </Button>
          {hasFilters && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleClear}
              sx={{ borderColor: accentColor, color: accentColor }}
            >
              Clear
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            href={`/api/volunteer-hours-csv?${searchParams.toString()}`}
            sx={{ borderColor: accentColor, color: accentColor, ml: 1 }}
          >
            Export CSV
          </Button>
        </Box>
      </Stack>
    </LocalizationProvider>
  );
}
