"use client";

import {
  Box,
  FormControl,
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
import { useSnackbar } from "@/providers/snackbar-provider";

const US_STATES: { label: string; value: string }[] = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
];

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
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  preferredNeighborhood: string;
  gender: string;
  shirtSize: string;
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
  const { showSnackbar } = useSnackbar();

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

        birthMonth: Number(form.birthMonth),
        birthDay: Number(form.birthDay),
        birthYear: Number(form.birthYear),

        preferredNeighborhood: form.preferredNeighborhood,
        gender: form.gender,
        shirtSize: form.shirtSize,
        medicalNotes: form.medicalNotes || null,
      });

      await update();
      showSnackbar("Your information has been saved!", "success");
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

      <FormControl fullWidth required>
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

      <Box
        sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}
      >
        <TextField
          name="city"
          value={form.city}
          onChange={handleChange}
          required
          label="City"
          fullWidth
        />
        <FormControl required sx={{ flex: "0 0 200px" }}>
          <InputLabel id="state-label">State</InputLabel>
          <Select
            labelId="state-label"
            label="State"
            value={form.state}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, state: e.target.value }))
            }
          >
            <MenuItem value="TN">Tennessee</MenuItem>
            <MenuItem divider disabled sx={{ my: 0, py: 0 }} />
            {US_STATES.map(({ label, value }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          required
          label="Zip"
          sx={{ flex: { xs: 1, sm: "0 0 100px" } }}
        />
      </Box>

      <Typography variant="h6">Contact</Typography>

      <TextField
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
        required
        label="Phone Number"
        fullWidth
      />

      <Typography variant="h6">Date of Birth</Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          name="birthMonth"
          value={form.birthMonth}
          onChange={handleChange}
          required
          label="MM"
          sx={{ flex: "0 0 80px" }}
        />
        <TextField
          name="birthDay"
          value={form.birthDay}
          onChange={handleChange}
          required
          label="DD"
          sx={{ flex: "0 0 80px" }}
        />
        <TextField
          name="birthYear"
          value={form.birthYear}
          onChange={handleChange}
          required
          label="YYYY"
          sx={{ flex: "0 0 100px" }}
        />
      </Box>

      <Typography variant="h6">Preferences</Typography>

      <FormControl fullWidth required>
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

      <FormControl fullWidth required>
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
