/* Dropdown menu prop */
/* Creates a dropdown menu with the options you pass in.
    Requires the following to be used:

    const [slot, setSlots] = React.useState("");
    const slots = ["1", "2", "3"];
    const handleChangeSlot = (event: SelectChangeEvent): void => {
        setSlots(event.target.value as string);
    };

    Which control the selection of an option, and the options which are passed in.

    Example usage:
    <Dropdown
      label="Slots"
      value={slot}
      options={slots}
      onChange={handleChangeSlot}
    />
  */

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";

type DropdownProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (event: SelectChangeEvent) => void;
};

export default function FiltersDropdown({
  label,
  value,
  options,
  onChange,
}: DropdownProps): React.ReactElement {
  return (
    <FormControl
      sx={{
        // TODO: Commenting this out for now to be consisten with date-picker until that is figured out
        // "& .MuiOutlinedInput-notchedOutline": { borderColor: "black" },
        paddingRight: "2%",
      }}
      size="small"
      fullWidth
    >
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        id={label}
        value={value}
        label={label}
        onChange={onChange}
        sx={{
          "& .MuiSelect-icon": { color: "secondary" },
        }}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
