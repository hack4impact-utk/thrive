import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function WelcomeCard(): React.ReactElement {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        sx={{
          px: 5,
        }}
      >
        <CardContent>
          <Typography variant="h5" component="div" align="center">
            Welcome to Thrive's volunteer site!
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: "text.secondary",
              mb: 1.5,
              textAlign: "center",
            }}
          >
            Are you new here? Make sure you attend our Volunteer Training and
            agree to our policies before signing up for opportunities. Click
            "Sign Up" beside an opportunity below that interests you. You can
            filter the schedule using the category drop-down below this message
            on the left. Questions? If you have any questions, please email us
            at volunteer@thrivelonsdale.com.
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              textAlign: "center",
            }}
            variant="body2"
          >
            Use the toggle below to filter opportunities and events by location.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
