"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontFamily: "Helvetica",
          fontWeight: 600,
          fontSize: "0.8rem",
        },
      },
    },
  },
  palette: {
    mode: "light",
    primary: {
      main: "#22A27E",
    },
    secondary: {
      main: "#22305B",
    },
  },
});

export default theme;
