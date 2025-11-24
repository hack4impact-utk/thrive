import { Box } from "@mui/material";

import AuthButton from "@/components/AuthButton";

export default function SignInPage(): React.ReactElement {
  return (
    <Box>
      <AuthButton label="Sign in with Google" />
    </Box>
  );
}
