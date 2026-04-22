import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";
import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  maxWidth?: number;
  sx?: SxProps<Theme>;
};

export default function PageContainer({
  children,
  maxWidth = 1100,
  sx,
}: PageContainerProps): React.ReactElement {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth,
        mx: "auto",
        p: { xs: 2, sm: 4 },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
