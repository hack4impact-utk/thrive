"use client";
import EmergencyIcon from "@mui/icons-material/Emergency";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";

export default function OutlinedCard() {
  const [location, setLocation] = React.useState("");
  const [size, setSize] = React.useState("");

  const handleChangeLocation = (event: SelectChangeEvent) => {
    setLocation(event.target.value as string);
  };

  const handleChangeSize = (event: SelectChangeEvent) => {
    setSize(event.target.value as string);
  };

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
            }}
          >
            <div>
              <TextField
                id="medical conditions"
                multiline
                rows={1}
                defaultValue="N/A"
                fullWidth
              />
            </div>
          </Box>

          <Box
            sx={{
              width: "50%",
              ml: "10%",
              pt: "5%",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
              Do you have a preference on which neighborhood you are placed in?
            </Typography>

            <Typography
              variant="caption"
              sx={{ fontSize: ".9rem", color: "#757575" }}
            >
              * We will ultimately place based on needs of the site but would
              love to know your preference!
            </Typography>

            <Box
              sx={{
                display: "flex",
                width: "60%",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{ m: 1, minWidth: 120, color: "inherit" }}
                size="small"
                fullWidth
              >
                <InputLabel id="location">Location</InputLabel>
                <Select
                  labelId="location"
                  id="location"
                  value={location}
                  label="Location"
                  onChange={handleChangeLocation}
                  sx={{
                    "& .MuiSelect-icon": {
                      color: "#22A27E",
                    },
                  }}
                >
                  <MenuItem value={"Lonsdale"}>Lonsdale</MenuItem>
                  <MenuItem value={"Parkridge"}>Parkridge</MenuItem>
                  <MenuItem value={"New Hopewell"}>New Hopewell</MenuItem>
                  <MenuItem value={"Papermill"}>Papermill</MenuItem>
                  <MenuItem value={"West View"}>West View</MenuItem>
                  <MenuItem value={"Westland"}>Westland</MenuItem>
                </Select>
              </FormControl>
              <EmergencyIcon sx={{ fontSize: "14px" }} color="error" />
            </Box>
          </Box>

          <Box
            sx={{
              pt: "3%",
              width: "50%",
              ml: "10%",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
              Please select your shirt size:
            </Typography>

            <Box
              sx={{
                width: "60%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FormControl
                sx={{ m: 1, minWidth: 120, color: "inherit" }}
                size="small"
                fullWidth
              >
                <InputLabel id="size">Size</InputLabel>
                <Select
                  labelId="size"
                  id="size"
                  value={size}
                  label="Size"
                  onChange={handleChangeSize}
                  sx={{
                    "& .MuiSelect-icon": {
                      color: "#22A27E",
                    },
                  }}
                >
                  <MenuItem value={"Small"}>Small</MenuItem>
                  <MenuItem value={"Medium"}>Medium</MenuItem>
                  <MenuItem value={"New Large"}>Large</MenuItem>
                </Select>
              </FormControl>
              <EmergencyIcon sx={{ fontSize: "14px" }} color="error" />
            </Box>

            <Box
              sx={{
                pt: "5%",
              }}
            >
              <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
                Do you have any medical conditions we should be aware of?
              </Typography>
            </Box>

            <Box
              sx={{
                width: "60%",
                ml: "1.3%",
              }}
            >
              <div>
                <TextField
                  id="medical conditions"
                  multiline
                  rows={4}
                  defaultValue="N/A"
                  fullWidth
                />
              </div>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                pt: "5%",
              }}
            >
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label="Would you like to receive monthly newsletters?"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                pt: "3%",
              }}
            >
              <Box
                sx={{
                  bgcolor: "#757575",
                  borderRadius: 1,
                  width: "35%",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  color: "#FFF",
                }}
              >
                <Button color="inherit">Previous</Button>
              </Box>

              <Box
                sx={{
                  bgcolor: "#22A27E",
                  borderRadius: 1,
                  width: "35%",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  color: "#FFF",
                }}
              >
                <Button color="inherit">Next</Button>
              </Box>
            </Box>
          </Box>
        </CardContent>

        <CardActions></CardActions>
      </Card>
    </Box>
  );
}
