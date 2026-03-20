import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

export default function getTimeRange(
  eventDate: string,
  startTime: string,
  endTime: string,
): string {
  dayjs.extend(duration);

  const start = dayjs(`${eventDate} ${startTime}`);
  const end = dayjs(`${eventDate} ${endTime}`);

  const formattedDate = start.format("ddd, MMMM D");
  const formattedTimeRange = `${start.format("h A")} - ${end.format("h A")}`;

  const hours = Math.round(end.diff(start, "minute") / 60);
  const formattedDuration = `(${hours} Hours)`;

  return `${formattedDate} at ${formattedTimeRange} ${formattedDuration}`;
}
