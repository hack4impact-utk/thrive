import { Box, Button } from "@mui/material";

type Props = {
  label: string;
  disabled?: boolean;
};

export default function SubmitFormButton({
  label,
  disabled,
}: Props): React.ReactElement {
  return (
    <Box sx={{ display: "flex", mt: 2, mb: 2 }}>
      <Button
        type="submit"
        variant="contained"
        disabled={disabled}
        sx={{ flex: 1, bgcolor: "#22A27E", fontSize: ".95rem" }}
      >
        {label}
      </Button>
    </Box>
  );
}
