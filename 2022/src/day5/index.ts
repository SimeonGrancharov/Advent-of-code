import { loadDataFromFile } from "../utilities";

type InstructionT = {
  quantity: number;
  source: number;
  target: number;
};

type CrateT = string;

type Stack = CrateT[];

type Cargo = Record<string, Stack>;

type DataT = {
  instructions: InstructionT[];
  cargo: Cargo;
};

const last = (arr: any[]) => {
  return arr[arr.length - 1];
};

const generateData = (data: string[]): DataT => {
  const instructions: InstructionT[] = [];
  const cargoRaw: string[] = [];
  const cargo: Cargo = {};
  let rowIndex = 0;

  while (!data[rowIndex].startsWith("move")) {
    console.log(rowIndex);
    cargoRaw.push(data[rowIndex]);
    rowIndex++;
  }

  for (rowIndex; rowIndex < data.length; rowIndex++) {
    const [_, quantity, __, source, ___, target] = data[rowIndex].split(" ");

    instructions.push({
      quantity: parseInt(quantity),
      source: parseInt(source),
      target: parseInt(target),
    });
  }

  cargoRaw[cargoRaw.length - 1].split("").forEach((char) => {
    if (char !== " ") {
      cargo[char] = [];
    }
  });

  for (
    let crateRowIndex = cargoRaw.length - 2;
    crateRowIndex >= 0;
    crateRowIndex--
  ) {
    const cargoRow = cargoRaw[crateRowIndex];

    let column = 1;

    for (let charIdx = 0; charIdx <= cargoRow.length; charIdx += 4) {
      if (cargoRow[charIdx] === "[") {
        cargo[column]?.push(cargoRow[charIdx + 1]);
      }

      column++;
    }
  }

  return {
    instructions,
    cargo,
  };
};

const move = (
  source: string[],
  target: string[],
  quantity: number,
  pickMultiple: boolean,
) => {
  const trimFromIndex = source.length - quantity;

  const newCrates = source.splice(trimFromIndex);

  target.push(...(pickMultiple ? newCrates : newCrates.reverse()));
};

const solution = (data: DataT, pickMultiple: boolean) => {
  for (const instruction of data.instructions) {
    move(
      data.cargo[instruction.source],
      data.cargo[instruction.target],
      instruction.quantity,
      pickMultiple,
    );
  }

  return Object.values(data.cargo)
    .map((crates) => last(crates))
    .filter(Boolean)
    .join("");
};

const main = () => {
  const data = loadDataFromFile(__dirname + "/input.txt");

  const formattedData = generateData(data);

  const solution1 = solution(formattedData, false);

  // WSFTMRHPP
  console.log(solution1);

  const data2 = loadDataFromFile(__dirname + "/input.txt");

  const formattedData2 = generateData(data2);

  const solution2 = solution(formattedData2, true);

  console.log(solution2);
};

main();
