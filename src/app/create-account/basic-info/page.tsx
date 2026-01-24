"use client";

import EmergencyIcon from "@mui/icons-material/Emergency";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";

export default function BasicInfoForm(): React.JSX.Element {
  const [newsletter, setNewsletter] = React.useState(true);
  const [location, setLocation] = React.useState("");
  const [size, setSize] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [student, setStudent] = React.useState("");

  const handleSelect =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: SelectChangeEvent): void =>
      setter(event.target.value);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", pt: 6 }}>
      <Card sx={{ width: "100%", maxWidth: 900 }}>
        <CardContent sx={{ px: 6, pb: 6 }}>
          <Box component="form" autoComplete="off">
            <Typography variant="h5" gutterBottom>
              Complete the form below
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <span style={{ color: "red" }}>*</span> indicates required field
            </Typography>

            {/* Name */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <TextField required label="First name" fullWidth />
              <TextField label="M" sx={{ width: 80 }} />
              <TextField required label="Last name" fullWidth />
            </Box>

            {/* Email */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Email
            </Typography>
            <TextField required label="Email Address" fullWidth />

            {/* Address */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Home Address
            </Typography>

            <TextField
              required
              label="Street Address"
              fullWidth
              sx={{ mt: 1 }}
            />
            <TextField
              label="Apartment / Unit (optional)"
              fullWidth
              sx={{ mt: 1 }}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <TextField label="City" fullWidth />
              <TextField label="State" sx={{ width: 120 }} />
              <TextField label="Zip" sx={{ width: 120 }} />
            </Box>

            {/* Phone */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Mobile Phone
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField fullWidth size="small" />
              <EmergencyIcon fontSize="small" color="error" />
            </Box>

            <FormControlLabel
              sx={{ mt: 2 }}
              control={
                <Checkbox
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                />
              }
              label="Send event reminders to my phone"
            />

            {/* DOB */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Date of Birth
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: "flex", gap: 1, flexGrow: 1 }}>
                <TextField placeholder="MM" size="small" />
                <TextField placeholder="DD" size="small" />
                <TextField placeholder="YYYY" size="small" />
              </Box>
              <EmergencyIcon fontSize="small" color="error" />
            </Box>

            {/* Student */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Are you a student?
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Student</InputLabel>
                <Select
                  value={student}
                  label="Student"
                  onChange={handleSelect(setStudent)}
                >
                  <MenuItem value="YES">Yes</MenuItem>
                  <MenuItem value="NO">No</MenuItem>
                </Select>
              </FormControl>
              <EmergencyIcon fontSize="small" color="error" />
            </Box>

            {/* Neighborhood */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Neighborhood preference
            </Typography>
            <Typography variant="caption" color="text.secondary">
              We will place based on site needs, but preferences help.
            </Typography>

            <FormControl size="small" fullWidth sx={{ mt: 1 }}>
              <InputLabel>Location</InputLabel>
              <Select
                value={location}
                label="Location"
                onChange={handleSelect(setLocation)}
              >
                {[
                  "Lonsdale",
                  "Parkridge",
                  "New Hopewell",
                  "Papermill",
                  "West View",
                  "Westland",
                ].map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Gender */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Gender
            </Typography>

            <FormControl size="small" fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                label="Gender"
                onChange={handleSelect(setGender)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </FormControl>

            {/* Shirt size */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Shirt size
            </Typography>

            <FormControl size="small" fullWidth>
              <InputLabel>Size</InputLabel>
              <Select
                value={size}
                label="Size"
                onChange={handleSelect(setSize)}
              >
                <MenuItem value="Small">Small</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Large">Large</MenuItem>
              </Select>
            </FormControl>

            {/* Medical */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Medical conditions
            </Typography>

            <TextField multiline rows={4} fullWidth placeholder="N/A" />

            {/* Actions */}
            <Box sx={{ display: "flex", gap: 2, mt: 5 }}>
              <Button variant="contained" color="inherit" sx={{ flex: 1 }}>
                Previous
              </Button>
              <Button variant="contained" sx={{ flex: 1, bgcolor: "#22A27E" }}>
                Next
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
