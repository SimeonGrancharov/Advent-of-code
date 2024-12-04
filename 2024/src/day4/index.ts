import { loadDataFromFile } from '../utility'

type DataT = string[][]

function searchInDirectionForWord(
  data: DataT,
  row: number,
  col: number,
  direction: 'n' | 's' | 'e' | 'w' | 'nw' | 'ne' | 'se' | 'sw',
  searchWord: string = 'XMAS'
):
  | { startRow: number; endRow: number; startCol: number; endCol: number }
  | undefined {
  const searchSymbolsCount = searchWord.length - 1

  if (direction === 'n') {
    let res = ''
    for (
      let searchRow = row;
      searchRow >= Math.max(0, row - searchSymbolsCount);
      searchRow--
    ) {
      res += data[searchRow][col]
    }

    if (res === searchWord) {
      return {
        startRow: row,
        endRow: row - 3,
        startCol: col,
        endCol: col,
      }
    }
  }

  if (direction === 's') {
    let res = ''
    for (
      let searchRow = row;
      searchRow <= Math.min(data.length - 1, row + searchSymbolsCount);
      searchRow++
    ) {
      res += data[searchRow][col]
    }

    if (res === searchWord) {
      return {
        startRow: row,
        endRow: row + 3,
        startCol: col,
        endCol: col,
      }
    }
  }

  if (direction === 'e') {
    let res = ''
    for (
      let searchCol = col;
      searchCol <= Math.min(data[0].length - 1, col + searchSymbolsCount);
      searchCol++
    ) {
      res += data[row][searchCol]
    }

    if (res === 'XMAS') {
      return {
        startRow: row,
        endRow: row,
        startCol: col,
        endCol: col + 3,
      }
    }
  }

  if (direction === 'w') {
    let res = ''
    for (
      let searchCol = col;
      searchCol >= Math.max(0, col - searchSymbolsCount);
      searchCol--
    ) {
      res += data[row][searchCol]
    }

    if (res === searchWord) {
      return {
        startRow: row,
        endRow: row,
        startCol: col,
        endCol: col - 3,
      }
    }
  }

  if (direction === 'nw') {
    let res = ''
    for (let i = 1; i <= searchWord.length; i++) {
      res += data[row - (i - 1)]?.[col - (i - 1)] ?? ''
    }

    if (res === searchWord) {
      return {
        startRow: row,
        endRow: row - 3,
        startCol: col,
        endCol: col - 3,
      }
    }
  }

  if (direction === 'ne') {
    let res = ''
    for (let i = 1; i <= searchWord.length; i++) {
      res += data[row - (i - 1)]?.[col + (i - 1)] ?? ''
    }

    if (res === searchWord) {
      return {
        startRow: row,
        endRow: row - 3,
        startCol: col,
        endCol: col + 3,
      }
    }
  }

  if (direction === 'se') {
    let res = ''
    for (let i = 1; i <= searchWord.length; i++) {
      res += data[row + (i - 1)]?.[col + (i - 1)] ?? ''
    }

    if (res === searchWord) {
      return {
        startRow: row,
        endRow: row + 3,
        startCol: col,
        endCol: col + 3,
      }
    }
  }

  if (direction === 'sw') {
    let res = ''
    for (let i = 1; i <= searchWord.length; i++) {
      res += data[row + (i - 1)]?.[col - (i - 1)] ?? ''
    }

    if (res === searchWord) {
      return {
        startRow: row,
        endRow: row + 3,
        startCol: col,
        endCol: col - 3,
      }
    }
  }
}

function print(
  board: string[][],
  res: { startRow: number; endRow: number; startCol: number; endCol: number },
  word: string
) {
  for (let char = 0; char <= word.length - 1; char++) {
    // EQUATOR
    if (res.startRow === res.endRow) {
      // East
      if (res.startCol < res.endCol) {
        board[res.startRow][res.startCol + char] = word[char]
        // West
      } else {
        board[res.startRow][res.startCol - char] = word[char]
      }

      continue
    }

    if (res.startRow < res.endRow) {
      // south
      if (res.startCol === res.endCol) {
        board[res.startRow + char][res.startCol] = word[char]
        continue
      }

      // South east
      if (res.startCol < res.endCol) {
        board[res.startRow + char][res.startCol + char] = word[char]
        continue
      }

      // South west
      board[res.startRow + char][res.startCol - char] = word[char]
      continue
    }

    // North
    if (res.startCol === res.endCol) {
      board[res.startRow - char][res.endCol] = word[char]
      continue
    }

    // North east
    if (res.startCol < res.endCol) {
      board[res.startRow - char][res.startCol + char] = word[char]
      continue
    }

    // North west
    board[res.startRow - char][res.startCol - char] = word[char]
  }
}

function part1(data: DataT) {
  const board = new Array(data.length)

  for (let i = 0; i <= board.length - 1; i++) {
    board[i] = new Array(data[0].length).fill('.')
  }

  let foundWordsCount = 0

  const directions = ['n', 's', 'e', 'w', 'nw', 'ne', 'se', 'sw'] as const

  for (let row = 0; row <= data.length - 1; row++) {
    for (let col = 0; col <= data[row].length - 1; col++) {
      if (data[row][col] === 'X') {
        directions.forEach((direction) => {
          const res = searchInDirectionForWord(
            data,
            row,
            col,
            direction,
            'XMAS'
          )

          if (res !== undefined) {
            foundWordsCount++
          }
        })
      }
    }
  }

  return foundWordsCount
}

function part2(data: DataT) {
  const board = new Array(data.length)

  for (let i = 0; i <= board.length - 1; i++) {
    board[i] = new Array(data[0].length).fill('.')
  }

  let foundWordsCount = 0

  for (let row = 0; row <= data.length - 1; row++) {
    for (let col = 0; col <= data[row].length - 1; col++) {
      if (data[row][col] === 'A') {
        const northWestS = searchInDirectionForWord(data, row, col, 'nw', 'AS')
        const northWestM = searchInDirectionForWord(data, row, col, 'nw', 'AM')

        const northEastS = searchInDirectionForWord(data, row, col, 'ne', 'AS')
        const northEastM = searchInDirectionForWord(data, row, col, 'ne', 'AM')

        const southEastS = searchInDirectionForWord(data, row, col, 'se', 'AS')
        const southEastM = searchInDirectionForWord(data, row, col, 'se', 'AM')

        const southWestS = searchInDirectionForWord(data, row, col, 'sw', 'AS')
        const southWestM = searchInDirectionForWord(data, row, col, 'sw', 'AM')

        const northWestSouthEastDiag =
          (northWestS && southEastM) || (northWestM && southEastS)
        const northEastSouthWestDiag =
          (northEastS && southWestM) || (northEastM && southWestS)

        if (northEastSouthWestDiag && northWestSouthEastDiag) {
          foundWordsCount++
        }
      }
    }
  }

  return foundWordsCount
}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt')

  // 2685
  console.log('============== Part 1 ================')
  console.log(part1(data.map((x) => x.split(''))))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(part2(data.map((x) => x.split(''))))
}

main()
