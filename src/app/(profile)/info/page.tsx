"use client";

import {
  Box,
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
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import * as React from "react";

import { addUserInfo } from "@/actions/add-user-info";
import FormLayout from "@/components/layout/FormLayout/";

type BasicInfoFormState = {
  firstName: string;
  lastName: string;
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

  const { update } = useSession();
  const router = useRouter();

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

    try {
      await addUserInfo({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),

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

      await update();
      router.push("/");
    } catch (error) {
      console.error("add user info failed", error);
      alert("Error in adding information.");
    }
  }

  return (
    <FormLayout
      title="Complete Your Information"
      description="* indicates required field"
      submitLabel="Submit"
      onSubmit={handleSubmit}
    >
      {/* Name */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          required
          label="First Name"
          fullWidth
        />
        <TextField
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          required
          label="Last Name"
          fullWidth
        />
      </Box>

      {/* Gender */}
      <FormControl fullWidth>
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

      {/* Address */}
      <Typography variant="h6">Home Address</Typography>

      <TextField
        name="addressLine1"
        value={form.addressLine1}
        onChange={handleChange}
        required
        label="Street Address"
        fullWidth
      />

      <TextField
        name="addressLine2"
        value={form.addressLine2}
        onChange={handleChange}
        label="Apartment / Unit (optional)"
        fullWidth
      />

      <Box sx={{ display: "flex", gap: 2 }}>
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
          sx={{ width: 200 }}
        />
        <TextField
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          required
          label="ZIP Code"
          sx={{ width: 170 }}
        />
      </Box>

      {/* Phone */}
      <Typography variant="h6">Contact</Typography>

      <TextField
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
        required
        label="Phone Number"
        fullWidth
      />

      <FormControlLabel
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
        label="Send event reminders via text"
      />

      {/* DOB */}
      <Typography variant="h6">Date of Birth</Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          name="birthMonth"
          value={form.birthMonth}
          onChange={handleChange}
          required
          label="MM"
          sx={{ width: 100 }}
        />
        <TextField
          name="birthDay"
          value={form.birthDay}
          onChange={handleChange}
          required
          label="DD"
          sx={{ width: 100 }}
        />
        <TextField
          name="birthYear"
          value={form.birthYear}
          onChange={handleChange}
          required
          label="YYYY"
          sx={{ width: 140 }}
        />
      </Box>

      {/* Other */}
      <Typography variant="h6">Preferences</Typography>

      <FormControl fullWidth>
        <InputLabel>Neighborhood</InputLabel>
        <Select
          name="preferredNeighborhood"
          value={form.preferredNeighborhood}
          onChange={handleChange}
          label="Neighborhood"
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

      <FormControl fullWidth>
        <InputLabel>Shirt Size</InputLabel>
        <Select
          name="shirtSize"
          value={form.shirtSize}
          onChange={handleChange}
          label="Shirt Size"
        >
          <MenuItem value="small">Small</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="large">Large</MenuItem>
        </Select>
      </FormControl>

      {/* Medical */}
      <Typography variant="h6">Medical Information</Typography>

      <TextField
        name="medicalNotes"
        value={form.medicalNotes}
        onChange={handleChange}
        label="Conditions we should be aware of"
        multiline
        rows={4}
        fullWidth
      />
    </FormLayout>
  );
}
