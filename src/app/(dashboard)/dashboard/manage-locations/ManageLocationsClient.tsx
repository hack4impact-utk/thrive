"use client";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PlaceIcon from "@mui/icons-material/Place";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { useSnackbar } from "@/providers/snackbar-provider";

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
          onClick={() => setOpen(true)}
          sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
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

export default function ManageLocationsClient({
  locations,
}: Props): React.ReactElement {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Manage Locations
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            All venues available for assignment to events.
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/dashboard/create-location"
          variant="contained"
          startIcon={<PlaceIcon />}
          sx={{ flexShrink: 0 }}
        >
          Add Location
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {["Name", "Address", ""].map((heading, i) => (
                <TableCell
                  key={i}
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 1.1,
                    color: "#4b6287",
                    fontSize: 12,
                    textTransform: "uppercase",
                    bgcolor: "#dfe7f2",
                    borderBottom: "1px solid #cfd8e6",
                    ...(i === 2 && { width: 48, p: 0 }),
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.length > 0 ? (
              locations.map((loc) => (
                <TableRow
                  key={loc.id}
                  hover
                  sx={{ "&:last-child td": { borderBottom: 0 } }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {loc.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {loc.streetLine}, {loc.city}, {loc.state} {loc.postalCode}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{ width: 48, p: 0, pr: 1, textAlign: "right" }}
                  >
                    <DeleteLocationButton location={loc} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ px: 3, py: 5, border: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    No locations yet.
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.75 }}
                  >
                    Add a location above to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
