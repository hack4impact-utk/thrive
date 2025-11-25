import Box from "@mui/material/Box";

import CalendarGrid from "./calendar-grid";

export default function MonthSection({
  monthName,
  daysInMonth,
  dayOffset = 0,
}: {
  monthName: string;
  daysInMonth: number;
  dayOffset?: number;
}): React.ReactElement {
  return (
    <div>
      <Box
        sx={{
          bgcolor: "#22305B",
          padding: 2,
          position: "sticky",
          top: 64,
          zIndex: 9,
        }}
      >
        <h3
          style={{ color: "white", fontWeight: "lighter", marginLeft: "25vh" }}
        >
          {monthName}
        </h3>
      </Box>
      <CalendarGrid daysInMonth={daysInMonth} dayOffset={dayOffset} />
    </div>
  );
}
