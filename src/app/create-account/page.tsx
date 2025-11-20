"use client";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import * as React from "react";

export default function CreateAccountPage(): React.ReactElement {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 5,
      }}
    >
      <CardContent sx={{ bgcolor: "#f0f0f0ff", boxShadow: 3, width: "80%" }}>
        <CardHeader
          title="Account"
          sx={{
            bgcolor: "primary.secondary",
            color: "secondary.main",
            textAlign: "center",
          }}
        ></CardHeader>
        <Grid
          sx={{
            width: "80%",
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
          {/* Username */}
          <FormControl sx={{ m: 1, width: "25ch" }} variant="standard">
            <InputLabel>Username</InputLabel>
            <Input />
          </FormControl>

          {/* Password */}
          <FormControl sx={{ m: 1, width: "25ch" }} variant="standard">
            <InputLabel>Password</InputLabel>
            <Input
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((v) => !v)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>

          {/* Verify Password */}
          <FormControl sx={{ m: 1, width: "25ch" }} variant="standard">
            <InputLabel>Verify Password</InputLabel>
            <Input
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((v) => !v)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Box
            sx={{
              bgcolor: "#22A27E",
              color: "#FFFFFF",
              borderRadius: 1,
              display: "flex",
              justifyContent: "center",
              width: "fit-content",
              marginTop: 2,
              marginLeft: 1,
            }}
          >
            <Button color="inherit">Next</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
