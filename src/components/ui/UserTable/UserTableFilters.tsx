"use client";

import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import {
  Badge,
  Box,
  Button,
  FormControl,
  InputBase,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import type { LocationOption } from "./RoleCell";

const ROLE_LABELS: Record<string, string> = {
  user: "User",
  kiosk: "Kiosk",
  manager: "Manager",
  admin: "Admin",
};

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  width: "auto",
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
    "&:focus": { width: "10ch" },
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": { width: "20ch" },
    },
  },
}));

type UserTableFiltersProps = {
  locationOptions: LocationOption[];
  neighborhoodOptions: string[];
};

export default function UserTableFilters({
  locationOptions,
  neighborhoodOptions,
}: UserTableFiltersProps): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );
  const debounceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const search = searchParams.get("search") ?? "";
  const location = searchParams.get("location") ?? "";
  const role = searchParams.get("role") ?? "";
  const neighborhood = searchParams.get("neighborhood") ?? "";

  const [localSearch, setLocalSearch] = React.useState(search);

  const updateParam = React.useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearchChange = (value: string): void => {
    setLocalSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => updateParam("search", value), 350);
  };

  const activeFilterCount = [location, role, neighborhood].filter(
    Boolean,
  ).length;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search"
          inputProps={{ "aria-label": "search" }}
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </Search>

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
            width: 300,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Filters
          </Typography>

          <FormControl size="small" fullWidth>
            <InputLabel id="user-filter-location-label">
              Assigned Location
            </InputLabel>
            <Select
              labelId="user-filter-location-label"
              value={location}
              label="Assigned Location"
              onChange={(e) => updateParam("location", e.target.value)}
            >
              <MenuItem value="">
                <em>Any location</em>
              </MenuItem>
              {locationOptions.map((loc) => (
                <MenuItem key={loc.id} value={loc.name}>
                  {loc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="user-filter-role-label">Role</InputLabel>
            <Select
              labelId="user-filter-role-label"
              value={role}
              label="Role"
              onChange={(e) => updateParam("role", e.target.value)}
            >
              <MenuItem value="">
                <em>Any role</em>
              </MenuItem>
              {Object.entries(ROLE_LABELS).map(([val, label]) => (
                <MenuItem key={val} value={val}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" fullWidth>
            <InputLabel id="user-filter-neighborhood-label">
              Neighborhood
            </InputLabel>
            <Select
              labelId="user-filter-neighborhood-label"
              value={neighborhood}
              label="Neighborhood"
              onChange={(e) => updateParam("neighborhood", e.target.value)}
            >
              <MenuItem value="">
                <em>Any neighborhood</em>
              </MenuItem>
              {neighborhoodOptions.map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {activeFilterCount > 0 && (
            <Button
              variant="text"
              size="small"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("location");
                params.delete("role");
                params.delete("neighborhood");
                router.push(`?${params.toString()}`);
              }}
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
