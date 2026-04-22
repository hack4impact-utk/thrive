"use client";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Badge,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Typography,
} from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import type { Dayjs } from "dayjs";
import * as React from "react";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "auto",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "6ch",
    "&:focus": {
      width: "10ch",
    },
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

type Location = {
  id: string;
  name: string;
  streetLine: string;
  city: string;
  state: string;
  postalCode: string;
};

export type RegistrationStatus = "available" | "going" | "full" | "";

export type FilterState = {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
  locationName: string;
  registrationStatus: RegistrationStatus;
};

export const defaultFilters: FilterState = {
  dateFrom: null,
  dateTo: null,
  locationName: "",
  registrationStatus: "",
};

type FiltersProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
};

export default function Filters({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
}: FiltersProps): React.ReactElement {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const [locationOptions, setLocationOptions] = React.useState<Location[]>([]);

  React.useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then(setLocationOptions)
      .catch(console.error);
  }, []);

  const activeFilterCount = [
    filters.dateFrom,
    filters.dateTo,
    filters.locationName,
    filters.registrationStatus,
  ].filter(Boolean).length;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search"
          inputProps={{ "aria-label": "search" }}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </Search>

      <Badge badgeContent={activeFilterCount || null} color="primary">
        <Button
          size="large"
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={{
            color: "GrayText",
            borderColor: "#0000003B",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          Filters
        </Button>
      </Badge>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Box
          sx={{
            p: 3,
            width: 320,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Filters
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Typography variant="body2" color="text.secondary">
              Date Range
            </Typography>
            <DatePicker
              label="From"
              value={filters.dateFrom}
              onChange={(v) => onFiltersChange({ ...filters, dateFrom: v })}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
            <DatePicker
              label="To"
              value={filters.dateTo}
              minDate={filters.dateFrom ?? undefined}
              onChange={(v) => onFiltersChange({ ...filters, dateTo: v })}
              slotProps={{ textField: { size: "small", fullWidth: true } }}
            />
          </LocalizationProvider>

          <FormControl size="small" fullWidth>
            <InputLabel id="filter-location-label">Location</InputLabel>
            <Select
              labelId="filter-location-label"
              value={filters.locationName ?? ""}
              label="Location"
              onChange={(e) =>
                onFiltersChange({ ...filters, locationName: e.target.value })
              }
            >
              <MenuItem value="">
                <em>Any location</em>
              </MenuItem>
              {locationOptions.map((loc) => (
                <MenuItem key={loc.id} value={loc.name}>
                  {loc.name} — {loc.streetLine}, {loc.city}, {loc.state}{" "}
                  {loc.postalCode}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="filter-status-label">Registration Status</InputLabel>
            <Select
              labelId="filter-status-label"
              value={filters.registrationStatus ?? ""}
              label="Registration Status"
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  registrationStatus: e.target.value as RegistrationStatus,
                })
              }
            >
              <MenuItem value="">
                <em>Any</em>
              </MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="going">Going</MenuItem>
              <MenuItem value="full">Full</MenuItem>
            </Select>
          </FormControl>

          {activeFilterCount > 0 && (
            <Button
              variant="text"
              size="small"
              onClick={() => onFiltersChange(defaultFilters)}
              sx={{ alignSelf: "flex-start" }}
            >
              Clear filters
            </Button>
          )}
        </Box>
      </Popover>
    </Box>
  );
}
