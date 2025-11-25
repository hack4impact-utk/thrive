import MonthSection from "./month-section";

export default function CalendarView(): React.ReactElement {
  return (
    <div>
      <MonthSection monthName="October 2025" daysInMonth={31} dayOffset={3} />
      <MonthSection monthName="November 2025" daysInMonth={30} dayOffset={6} />
      <MonthSection monthName="December 2025" daysInMonth={31} dayOffset={1} />
    </div>
  );
}
