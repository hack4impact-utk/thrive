import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

export default function getTimeRange(
  eventDate: string,
  startTime: string,
  endTime: string,
): { date: string; timeRange: string } {
  dayjs.extend(duration);

  const start = dayjs(`${eventDate} ${startTime}`);
  const end = dayjs(`${eventDate} ${endTime}`);

  const formattedDate = start.format("ddd, MMMM D");
  const formattedTimeRange = `${start.format("h:mm A")} - ${end.format("h:mm A")}`;

  const totalMinutes = end.diff(start, "minute");
  const hours = totalMinutes / 60;
  const formattedHours =
    hours % 1 === 0 ? `${hours}` : `${Number.parseFloat(hours.toFixed(2))}`;
  const formattedDuration = `(${formattedHours} Hours)`;

  return {
    date: formattedDate,
    timeRange: `${formattedTimeRange} ${formattedDuration}`,
  };
}
