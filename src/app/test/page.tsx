import { getUpcomingEvents } from "@/lib/events";

import VolunteerEventCard from "../VolunteerEventCard";

export default async function TestPage(): Promise<React.ReactElement> {
  const events = await getUpcomingEvents();

  return (
    <>
      {events.map((event) => (
        <VolunteerEventCard key={event.id} title={event.title} />
      ))}
    </>
  );
}
