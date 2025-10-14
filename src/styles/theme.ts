"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
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
