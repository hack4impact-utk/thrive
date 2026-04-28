"use client";

import { Alert, Snackbar } from "@mui/material";
import * as React from "react";

type SnackbarSeverity = "success" | "error" | "info" | "warning";

type SnackbarMessage = {
  message: string;
  severity: SnackbarSeverity;
  key: number;
  duration?: number;
};

type SnackbarContextValue = {
  showSnackbar: (
    message: string,
    severity?: SnackbarSeverity,
    duration?: number,
  ) => void;
};

export const SnackbarContext = React.createContext<SnackbarContextValue>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showSnackbar: (): void => {},
});

export function useSnackbar(): SnackbarContextValue {
  return React.useContext(SnackbarContext);
}

export default function SnackbarProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [queue, setQueue] = React.useState<SnackbarMessage[]>([]);
  const [current, setCurrent] = React.useState<SnackbarMessage | null>(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (queue.length > 0 && !current) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
      setOpen(true);
    }
  }, [queue, current]);

  const showSnackbar = React.useCallback(
    (
      message: string,
      severity: SnackbarSeverity = "success",
      duration?: number,
    ) => {
      setQueue((prev) => [
        ...prev,
        { message, severity, key: Date.now(), duration },
      ]);
    },
    [],
  );

  const handleClose = (
    _: React.SyntheticEvent | Event,
    reason?: string,
  ): void => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleExited = (): void => {
    setCurrent(null);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        key={current?.key}
        open={open}
        autoHideDuration={current?.duration ?? 4000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={current?.severity ?? "success"}
          variant="filled"
          sx={{
            width: "100%",
            fontSize: { xs: "0.875rem", sm: "1rem" },
            py: { xs: 0.5, sm: 1 },
          }}
        >
          {current?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
