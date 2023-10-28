import { loadDataFromFile } from '../utilities'

type GridT = number[][]

function checkHorizontally(
  grid: GridT,
  row: number,
  column: number,
  direction: 'left' | 'right',
  predicate: (blockingTree: number, targetTree: number) => boolean
): void {
  const rowData = grid[row]

  for (
    let colNumber = direction === 'left' ? column - 1 : column + 1;
    direction === 'left' ? colNumber >= 0 : colNumber <= rowData.length - 1;
    direction === 'left' ? colNumber-- : colNumber++
  ) {
    if (!predicate(rowData[colNumber], rowData[column])) {
      return
    }
  }
}

function checkVertically(
  grid: GridT,
  row: number,
  column: number,
  direction: 'up' | 'down',
  predicate: (blockingTree: number, targetTree: number) => boolean
): void {
  for (
    let rowNumber = direction === 'up' ? row - 1 : row + 1;
    direction === 'up' ? rowNumber >= 0 : rowNumber <= grid.length - 1;
    direction === 'up' ? rowNumber-- : rowNumber++
  ) {
    if (!predicate(grid[rowNumber][column], grid[row][column])) {
      return
    }
  }
}

function checkByDirection(
  grid: GridT,
  row: number,
  column: number,
  direction: 'left' | 'right' | 'up' | 'down',
  predicate: (blockingTree: number, targetTree: number) => boolean
): void {
  switch (direction) {
    case 'left':
    case 'right': {
      checkHorizontally(grid, row, column, direction, predicate)

      break
    }

    case 'up':
    case 'down': {
      checkVertically(grid, row, column, direction, predicate)
      break
    }
  }
}

function solution1(data: number[][]): number {
  // Just the perimeter of the grid, cuz all outer trees are visible
  let visibleTrees: number = 2 * data.length + 2 * data[0].length - 4 // four angles, don't count them twice

  for (let row = 1; row <= data.length - 2; row++) {
    for (let column = 1; column <= data[row].length - 2; column++) {
      let isVisible = false

      const checkForVisiblity = (
        blockingTree: number,
        targetTree: number
      ): boolean => {
        isVisible = blockingTree < targetTree

        return isVisible
      }

      for (const direction of ['left', 'right', 'up', 'down'] as const) {
        if (!isVisible) {
          checkByDirection(data, row, column, direction, checkForVisiblity)
        }
      }

      visibleTrees += isVisible ? 1 : 0
    }
  }

  return visibleTrees
}

function solution2(data: number[][]): number {
  let maxRank: number = 0
  const directions = ['left', 'right', 'up', 'down'] as const

  for (let row = 1; row <= data.length - 2; row++) {
    for (let column = 1; column <= data[row].length - 2; column++) {
      let accumulatedRank: number = 1
      let currentRank: number = 0

      const countRank = (blockingTree: number, targetTree: number): boolean => {
        currentRank += 1

        return blockingTree < targetTree
      }

      for (const direction of directions) {
        checkByDirection(data, row, column, direction, countRank)
        accumulatedRank *= currentRank
        currentRank = 0
      }

      maxRank = Math.max(maxRank, accumulatedRank)
    }
  }

  return maxRank
}

function main(): void {
  const rawData: string[][] = loadDataFromFile(__dirname + '/input.txt').map(
    (row) => row.split('')
  )

  const data = rawData.map((row) => row.map((x) => parseInt(x)))

  const result = solution1(data)
  console.log('============= Solution 1 ============= ', result)

  const result2 = solution2(data)
  console.log('============= Solution 2 ============= ', result2)
}

main()
