"use client";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import * as React from "react";

import { deleteEvent } from "@/actions/delete-event";
import { useSnackbar } from "@/providers/snackbar-provider";

type Props = {
  eventId: string;
  accentColor: string;
};

export default function DeleteEventButton({
  eventId,
  accentColor,
}: Props): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  async function handleConfirm(): Promise<void> {
    setLoading(true);
    try {
      await deleteEvent(eventId);
      showSnackbar("Event deleted successfully.", "success");
      router.push("/dashboard/events-library");
    } catch {
      showSnackbar("Failed to delete event.", "error");
      setLoading(false);
    }
  }

  return (
    <>
      <Tooltip title="Delete event" arrow>
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={{ color: "error.main" }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete event?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. The event will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            disabled={loading}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            variant="contained"
            color="error"
          >
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
