"use client";

import EmergencyIcon from "@mui/icons-material/Emergency";
import {
  Box,
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

import { addUserInfo } from "@/actions/add-user-info";
import SubmitFormButton from "@/components/Button/SubmitFormButton";

type BasicInfoFormState = {
  firstName: string;
  lastName: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isTextOptedIn: boolean;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  preferredNeighborhood?: string;
  gender?: string;
  shirtSize?: string;
  medicalNotes?: string;
};

export default function BasicInfoForm(): React.ReactElement {
  const [form, setForm] = React.useState<BasicInfoFormState>({
    firstName: "",
    lastName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phoneNumber: "",
    isTextOptedIn: false,
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    preferredNeighborhood: "",
    gender: "",
    shirtSize: "",
    medicalNotes: "",
  });

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
  ): void {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();

    await addUserInfo({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),

      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2 || null,
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
      country: "US",

      phoneNumber: form.phoneNumber.trim(),
      isTextOptedIn: form.isTextOptedIn,

      birthMonth: Number(form.birthMonth),
      birthDay: Number(form.birthDay),
      birthYear: Number(form.birthYear),

      preferredNeighborhood: form.preferredNeighborhood || null,
      gender: form.gender || null,
      shirtSize: form.shirtSize || null,
      medicalNotes: form.medicalNotes || null,
    });
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        pt: { sm: 0, md: 6 },
        pb: { sm: 0, md: 6 },
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 900 }}>
        <CardContent sx={{ px: 6, pb: 6 }}>
          <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom>
              Complete the form below
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <span style={{ color: "red" }}>*</span> indicates required field
            </Typography>

            {/* Name */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <TextField
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                label="First name"
                fullWidth
              />
              <TextField
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                label="Last name"
                fullWidth
              />
            </Box>

            {/* Email */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Email
            </Typography>
            <TextField
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              label="Email Address"
              fullWidth
            />

            {/* Address */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Home Address
            </Typography>

            <TextField
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleChange}
              required
              label="Street Address"
              fullWidth
              sx={{ mt: 1 }}
            />
            <TextField
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              label="Apartment / Unit (optional)"
              fullWidth
              sx={{ mt: 1 }}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <TextField
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                label="City"
                fullWidth
              />
              <TextField
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                label="State"
                sx={{ width: 140 }}
              />
              <TextField
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
                label="Zip"
                sx={{ width: 140 }}
              />
            </Box>

            {/* Phone */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Mobile Phone
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                fullWidth
                size="small"
              />
              <EmergencyIcon fontSize="small" color="error" />
            </Box>

            <FormControlLabel
              sx={{ mt: 2 }}
              control={
                <Checkbox
                  name="isTextOptedIn"
                  checked={form.isTextOptedIn}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isTextOptedIn: e.target.checked,
                    }))
                  }
                />
              }
              label="Send event reminders to my phone"
            />

            {/* DOB */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Date of Birth
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flex: 1,
                }}
              >
                <TextField
                  name="birthMonth"
                  value={form.birthMonth}
                  onChange={handleChange}
                  required
                  placeholder="MM"
                  size="small"
                  sx={{ flex: 1 }}
                />

                <TextField
                  name="birthDay"
                  value={form.birthDay}
                  onChange={handleChange}
                  required
                  placeholder="DD"
                  size="small"
                  sx={{ flex: 1 }}
                />

                <TextField
                  name="birthYear"
                  value={form.birthYear}
                  onChange={handleChange}
                  required
                  placeholder="YYYY"
                  size="small"
                  sx={{ flex: 1 }}
                />
              </Box>

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
                name="preferredNeighborhood"
                value={form.preferredNeighborhood}
                onChange={handleChange}
                label="Location"
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
                name="gender"
                value={form.gender}
                onChange={handleChange}
                label="Gender"
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>

            {/* Shirt size */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Shirt size
            </Typography>

            <FormControl size="small" fullWidth>
              <InputLabel>Size</InputLabel>
              <Select
                name="shirtSize"
                value={form.shirtSize}
                onChange={handleChange}
                label="Size"
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>

            {/* Medical */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              Medical conditions
            </Typography>

            <TextField
              name="medicalNotes"
              value={form.medicalNotes}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />

            <SubmitFormButton label="Submit" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
