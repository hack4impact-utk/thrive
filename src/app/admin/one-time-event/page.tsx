"use client";

import MenuIcon from "@mui/icons-material/Menu";
import { Button, Divider, Grid, TextField, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import * as React from "react";

export default function AdminPage(): React.ReactElement {
  const sections = [
    { label: "Event Name", id: "EventName" },
    { label: "Admin Notes", id: "AdminNotes" },
    { label: "Event Group", id: "EventGroup" },
    { label: "Date & Time", id: "Date" },
    { label: "Event Details", id: "EventDetails" },
    { label: "Registration Details", id: "RegistrationDetails" },
    { label: "Email Notifications", id: "EmailNotifications" },
    { label: "Waivers", id: "Waivers" },
  ];

  const [startTime, setStartTime] = useState<Dayjs | null>(null);
  const [endTime, setEndTime] = useState<Dayjs | null>(null);

  const [groupName, setGroupName] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [registerCutOff, setRegisterCutOff] = React.useState("");
  const [cancelCutOff, setCancelCutOff] = React.useState("");
  const [visibility, setVisibility] = React.useState("");
  const [hourReporting, setHourReporting] = React.useState("");

  const changeGroupName = (event: SelectChangeEvent<string>): void => {
    setGroupName(event.target.value);
  };
  const changeContact = (event: SelectChangeEvent<string>): void => {
    setContact(event.target.value as string);
  };
  const changeLocation = (event: SelectChangeEvent<string>): void => {
    setLocation(event.target.value as string);
  };
  const changeRegisterCutOff = (event: SelectChangeEvent<string>): void => {
    setRegisterCutOff(event.target.value as string);
  };
  const changeCancelCutOff = (event: SelectChangeEvent<string>): void => {
    setCancelCutOff(event.target.value as string);
  };
  const changeVisibility = (event: SelectChangeEvent<string>): void => {
    setVisibility(event.target.value as string);
  };
  const changeHourReporting = (event: SelectChangeEvent<string>): void => {
    setHourReporting(event.target.value as string);
  };

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      },
    );

    for (const { id } of sections) {
      const el = document.querySelector(id);
      if (el) observer.observe(el);
    }

    return (): void => observer.disconnect();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <>
        <Grid
          container
          sx={{
            borderTop: 1,
            borderColor: "#B4C0D4",
          }}
        >
          {/* HEADER*/}
          <Grid
            container
            spacing={2}
            size={12}
            sx={{
              width: 1 / 1,
              padding: 2,
              display: "flex",
              position: "sticky",
              alignItems: "center",
              top: 64,
              zIndex: 9,
              background: "#FFF",
            }}
          >
            <Grid size={1}>
              <Button sx={{ background: "None", padding: 0 }}>
                <MenuIcon sx={{ fontSize: "2rem", color: "#073893" }} />
              </Button>
            </Grid>
            <Grid
              container
              justifyContent="space-between"
              alignItems={"center"}
              size={11}
            >
              <Typography
                sx={{
                  fontSize: "2rem",
                  color: "#073893",
                  fontWeight: "1",
                }}
              >
                Create New One-Time Event
              </Typography>

              <Button sx={{ background: "#F2AB24" }} variant="contained">
                Save
              </Button>
            </Grid>
          </Grid>

          {/* SECTION SIDE BAR*/}
          <Grid
            size={3}
            sx={{
              zIndex: 11,
              position: "fixed",
              top: 145,
              bgcolor: "#073884",
              height: "100%",
            }}
          >
            <List
              sx={{
                background: "#073884",
              }}
            >
              <Grid
                container
                sx={{
                  background: "#073884",

                  color: "#9FA9BB",
                  padding: "1rem",
                  marginTop: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <Grid
                  size={6}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    justifySelf: "start",
                  }}
                >
                  <Typography sx={{ fontWeight: 1, fontSize: "0.8rem" }}>
                    Step 1
                  </Typography>
                  <Typography sx={{}}>Event Type</Typography>
                </Grid>
                <Grid
                  size={6}
                  sx={{
                    display: "flex",
                    alignSelf: "center",
                    justifyContent: "end",
                  }}
                >
                  <Typography sx={{ fontSize: "0.9rem" }}>
                    One-Time Event
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ background: "#2A5495" }} />
              {sections.map(({ label, id }) => (
                <ListItem
                  key={id}
                  disablePadding
                  sx={{
                    background: activeId === id ? "#052F70" : "transparent",
                  }}
                >
                  <Link
                    sx={{ textDecoration: "None", width: "100%" }}
                    href={`#${id}`}
                  >
                    <ListItemButton
                      sx={{
                        ":hover": { background: "#052F70" },
                        color: "#F7941E",
                        borderRight: activeId === id ? 8 : 0,
                      }}
                    >
                      <ListItemText
                        primary={label}
                        sx={{ color: activeId === id ? "#FFF" : "#9FA9BB" }}
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Grid>
          {/* EVENT FORM */}
          <Grid
            size={9}
            sx={{
              position: "relative",
              left: "25%",
              display: "flex",
              flexDirection: "column",
              zIndex: 2,
              background: "#F2F4F8",
              padding: 6,
            }}
          >
            <Typography
              id="EventName"
              sx={{
                fontSize: "1.8rem",
                scrollMarginTop: "15rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Event Name
            </Typography>
            <Typography
              sx={{
                marginTop: 3,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Name of Event
            </Typography>
            <TextField
              required
              label="ie. Sample Event name"
              sx={{
                marginTop: 1,
                background: "#FFFFFF",
                width: "50%",
                color: "#B4C0D4",
                borderColor: "#B4C0D4",
                marginBottom: 3,
              }}
            />
            <Divider />
            <Typography
              id="AdminNotes"
              sx={{
                marginTop: 6,
                scrollMarginTop: "10rem",
                fontSize: "1.8rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Admin Notes
            </Typography>
            <Typography
              sx={{
                marginTop: 3,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Notes
            </Typography>
            <TextField
              required
              label=""
              sx={{
                marginTop: 1,
                background: "#FFFFFF",
                width: "50%",
                color: "#B4C0D4",
                borderColor: "#B4C0D4",
                marginBottom: 3,
              }}
            />
            <Divider />
            <Typography
              id="EventGroup"
              sx={{
                marginTop: 6,
                scrollMarginTop: "10rem",
                fontSize: "1.8rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Event Group
            </Typography>
            <Typography
              sx={{
                marginTop: 3,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Name of Group
            </Typography>
            <FormControl
              sx={{
                marginTop: 1,
                marginBottom: 3,
                width: "50%",
                background: "#FFF",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="groupName"
                value={groupName}
                label=""
                onChange={changeGroupName}
              >
                <MenuItem value={"All Events"}>All Events</MenuItem>
                <MenuItem value={"ExampleA"}>Example A</MenuItem>
                <MenuItem value={"ExampleB"}>Example B</MenuItem>
              </Select>
            </FormControl>
            <Divider />
            <Typography
              id="Date"
              sx={{
                marginTop: 6,
                scrollMarginTop: "10rem",
                fontSize: "1.8rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Date & Time
            </Typography>
            <Grid gap={3} size={6} sx={{ display: "flex" }}>
              <Grid size={6}>
                <Typography
                  sx={{
                    marginTop: 3,
                    fontSize: "1rem",
                    color: "#073893",
                    fontWeight: "semi-bold",
                  }}
                >
                  Start Time
                </Typography>
                <DateTimePicker
                  value={startTime}
                  onChange={(newValue) => setStartTime(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { background: "#FFF", mt: 1 },
                    },
                  }}
                />
              </Grid>
              <Grid size={6}>
                <Typography
                  sx={{
                    marginTop: 3,
                    fontSize: "1rem",
                    color: "#073893",
                    fontWeight: "semi-bold",
                  }}
                >
                  End time
                </Typography>
                <DateTimePicker
                  value={endTime}
                  onChange={(newValue) => setEndTime(newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { background: "#FFF", mt: 1 },
                    },
                  }}
                />
              </Grid>
            </Grid>
            <Divider />
            <Typography
              id="EventDetails"
              sx={{
                marginTop: 6,
                scrollMarginTop: "10rem",
                fontSize: "1.8rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Event Details
            </Typography>
            <Typography
              sx={{
                marginTop: 3,
                marginBottom: 1,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Short Description
            </Typography>
            <TextField
              sx={{ background: "#FFF", width: "75%" }}
              id="outlined-multiline-static"
              multiline
              rows={4}
              defaultValue=""
            />
            <Typography
              sx={{
                marginTop: 3,
                marginBottom: 1,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Detailed Description
            </Typography>
            <TextField
              sx={{ background: "#FFF", width: "75%" }}
              id="outlined-multiline-static"
              multiline
              rows={4}
              defaultValue=""
            />
            <Typography
              sx={{
                marginTop: 3,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Location
            </Typography>
            <FormControl
              sx={{
                marginTop: 1,
                marginBottom: 3,
                width: "50%",
                background: "#FFF",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={location}
                label=""
                onChange={changeLocation}
              >
                <MenuItem value={"Knoxville_TN"}>Knoxville, TN</MenuItem>
                <MenuItem value={"Clarksville_TN"}>Clarksville, TN</MenuItem>
                <MenuItem value={"Nashville_TN"}>Nashville, TN</MenuItem>
              </Select>
            </FormControl>
            <Typography
              sx={{
                marginTop: 3,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Event Contact
            </Typography>
            <FormControl
              sx={{
                marginTop: 1,
                marginBottom: 3,
                width: "50%",
                background: "#FFF",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={contact}
                label=""
                onChange={changeContact}
              >
                <MenuItem value={"cmcwhorter"}>
                  Abigail Beach (cmcwhorter)
                </MenuItem>
                <MenuItem value={"JohnDoe"}>John Doe</MenuItem>
                <MenuItem value={"JaneDoe"}>Jane Doe</MenuItem>
              </Select>
            </FormControl>
            <Divider />
            <Typography
              id="RegistrationDetails"
              sx={{
                marginTop: 6,
                scrollMarginTop: "10rem",
                fontSize: "1.8rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Registration Details
            </Typography>
            <Typography
              sx={{
                marginTop: 3,
                marginBottom: 1,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Event Slot Limit
            </Typography>
            <TextField
              sx={{ background: "#FFF", width: "50%" }}
              id="outlined-multiline-static"
              defaultValue=""
            />
            <Typography
              sx={{
                marginTop: 3,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Self-Registration Cut-Off
            </Typography>
            <FormControl
              sx={{
                marginTop: 1,
                marginBottom: 3,
                width: "50%",
                background: "#FFF",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={registerCutOff}
                label=""
                onChange={changeRegisterCutOff}
              >
                <MenuItem value={"No Cut OFf"}>No cut-off</MenuItem>
              </Select>
            </FormControl>
            <Typography
              sx={{
                marginTop: 3,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Self-Cancellation Cut-Off
            </Typography>
            <FormControl
              sx={{
                marginTop: 1,
                marginBottom: 3,
                width: "50%",
                background: "#FFF",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={cancelCutOff}
                label=""
                onChange={changeCancelCutOff}
              >
                <MenuItem value={"No Cut OFf"}>No cut-off</MenuItem>
              </Select>
            </FormControl>
            <Typography
              sx={{
                marginTop: 3,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Event Visibility
            </Typography>
            <FormControl
              sx={{
                marginTop: 1,
                marginBottom: 3,
                width: "50%",
                background: "#FFF",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={visibility}
                label=""
                onChange={changeVisibility}
              >
                <MenuItem
                  value={"Show this event when registration is deactivated"}
                >
                  Show this event when registration is deactivated
                </MenuItem>
              </Select>
            </FormControl>
            <Typography
              sx={{
                marginTop: 3,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Hours Self-Reporting
            </Typography>
            <FormControl
              sx={{
                marginTop: 1,
                marginBottom: 3,
                width: "50%",
                background: "#FFF",
              }}
            >
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={hourReporting}
                label=""
                onChange={changeHourReporting}
              >
                <MenuItem value={"Allowed"}>
                  Allowed (organizational default)
                </MenuItem>
                <MenuItem value={"Not Allowed"}>Not Allowed</MenuItem>
              </Select>
            </FormControl>
            <Typography
              sx={{
                marginTop: 3,
                marginBottom: 1,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Event Registration Question
            </Typography>
            <TextField
              sx={{ background: "#FFF", width: "50%" }}
              id="outlined-multiline-static"
              defaultValue=""
            />
            <Divider />
            <Typography
              id="EmailNotifications"
              sx={{
                marginTop: 6,
                fontSize: "1.8rem",
                scrollMarginTop: "10rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Email Notifications
            </Typography>
            <Typography
              sx={{
                marginTop: 3,
                marginBottom: 1,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Confirmation Message
            </Typography>
            <TextField
              sx={{ background: "#FFF", width: "75%" }}
              id="outlined-multiline-static"
              multiline
              rows={4}
              defaultValue=""
            />
            <FormGroup sx={{ color: "#A3B3CC" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#A3B3CC",
                      "&.Mui-checked": { color: "#F7941E" },
                    }}
                  />
                }
                label="Send confirmation email to event contact"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#A3B3CC",
                      "&.Mui-checked": { color: "#F7941E" },
                    }}
                  />
                }
                label="Send cancellation email to event contact"
              />
            </FormGroup>

            <Typography
              sx={{
                marginTop: 3,
                marginBottom: 1,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Reminder Email
            </Typography>
            <TextField
              sx={{ background: "#FFF", width: "75%" }}
              id="outlined-multiline-static"
              multiline
              rows={4}
              defaultValue=""
            />
            <FormGroup sx={{ color: "#A3B3CC" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#A3B3CC",
                      "&.Mui-checked": { color: "#F7941E" },
                    }}
                  />
                }
                label="Automatically send reminder email to registered users 3 DAYS prior to event"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#A3B3CC",
                      "&.Mui-checked": { color: "#F7941E" },
                    }}
                  />
                }
                label="Automatically send reminder text message to registered users 3 DAYS prior to event"
              />
            </FormGroup>
            <Typography
              sx={{
                marginTop: 3,
                marginBottom: 1,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Thank-You Email
            </Typography>
            <TextField
              sx={{ background: "#FFF", width: "75%" }}
              id="outlined-multiline-static"
              multiline
              rows={4}
              defaultValue=""
            />
            <FormGroup sx={{ color: "#A3B3CC" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#A3B3CC",
                      "&.Mui-checked": { color: "#F7941E" },
                    }}
                  />
                }
                label="Automatically send thank-you email 24 hours after event completes"
              />
            </FormGroup>
            <Divider sx={{ marginTop: 3 }} />
            <Typography
              id="Waivers"
              sx={{
                marginTop: 6,
                fontSize: "1.8rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Minimum Age
            </Typography>
            <Typography
              sx={{
                marginTop: 3,
                marginBottom: 1,
                fontSize: "1rem",
                color: "#073893",
                fontWeight: "semi-bold",
              }}
            >
              Minimum Age
            </Typography>
            <TextField
              sx={{ background: "#FFF", width: "75%", marginBottom: 20 }}
              id="outlined-multiline-static"
              defaultValue=""
            />
          </Grid>
        </Grid>
      </>
    </LocalizationProvider>
  );
}
