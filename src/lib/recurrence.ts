const DAY_IN_MS = 24 * 60 * 60 * 1000;

export type RecurringPattern = {
  frequency: string;
  startDate: string;
  endDate?: string | null;
  createdAt?: Date | string;
  daysOfWeek: number[] | null;
  weekdaysOnly: boolean;
  monthlyType: string | null;
  monthlyNth: number | null;
  monthlyWeekday: number | null;
};

function parseDateOnly(date: string): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  const result = parseDateOnly(date);
  result.setUTCDate(result.getUTCDate() + days);
  return formatDateOnly(result);
}

export function occursOnDate(
  pattern: RecurringPattern,
  targetDate: string,
): boolean {
  const start = parseDateOnly(pattern.startDate);
  const target = parseDateOnly(targetDate);

  if (target < start) return false;
  if (pattern.endDate && targetDate > pattern.endDate) return false;

  switch (pattern.frequency) {
    case "daily": {
      if (pattern.weekdaysOnly) {
        const day = target.getUTCDay();
        return day >= 1 && day <= 5;
      }
      return true;
    }

    case "weekly": {
      const days =
        pattern.daysOfWeek && pattern.daysOfWeek.length > 0
          ? pattern.daysOfWeek
          : [start.getUTCDay()];
      return days.includes(target.getUTCDay());
    }

    case "biweekly": {
      const selectedDay =
        pattern.daysOfWeek && pattern.daysOfWeek.length > 0
          ? pattern.daysOfWeek[0]
          : start.getUTCDay();

      if (target.getUTCDay() !== selectedDay) return false;

      const daysUntilFirst = (selectedDay - start.getUTCDay() + 7) % 7;
      const firstOccurrence = new Date(start);
      firstOccurrence.setUTCDate(start.getUTCDate() + daysUntilFirst);

      if (target < firstOccurrence) return false;

      const diffWeeks = Math.floor(
        (target.getTime() - firstOccurrence.getTime()) / (7 * DAY_IN_MS),
      );
      return diffWeeks % 2 === 0;
    }

    case "monthly": {
      if (
        pattern.monthlyType === "nth-weekday" &&
        pattern.monthlyNth !== null &&
        pattern.monthlyWeekday !== null
      ) {
        if (target.getUTCDay() !== pattern.monthlyWeekday) return false;

        if (pattern.monthlyNth === -1) {
          const nextWeek = new Date(target);
          nextWeek.setUTCDate(target.getUTCDate() + 7);
          return nextWeek.getUTCMonth() !== target.getUTCMonth();
        }

        return Math.ceil(target.getUTCDate() / 7) === pattern.monthlyNth;
      }

      return target.getUTCDate() === start.getUTCDate();
    }

    default: {
      return false;
    }
  }
}

function createdDate(pattern: RecurringPattern): string | null {
  if (!pattern.createdAt) return null;
  const value =
    pattern.createdAt instanceof Date
      ? pattern.createdAt
      : new Date(pattern.createdAt);
  return Number.isNaN(value.getTime()) ? null : formatDateOnly(value);
}

/**
 * Returns missing-event candidates in an inclusive date window.
 *
 * Dates before the template itself was created are excluded so catch-up never
 * invents historical events.
 */
export function getMaterializationDates(
  pattern: RecurringPattern,
  fromDate: string,
  throughDate: string,
): string[] {
  const lowerBounds = [pattern.startDate, fromDate];
  const patternCreatedDate = createdDate(pattern);
  if (patternCreatedDate) lowerBounds.push(patternCreatedDate);

  let effectiveFromDate = lowerBounds[0];
  for (const date of lowerBounds.slice(1)) {
    if (date > effectiveFromDate) effectiveFromDate = date;
  }
  const toDate =
    pattern.endDate && pattern.endDate < throughDate
      ? pattern.endDate
      : throughDate;

  if (effectiveFromDate > toDate) return [];

  const dates: string[] = [];
  for (let date = effectiveFromDate; date <= toDate; date = addDays(date, 1)) {
    if (occursOnDate(pattern, date)) dates.push(date);
  }
  return dates;
}
