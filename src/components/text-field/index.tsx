"use client";
import EmergencyIcon from "@mui/icons-material/Emergency";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

export default function BasicQuestionComponent() {
  return (
    <Box sx={{ ml: "20%", mr: "20%", pt: "5%" }}>
      <Card>
        <CardContent>
          <Box
            sx={{
              width: "50%",
              ml: "10%",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
              Occupation and Employer
            </Typography>
          </Box>

          <Box
            sx={{
              width: "50%",
              ml: "10%",
              display: "flex",
              alignItems: "center",
              pt: "1%",
            }}
          >
            <div>
              <TextField
                id="occupation and employer"
                multiline
                rows={1}
                defaultValue="N/A"
                fullWidth
              />
            </div>
            <EmergencyIcon
              color="error"
              sx={{ ml: 1 }}
              fontSize="normal" // small space to the left of the icon
            />
          </Box>

          <Box sx={{ ml: "20%", mr: "20%", pt: "5%" }}></Box>
          <Box
            sx={{
              width: "50%",
              ml: "10%",
              display: "flex",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
              Do you attend a church? If so, which church?
            </Typography>
          </Box>

          <Box
            sx={{
              width: "50%",
              ml: "10%",
              display: "flex",
              alignItems: "center",
              pt: "1%",
            }}
          >
            <div>
              <TextField
                id="church"
                multiline
                rows={1}
                defaultValue="N/A"
                fullWidth
              />
            </div>
            <EmergencyIcon
              color="error"
              sx={{ ml: 1 }}
              fontSize="normal" // small space to the left of the icon
            />
          </Box>

          <Box sx={{ ml: "20%", mr: "20%", pt: "5%" }}></Box>
          <Box
            sx={{
              width: "50%",
              ml: "10%",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
              Are you a part of a campus ministry? We'd love to know!
            </Typography>
          </Box>

          <Box
            sx={{
              width: "60%",
              ml: "10%",
              pt: "1%",
            }}
          >
            <div>
              <TextField
                id="campus ministry"
                multiline
                rows={1}
                defaultValue="N/A"
                fullWidth
              />
            </div>
          </Box>

          <Box sx={{ ml: "20%", mr: "20%", pt: "5%" }}></Box>
          <Box
            sx={{
              width: "50%",
              ml: "10%",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
              How did you hear about Thrive?
            </Typography>
          </Box>

          <Box
            sx={{
              width: "60%",
              ml: "10%",
              pt: "1%",
            }}
          >
            <div>
              <TextField
                id="about thrive"
                multiline
                rows={1}
                defaultValue="N/A"
                fullWidth
              />
            </div>
          </Box>

          <Box sx={{ ml: "20%", mr: "20%", pt: "5%" }}></Box>
          <Box
            sx={{
              width: "50%",
              ml: "10%",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
              Why do you want to volunteer at Thrive?
            </Typography>
          </Box>

          <Box
            sx={{
              width: "60%",
              ml: "10%",
              pt: "1%",
            }}
          >
            <div>
              <TextField
                id="volunteering at thrive"
                multiline
                rows={4}
                defaultValue="N/A"
                fullWidth
              />
            </div>
          </Box>

          <Box
            sx={{
              width: "60%",
              ml: "10%",
              pt: "5%",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
              What days of the week are you available to serve?
            </Typography>

            <Typography
              variant="caption"
              sx={{ fontSize: ".9rem", color: "#757575" }}
            >
              examples: any day, only tuesdays, monday/wednesday/friday, etc.
            </Typography>
            <Box sx={{ ml: "20%", mr: "20%", pt: "2%" }}></Box>
            <div>
              <TextField
                id="availability"
                multiline
                rows={1}
                defaultValue="N/A"
                fullWidth
              />
            </div>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
