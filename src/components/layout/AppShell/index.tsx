import Box from "@mui/material/Box";
import { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  sidebar?: ReactNode;
  chatPanel?: ReactNode;
};

export default function AppShell({
  children,
  sidebar,
  chatPanel,
}: AppShellProps): React.ReactElement {
  return (
    <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
      {sidebar}
      <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
        {children}
      </Box>
      {chatPanel}
    </Box>
  );
}
