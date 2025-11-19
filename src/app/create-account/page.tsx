"use client";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Card, CardContent, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import * as React from "react";

export default function CreateAccountPage(): React.ReactElement {
  const [showPassword1, setShowPassword1] = React.useState(false);
  const [showPassword2, setShowPassword2] = React.useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 5,
      }}
    >
      <Card
        sx={{
          display: "flex",
          paddingTop: 5,
          width: "80%",
        }}
      >
        <CardContent
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" align="center">
            Thank you for your interest in volunteering with Thrive!
          </Typography>

          <Typography
            sx={{
              fontSize: 15,
              color: "text.secondary",
              mb: 1.5,
              textAlign: "center",
            }}
          >
            You will need to create an account to get started.
          </Typography>
        </CardContent>

        <CardContent sx={{ width: "50%" }}>
          {/* Verify Password */}
          <FormControl sx={{ m: 1, width: "25ch" }} variant="standard">
            <InputLabel>Username</InputLabel>
            <Input />
          </FormControl>

          {/* Password */}
          <FormControl sx={{ m: 1, width: "25ch" }} variant="standard">
            <InputLabel>Password</InputLabel>
            <Input
              type={showPassword1 ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword1((v) => !v)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          {/* Verify Password */}
          <FormControl sx={{ m: 1, width: "25ch" }} variant="standard">
            <InputLabel>Verify Password</InputLabel>
            <Input
              type={showPassword2 ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword2((v) => !v)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </CardContent>
      </Card>
    </Box>
  );
}
