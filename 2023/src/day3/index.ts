import { loadDataFromFile } from '../utilities'

function parseInput(data: string[]): string[][] {
  return data.map((row) => row.split(''))
}

function isAdjacentSym(sym: string): boolean {
  return sym !== '.'
}

function checkForAdjacent(
  data: string[][],
  row: number,
  startColumn: number,
  str: string,
  onAdjacentFound: (
    currentNumber: string,
    sym: string,
    row: number,
    column: number
  ) => void
): void {
  // console.log(' @ Adjacent \n')

  // UP
  if (row - 1 > 0) {
    for (
      let col = Math.max(0, startColumn - 1);
      col <= Math.min(startColumn + str.length, data[row - 1].length - 1);
      col++
    ) {
      const sym = data[row - 1][col]

      if (isAdjacentSym(sym)) {
        onAdjacentFound(str, sym, row - 1, col)
        return
      }
    }
  }

  // console.log('AFTER UP >>>>>> ', hasAdjacent)

  // DOWN
  if (row + 1 <= data.length - 1) {
    for (
      let col = Math.max(0, startColumn - 1);
      col <= Math.min(startColumn + str.length, data[row + 1].length - 1);
      col++
    ) {
      const sym = data[row + 1][col]

      if (isAdjacentSym(sym)) {
        onAdjacentFound(str, sym, row + 1, col)
        return
      }
    }
  }
  // console.log('AFTER DOWN >>>>>> ', hasAdjacent)

  // LEFT
  const leftSym = data[row][startColumn - 1]
  if (leftSym !== undefined && isAdjacentSym(leftSym)) {
    onAdjacentFound(str, leftSym, row, startColumn - 1)

    return
  }

  // console.log('AFTER LEFT >>>>>> ', hasAdjacent)
  // RIGHT
  const rightSym = data[row][startColumn + str.length]

  if (rightSym !== undefined && isAdjacentSym(rightSym)) {
    onAdjacentFound(str, rightSym, row, startColumn + str.length)
  }
  // console.log('AFTER RIGHT >>>>>> ', hasAdjacent)

  // console.log('END \n', hasAdjacent)
}

function solution1(input: string[]): number {
  const data = parseInput(input)
  let res: number = 0

  const onAdjacentFound = (checkedNumber: string) => {
    res += parseInt(checkedNumber)
  }

  for (let row = 0; row <= data.length - 1; row++) {
    for (let column = 0; column <= data[row].length - 1; ) {
      const sym = data[row][column]

      if (/\d/.test(sym)) {
        let current: string = ''
        let pointer = column

        while (/\d/.test(data[row][pointer])) {
          current += data[row][pointer]
          pointer++
        }

        checkForAdjacent(data, row, column, current, onAdjacentFound)

        column = pointer

        continue
      }

      column++
    }
  }

  return res
}

function solution2(input: string[]): number {
  const data = parseInput(input)

  const adjacentGears = new Map<string, string[]>()

  const onAdjacentFound = (
    checkedNumber: string,
    sym: string,
    row: number,
    col: number
  ) => {
    if (sym !== '*') {
      return
    }

    const address = `${sym}-${row}-${col}`

    const existingGear = adjacentGears.get(address)

    if (!existingGear) {
      adjacentGears.set(address, [])
    }

    adjacentGears.get(address)!.push(checkedNumber)
  }

  for (let row = 0; row <= data.length - 1; row++) {
    for (let column = 0; column <= data[row].length - 1; ) {
      const sym = data[row][column]

      if (/\d/.test(sym)) {
        let current: string = ''
        let pointer = column

        while (/\d/.test(data[row][pointer])) {
          current += data[row][pointer]
          pointer++
        }

        checkForAdjacent(data, row, column, current, onAdjacentFound)

        column = pointer

        continue
      }

      column++
    }
  }

  return Array.from(adjacentGears.values()).reduce((sum, adjacentParams) => {
    if (adjacentParams.length < 2) {
      return sum
    }

    return sum + parseInt(adjacentParams[0]) * parseInt(adjacentParams[1])
  }, 0)
}

function main(): void {
  const data = loadDataFromFile(__dirname + '/input.txt')

  const res1 = solution1(data)

  // 527369
  console.log('========== Solution 1 ===========', res1)

  const res2 = solution2(data)

  console.log('========== Solution 2 ===========', res2)
}

main()
