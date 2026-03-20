import { Box, Button } from "@mui/material";

type Props = {
  label: string;
};

export default function SubmitFormButton({ label }: Props): React.ReactElement {
  return (
    <Box sx={{ display: "flex", mt: 5, mb: 3 }}>
      <Button
        type="submit"
        variant="contained"
        sx={{ flex: 1, bgcolor: "#22A27E", fontSize: ".95rem" }}
      >
        {label}
      </Button>
    </Box>
  );
}
