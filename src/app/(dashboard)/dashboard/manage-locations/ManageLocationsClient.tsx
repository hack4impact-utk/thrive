"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import {
  alpha,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useSnackbar } from "@/providers/snackbar-provider";

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

type Location = {
  id: string;
  name: string;
  streetLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type Props = {
  locations: Location[];
};

function DeleteLocationButton({
  location,
}: {
  location: Location;
}): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  async function handleConfirm(): Promise<void> {
    setLoading(true);
    try {
      const res = await fetch("/api/locations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: location.id, deleted: true }),
      });

      if (!res.ok) {
        showSnackbar("Failed to delete location.", "error");
        return;
      }

      showSnackbar(`"${location.name}" deleted.`, "success");
      router.refresh();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Tooltip title="Delete location" arrow>
        <IconButton
          size="small"
          onClick={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
          sx={{ color: "text.disabled", "&:hover": { color: "error.main" } }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete location?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>{location.name}</strong> will be marked as deleted, and any
            events assigned to this location will also be removed from the
            schedule. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            disabled={loading}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function LocationRow({
  location,
  isLast,
}: {
  location: Location;
  isLast: boolean;
}): React.ReactElement {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 3,
        py: 2,
        borderBottom: isLast ? "none" : "1px solid",
        borderColor: "divider",
        transition: "background-color 120ms ease",
        "&:hover": { bgcolor: alpha("#4b6287", 0.03) },
      }}
    >
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {location.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            color: "text.secondary",
          }}
        >
          <LocationOnIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption">
            {location.streetLine}, {location.city}, {location.state}{" "}
            {location.postalCode}
          </Typography>
        </Box>
      </Stack>

      <DeleteLocationButton location={location} />
    </Box>
  );
}

export default function ManageLocationsClient({
  locations,
}: Props): React.ReactElement {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(
    () =>
      locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(search.toLowerCase()) ||
          loc.streetLine.toLowerCase().includes(search.toLowerCase()) ||
          loc.city.toLowerCase().includes(search.toLowerCase()),
      ),
    [locations, search],
  );

  return (
    <Stack spacing={4}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "flex-start",
          justifyContent: { md: "space-between" },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Manage Locations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All venues available for assignment to events.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row-reverse", md: "row" },
            alignItems: "center",
            gap: 1,
          }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search"
              inputProps={{ "aria-label": "search" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Search>
          <Button
            component={Link}
            href="/dashboard/create-location"
            variant="contained"
            startIcon={<LocationOnIcon />}
          >
            Add Location
          </Button>
        </Box>
      </Box>

      {filtered.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            py: 8,
          }}
        >
          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="body2" fontWeight={600}>
              {locations.length === 0 ? "No locations yet." : "No results found."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {locations.length === 0
                ? "Add a location above to get started."
                : "Try a different search term."}
            </Typography>
          </Stack>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {filtered.map((loc, i) => (
            <LocationRow
              key={loc.id}
              location={loc}
              isLast={i === filtered.length - 1}
            />
          ))}
        </Paper>
      )}
    </Stack>
  );
}
