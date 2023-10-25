import { loadDataFromFile } from "../utilities";

type IntervalT = [number, number];
type IntervalsT = [IntervalT, IntervalT];

const doesOneIntervalContainsTheOther = (intervals: IntervalsT): boolean => {
  const [firstStart, firstEnd] = intervals[0];
  const [secondStart, secondEnd] = intervals[1];

  return (
    (firstStart <= secondStart && firstEnd >= secondEnd) ||
    (secondStart <= firstStart && secondEnd >= firstEnd)
  );
};

const part1 = (intervals: IntervalsT[]): number => {
  let contains = 0;

  for (const interval of intervals) {
    if (doesOneIntervalContainsTheOther(interval)) {
      contains++;
    }
  }

  return contains;
};

const part2 = (intervals: IntervalsT[]): number => {
  let overlaps = 0;

  for (const interval of intervals) {
    const [firstStart, firstEnd] = interval[0];
    const [secondStart, secondEnd] = interval[1];

    if (
      // Hack not to check for second interval, in case second contains first
      doesOneIntervalContainsTheOther(interval) ||
      (firstStart <= secondStart && firstEnd >= secondStart) ||
      (firstStart <= secondEnd && firstEnd >= secondEnd)
    ) {
      overlaps++;
    }
  }

  return overlaps;
};

const main = () => {
  const data = loadDataFromFile(__dirname + "/input.txt");
  const intervals: IntervalsT[] = data.map(
    (row) =>
      row
        .split(",")
        .map(
          (x) => x.split("-").map((y) => parseInt(y)) as IntervalT
        ) as IntervalsT
  );

  const conflicts = part1(intervals);

  console.log(`part 1 ============== ${conflicts}`);
  const overlaps = part2(intervals);
  console.log(`part 2 ============== ${overlaps}`);
};

main();
