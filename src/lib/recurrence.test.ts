import assert from "node:assert/strict";
import test from "node:test";

import {
  getMaterializationDates,
  occursOnDate,
  type RecurringPattern,
} from "./recurrence";

const basePattern: RecurringPattern = {
  frequency: "daily",
  startDate: "2026-07-01",
  endDate: null,
  daysOfWeek: null,
  weekdaysOnly: false,
  monthlyType: null,
  monthlyNth: null,
  monthlyWeekday: null,
};

void test("daily supports every day and weekdays only", () => {
  assert.equal(occursOnDate(basePattern, "2026-07-04"), true);
  assert.equal(
    occursOnDate({ ...basePattern, weekdaysOnly: true }, "2026-07-04"),
    false,
  );
  assert.equal(
    occursOnDate({ ...basePattern, weekdaysOnly: true }, "2026-07-06"),
    true,
  );
});

void test("weekly supports all selected weekdays", () => {
  const pattern = {
    ...basePattern,
    frequency: "weekly",
    daysOfWeek: [1, 3, 5],
  };
  assert.equal(occursOnDate(pattern, "2026-07-06"), true);
  assert.equal(occursOnDate(pattern, "2026-07-07"), false);
  assert.equal(occursOnDate(pattern, "2026-07-08"), true);
});

void test("biweekly anchors the cadence to the first selected weekday", () => {
  const pattern = {
    ...basePattern,
    frequency: "biweekly",
    startDate: "2026-07-01",
    daysOfWeek: [1],
  };
  assert.equal(occursOnDate(pattern, "2026-07-06"), true);
  assert.equal(occursOnDate(pattern, "2026-07-13"), false);
  assert.equal(occursOnDate(pattern, "2026-07-20"), true);
});

void test("monthly supports day-of-month, nth weekday, and last weekday", () => {
  const dayOfMonth = {
    ...basePattern,
    frequency: "monthly",
    startDate: "2026-01-31",
    monthlyType: "day-of-month",
  };
  assert.equal(occursOnDate(dayOfMonth, "2026-03-31"), true);
  assert.equal(occursOnDate(dayOfMonth, "2026-02-28"), false);

  const secondWednesday = {
    ...basePattern,
    frequency: "monthly",
    monthlyType: "nth-weekday",
    monthlyNth: 2,
    monthlyWeekday: 3,
  };
  assert.equal(occursOnDate(secondWednesday, "2026-07-08"), true);
  assert.equal(occursOnDate(secondWednesday, "2026-07-15"), false);

  const lastFriday = {
    ...secondWednesday,
    monthlyNth: -1,
    monthlyWeekday: 5,
  };
  assert.equal(occursOnDate(lastFriday, "2026-07-31"), true);
  assert.equal(occursOnDate(lastFriday, "2026-07-24"), false);
});

void test("materialization recovers weekly occurrences missed after the cron ran", () => {
  const pattern = {
    ...basePattern,
    frequency: "weekly",
    startDate: "2026-07-29",
    endDate: "2026-08-30",
    createdAt: "2026-07-29T14:08:26.000Z",
    daysOfWeek: [3, 4],
  };

  assert.deepEqual(
    getMaterializationDates(pattern, "2026-07-29", "2026-07-30"),
    ["2026-07-29", "2026-07-30"],
  );
});

void test("materialization respects creation, start, and inclusive end dates", () => {
  const pattern = {
    ...basePattern,
    startDate: "2026-07-29",
    endDate: "2026-07-30",
    createdAt: "2026-07-29T14:00:00.000Z",
  };

  assert.deepEqual(
    getMaterializationDates(pattern, "2026-07-29", "2026-07-30"),
    ["2026-07-29", "2026-07-30"],
  );
  assert.deepEqual(
    getMaterializationDates(
      { ...pattern, startDate: "2026-08-10", endDate: null },
      "2026-07-29",
      "2026-07-31",
    ),
    [],
  );
});
