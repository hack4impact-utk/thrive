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
  const [SMS, setSMS] = React.useState("");
  const [Gender, setGender] = React.useState("");
  const [Student, setStudent] = React.useState("");

  const handleChangeLocation = (event: SelectChangeEvent) => {
    setLocation(event.target.value as string);
  };

  const handleChangeSMS = (event: SelectChangeEvent) => {
    setSMS(event.target.value as string);
  };

  const handleChangeGender = (event: SelectChangeEvent) => {
    setGender(event.target.value as string);
  };

  const handleChangeStudent = (event: SelectChangeEvent) => {
    setStudent(event.target.value as string);
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
              pt: "5%",
              }}
            >
              <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
                Mobile Phone
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "60%",
                ml: "10%",
              }}
            >
              <div>
                <TextField
                  id="mobile-phone"
                  fullWidth
                  size="small"
                />
              </div>
              <EmergencyIcon sx={{ ml: 1, fontSize: "14px" }} color="error" />
            </Box>

            <Box
            sx={{
              width: "60%",
              ml: "10%",
              pt: "5%",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
              SMS Opt-In
            </Typography>

            <Typography
              variant="caption"
              sx={{ fontSize: ".9rem", color: "#757575" }}
            >
              May we send event reminders to your mobile phone? (carrier charges may apply)
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
                <InputLabel id="SMS">SMS</InputLabel>
                <Select
                  labelId="SMS"
                  id="SMS"
                  value={SMS}
                  label="SMS"
                  onChange={handleChangeSMS}
                  sx={{
                    "& .MuiSelect-icon": {
                      color: "#22A27E",
                    },
                  }}
                >
                  <MenuItem value={"YES"}>Yes, you may text me</MenuItem>
                  <MenuItem value={"NO"}>No, do not text me</MenuItem>
                </Select>
              </FormControl>
              <EmergencyIcon sx={{ fontSize: "14px" }} color="error" />
            </Box>
            <Typography
              variant="caption"
              sx={{ fontSize: ".8rem", color: "#757575" }}
            >
              By opting in, you consent to receive text messages (for example, event reminders and updates) from VolunteerHib. Opting in is not required. Message & 
              data rates may apply. Message frequency varies. Unsubscribe at any time by replying STOP or editing your profile. Privacy Policy.
            </Typography>
          </Box>

          <Box
            sx={{
              width: "60%",
              ml: "10%",
              pt: "5%",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
              Gender
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
                <InputLabel id="Gender">Gender</InputLabel>
                <Select
                  labelId="Gender"
                  id="Gender"
                  value={Gender}
                  label="Gender"
                  onChange={handleChangeGender}
                  sx={{
                    "& .MuiSelect-icon": {
                      color: "#22A27E",
                    },
                  }}
                >
                  <MenuItem value={"Male"}>Male</MenuItem>
                  <MenuItem value={"Female"}>Female</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
            <Box
              sx={{
              width: "50%",
              ml: "10%",
              }}
            >
            </Box>

            <Box
              sx={{
              width: "50%",
              ml: "10%",
              pt: "5%",
              }}
            >
              <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
                Date of Birth
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "60%",
                ml: "10%",
              
              }}
            >
              <div style={{display: "flex", width: "60%", gap: "8px"}}>
                <TextField
                  placeholder="MM"
                  fullWidth
                  size="small"
                />
                <TextField
                  placeholder="DD"
                  fullWidth
                  size="small"
                />
                <TextField
                  placeholder="YYYY"
                  fullWidth
                  size="small"
                />
              </div>
              <EmergencyIcon sx={{ ml: 1, fontSize: "14px" }} color="error" />
            </Box>

          <Box
            sx={{
              width: "60%",
              ml: "10%",
              pt: "5%",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
              Are you a student?
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
                <InputLabel id="Student">Student</InputLabel>
                <Select
                  labelId="Student"
                  id="Student"
                  value={Student}
                  label="Student"
                  onChange={handleChangeStudent}
                  sx={{
                    "& .MuiSelect-icon": {
                      color: "#22A27E",
                    },
                  }}
                >
                  <MenuItem value={"YES"}>Yes</MenuItem>
                  <MenuItem value={"NO"}>No</MenuItem>
                </Select>
              </FormControl>
              <EmergencyIcon sx={{ fontSize: "14px" }} color="error" />
            </Box>
          </Box>
          
            <Box
              sx={{
              width: "50%",
              ml: "10%",
              pt: "5%",
              }}
            >
              <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
                If yes, name of school and grade?
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "50%",
                ml: "10%",
              }}
            >
              <div>
                <TextField
                  id="high-school"
                  fullWidth
                  size="small"
                />
              </div>
              <EmergencyIcon sx={{ ml: 1, fontSize: "14px" }} color="error" />
            </Box>

            <Box
              sx={{
              width: "50%",
              ml: "10%",
              pt: "5%",
              }}
            >
              <Typography variant="h6" sx={{ fontSize: ".9rem" }} gutterBottom>
                Occupation and Employer
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "50%",
                ml: "10%",
              }}
            >
              <div>
                <TextField
                  id="occupation"
                  fullWidth
                  size="small"
                />
              </div>
              <EmergencyIcon sx={{ ml: 1, fontSize: "14px" }} color="error" />
            </Box>
          <Box
            sx={{
              width: "60%",
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
