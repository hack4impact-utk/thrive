import EmergencyIcon from "@mui/icons-material/Emergency";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function BasicTextFields(): React.ReactElement {
  return (
    <Box
      component="form"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // center horizontally
        "& > :not(style)": { m: 1 },
      }}
      noValidate
      autoComplete="off"
    >
      {/* 1st question box*/}
      <Box
        sx={{
          width: "350px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start", // text aligns left
        }}
      >
        <Typography
          fontWeight="normal"
          fontFamily={"Inter"}
          sx={{ width: "100%" }}
        >
          Occupation and Employer
        </Typography>

        <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
          <TextField
            variant="outlined"
            margin="normal"
            sx={{ width: "100%" }}
          />
          <EmergencyIcon color="error" sx={{ ml: 1 }} />
        </Box>
      </Box>

      {/* 2nd question box*/}
      <Box
        sx={{
          width: "360px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography fontWeight="normal" fontFamily={"Inter"}>
          Do you attend a church? If so, which church?
        </Typography>

        <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
          <TextField
            variant="outlined"
            margin="normal"
            sx={{ width: "100%" }}
          />
        </Box>
      </Box>

      {/* 3rd question box*/}
      <Box
        sx={{
          width: "350px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          fontWeight="normal"
          fontFamily={"Inter"}
          sx={{ width: "100%" }}
        >
          Are you a part of a campus ministry? We'd love to know!
        </Typography>

        <Box display="flex" alignItems="center" sx={{ width: "100%" }}>
          <TextField
            variant="outlined"
            margin="normal"
            sx={{ width: "100%" }}
          />
          <EmergencyIcon color="error" sx={{ ml: 1 }} />
        </Box>
      </Box>
    </Box>
  );
}
