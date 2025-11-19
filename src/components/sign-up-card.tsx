"use client";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import * as React from "react";

//const [prefix, setPrefix] = React.useState("");
/*
const handleChange = (event: SelectChangeEvent): void => {
  setPrefix(event.target.value as string);
};*/

export default function ButtonAppBar(): React.ReactElement {
  return (
    <Card
      sx={{
        maxWidth: 1000,
        alignContent: "center",
        margin: "auto",
        borderRadius: 5,
        marginTop: 5,
      }}
    >
      {/* Card Header Section */}
      <CardContent sx={{ bgcolor: "lightgray", boxShadow: 3 }}>
        <CardHeader
          title="Account"
          sx={{
            bgcolor: "primary.secondary",
            color: "secondary.main",
            textAlign: "center",
            paddingTop: 5,
          }}
        ></CardHeader>
        <Grid
          sx={{
            width: "50%",
            alignContent: "center",
            margin: "auto",
            borderRadius: 2,
            border: 1,
          }}
          container
          spacing={0}
        >
          <Grid sx={{ width: "50%" }}>
            <Box
              component="section"
              sx={{
                bgcolor: "secondary.main",
                p: 1.5,
                width: "100%",
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }}
            ></Box>
          </Grid>
          <Grid sx={{ width: "50%" }}>
            <Box
              component="section"
              sx={{
                bgcolor: "white",
                p: 1.5,
                width: "100%",
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
            ></Box>
          </Grid>
        </Grid>
      </CardContent>
      <CardContent sx={{ height: "60vh", marginBottom: 5 }}>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1 },
            marginTop: 4,
            maxWidth: "800px",
          }}
          noValidate
          autoComplete="off"
        >
          <Typography variant="h5">Complete the form below.</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <span style={{ color: "red" }}>*</span> indicates required field
          </Typography>

          {/* Full Name */}
          <Select
            labelId="prefix-label"
            aria-label="Prefix"
            sx={{ width: "9vh", mt: 1 }}
            defaultValue=""
          >
            <MenuItem value="">
              <em>-</em>
            </MenuItem>
            <MenuItem value="Miss">Miss</MenuItem>
            <MenuItem value="Mr.">Mr.</MenuItem>
            <MenuItem value="Mrs.">Mrs.</MenuItem>
            <MenuItem value="Ms.">Ms.</MenuItem>
          </Select>

          <TextField required label="First Name" sx={{ width: "35%" }} />

          <TextField label="M" sx={{ width: "7vh" }} />

          <TextField required label="Last Name" sx={{ width: "35%" }} />
          {/* Email */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Email
          </Typography>
          <TextField
            required
            label="Email Address"
            fullWidth
            sx={{ mt: 1, fontStyle: "italic" }}
          />

          {/* Home Address */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Home Address
          </Typography>

          <TextField
            required
            label="Street Address"
            sx={{ mt: 1, fontStyle: "italic", width: "75%" }}
          />

          <TextField
            label="Apartment / Unit (optional)"
            sx={{ mt: 1, fontStyle: "italic", width: "75%" }}
          />

          <TextField label="City" sx={{ fontStyle: "italic" }} />

          <TextField label="State" sx={{ fontStyle: "italic" }} />

          <TextField label="Zip" sx={{ fontStyle: "italic" }} />
        </Box>
      </CardContent>
    </Card>
  );
}
