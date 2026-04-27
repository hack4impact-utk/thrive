"use client";

import SearchIcon from "@mui/icons-material/Search";
import { InputBase } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

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

export default function UserTableSearch(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const debounceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [localSearch, setLocalSearch] = React.useState(
    searchParams.get("search") ?? "",
  );

  const handleSearchChange = (value: string): void => {
    setLocalSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("search", value);
      else params.delete("search");
      router.push(`?${params.toString()}`);
    }, 350);
  };

  return (
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
  );
}
