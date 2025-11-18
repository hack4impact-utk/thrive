"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import * as React from "react";

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
      <CardContent sx={{ height: "60vh" }}>
        {/* Account Page Logic can be populated here */}
      </CardContent>
    </Card>
  );
}
