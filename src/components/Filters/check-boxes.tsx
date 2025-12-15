/* Check-boxes
 * Makes a vertical group of check boxes. 

    To use, you need three things:
    
    These two control the state of the checkboxes 

    type CheckedStateTime = {
      morning: boolean;
      afternoon: boolean;
    };

    const [checkedTime, setCheckedTime] = React.useState<CheckedStateTime>({
      morning: false,
      afternoon: false,
    });

    These are the options

    const times = [
      { option: "morning", label: "Morning" },
      { option: "afternoon", label: "Afternoon" },
      ] as const;

    Example usage:
    <CheckboxesGroup
    checked={checkedTime}
    setChecked={setCheckedTime}
    options={times}
    />

*/

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import * as React from "react";

type CheckboxOption<T extends string> = {
  option: T;
  label: string;
};

type CheckboxesGroupProps<T extends Record<string, boolean>> = {
  checked: T;
  setChecked: React.Dispatch<React.SetStateAction<T>>;
  options: readonly CheckboxOption<Extract<keyof T, string>>[];
};

export default function CheckboxesGroup<T extends Record<string, boolean>>(
  props: CheckboxesGroupProps<T>,
): React.ReactElement {
  const { checked, setChecked, options } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.name as keyof T;
    setChecked((prev) => ({
      ...prev,
      [name]: event.target.checked,
    }));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <FormControl component="fieldset" variant="standard">
        <FormGroup>
          {options.map((opt) => (
            <FormControlLabel
              key={String(opt.option)}
              control={
                <Checkbox
                  size="small"
                  checked={checked[opt.option]}
                  onChange={handleChange}
                  name={String(opt.option)}
                />
              }
              label={opt.label}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
}
