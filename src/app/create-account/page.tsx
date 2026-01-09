"use client";
import { Box, Card, CardContent, Typography } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import * as React from "react";

import { DefaultButton } from "@/components/Button";

import PasswordField from "./password-field";
import UsernameField from "./username-field";

export default function CreateAccountPage(): React.ReactElement {
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
          <UsernameField />
          <PasswordField label="Password" />
          <PasswordField label="Verify Password" />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "fit-content",
              marginTop: 2,
            }}
          >
            <DefaultButton label="Next" href="/create-account/basic-info" />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
