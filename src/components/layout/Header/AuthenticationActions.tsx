import { Box } from "@mui/material";

import { AuthButton, DefaultButton } from "@/components/ui/Button";

import ProfileDropdown from "./ProfileDropdown";

type Props = {
  status: "authenticated" | "unauthenticated" | "loading";
};

export default function AuthenticationActions({
  status,
}: Props): React.ReactElement | null {
  if (status === "loading") {
    return null;
  }

  if (status === "authenticated") {
    return (
      <Box sx={{ flexShrink: 0 }}>
        <ProfileDropdown />
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <AuthButton label="Sign In" />
        <DefaultButton
          label="Create account"
          href="/create-account"
          bgcolor="inherit"
          color="primary"
        />
      </>
    );
  }

  return null;
}
