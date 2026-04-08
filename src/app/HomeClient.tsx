// app/HomeClient.tsx
"use client";

import Box from "@mui/material/Box";
import WelcomeCard from "@/features/home/components/WelcomeCard";
import ToggleViews from "@/features/toggles/ToggleViews";
import ListView from "@/features/toggles/ToggleViews/ListView";
import Filters from "../features/filters";
import { fuzzyMatch } from "@/utils/levenshtein";
import * as React from "react";

export default function HomeClient({ eventsWithState }: { eventsWithState: any[] }) {
  const [query, setQuery] = React.useState("");

  const filtered = (eventsWithState??[]).filter(event =>
    fuzzyMatch(event.title, query)
  );

  return (
    <div>
      <Box
        sx={{
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          p: { xs: 2, sm: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <WelcomeCard />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ToggleViews />
          <Filters query={query} onQueryChange={setQuery} />
        </Box>
        <ListView events={filtered} />
      </Box>
    </div>
  );
}