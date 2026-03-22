/* 
    This is the filters bar. 
    Has a few basic dropdowns, and a button that opens a card for more filter options.
*/
"use client";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { alpha, styled } from "@mui/material/styles";
import * as React from "react";

import FiltersModal from "./components/FiltersModal";

export default function Filters(): React.ReactElement {
  const [open, setOpen] = React.useState(false);

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
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          justifySelf: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          <Button
            size="large"
            variant="outlined"
            sx={{ color: "GrayText", borderColor: "#0000003B" }}
            onClick={() => setOpen(true)}
          >
            Filters
          </Button>
        </Box>
      </Box>
      <FiltersModal open={open} setOpen={setOpen} />
    </Box>
  );
}
