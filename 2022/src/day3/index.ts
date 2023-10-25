import { loadDataFromFile } from "../utilities";

const getDuplicate = (comp1: string, comp2: string): string => {
  const visitedChars: Record<string, "first" | "second"> = {};

  for (const char of comp1.split("")) {
    // The char is duplicated in comp1, so skip it
    if (visitedChars[char] === "first") {
      continue;
    }

    // A bit of optimization. If found on first iteration, then we have it in the comp2, so voala DUPLICATE!
    if (visitedChars[char] === "second") {
      return char;
    }

    for (const char2 of comp2.split("")) {
      if (char2 === char) {
        return char;
      }

      visitedChars[char2] = "second";
    }
  }

  return comp1;
};

const getValueOfDuplicate = (char: string): number => {
  const charCode = char.charCodeAt(0);

  return charCode > 90 ? charCode - 96 : charCode - 38;
};

const part1 = (data: string[]) => {
  let result = 0;

  for (const items of data) {
    const [comp1, comp2] = [
      items.slice(0, items.length / 2),
      items.slice(items.length / 2),
    ];

    const duplicate = getDuplicate(comp1, comp2);
    result += getValueOfDuplicate(duplicate);
  }

  // Result is 8493
  console.log("Data is", result);
};

const getDuplicateInGroup = (group: [string, string, string]) => {
  const groupVisitedChars: Record<string, number | undefined> = {};

  for (let groupRucksack = 0; groupRucksack < 3; groupRucksack++) {
    const rucksackData = group[groupRucksack];
    const charsOfGroup: Record<string, true> = {};

    for (const char of rucksackData.split("")) {
      if (charsOfGroup[char]) {
        continue;
      }

      charsOfGroup[char] = true;

      groupVisitedChars[char] = (groupVisitedChars[char] ?? 0) + 1;

      if (groupVisitedChars[char] === 3) {
        return char;
      }
    }
  }
  return group[0];
};

const part2 = (data: string[]) => {
  let result = 0;
  for (let group = 0; group < data.length; group += 3) {
    const groupData: [string, string, string] = [
      data[group],
      data[group + 1],
      data[group + 2],
    ];
    const duplicate = getDuplicateInGroup(groupData);

    //console.log("GRoupData is ", groupData, duplicate);
    result += getValueOfDuplicate(duplicate);
  }

  // Result is 2552
  console.log("part2 Result is ", result);
};

const main = () => {
  const data: string[] = loadDataFromFile(__dirname + "/input.txt");

  part1(data);
  part2(data);
};

main();
