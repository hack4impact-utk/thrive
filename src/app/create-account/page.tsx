import { Box, Card, CardContent, Typography } from "@mui/material";

export default function CreateAccountPage(): React.ReactElement {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 5,
      }}
    >
      <Card>
        <CardContent
          sx={{
            width: "50%",
          }}
        >
          <Typography variant="h6" component="div" align="center">
            Thank you for your interest in volunteering with Thrive!
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: "text.secondary",
              mb: 1.5,
              textAlign: "center",
            }}
          >
            You will need to create an account to get started. Please start by
            choosing a username and password that's easy for you to remember.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
