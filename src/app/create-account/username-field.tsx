"use client";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import * as React from "react";

export default function UsernameField(): React.ReactElement {
  return (
    <FormControl sx={{ m: 1, width: "25ch" }} variant="standard">
      <InputLabel>Username</InputLabel>
      <Input />
    </FormControl>
  );
}
