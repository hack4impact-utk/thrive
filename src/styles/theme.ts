"use client";
import type { PaletteColor, PaletteColorOptions } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Palette {
    admin: PaletteColor;
    manager: PaletteColor;
  }
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface PaletteOptions {
    admin?: PaletteColorOptions;
    manager?: PaletteColorOptions;
  }
}

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
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: "smooth",
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
    admin: {
      main: "#22305B",
      contrastText: "#ffffff",
    },
    manager: {
      main: "#276636",
      contrastText: "#ffffff",
    },
  },
});

export default theme;
