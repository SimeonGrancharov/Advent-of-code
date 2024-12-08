import { loadDataFromFile } from '../utility'

type DataT = string[][]

function traverse(
  d: string[][],
  onElement: (element: string, row: number, col: number) => void
) {
  d.forEach((row, rI) => row.forEach((col, cI) => onElement(col, rI, cI)))
}

function print(input: string[][], antinodeCoords: Set<string>) {
  const printRes = [...input.map((x) => [...x])]

  antinodeCoords.forEach((key) => {
    const [r, c] = key.split('-').map((x) => parseInt(x))

    if (printRes[r][c] === '.') {
      printRes[r][c] = '#'
    }
  })

  console.log(printRes.map((x) => x.join('')).join('\n'))
}

function part1(input: DataT) {
  const antinodeCoords: Set<string> = new Set()

  traverse(input, (el, rowIndex, colIndex) => {
    if (el === '.') {
      return
    }

    traverse(input, (nestedEl, nestedRowIndex, nestedColIndex) => {
      if (el !== nestedEl) {
        return
      }

      if (nestedRowIndex === rowIndex && nestedColIndex === colIndex) {
        return
      }

      const dR = nestedRowIndex - rowIndex
      const dC = nestedColIndex - colIndex

      const antinodeRow = nestedRowIndex + dR
      const antinodeCol = nestedColIndex + dC

      // Then the antinode is out of bounds
      if (
        antinodeRow < 0 ||
        antinodeRow >= input.length ||
        antinodeCol < 0 ||
        antinodeCol >= input[rowIndex].length
      ) {
        return
      }

      antinodeCoords.add(`${antinodeRow}-${antinodeCol}`)

      // console.log(
      //   ' for element at ',
      //   rowIndex,
      //   colIndex,
      //   nestedRowIndex,
      //   nestedColIndex,
      //   dR,
      //   dC,
      //   antinodeRow,
      //   antinodeCol
      // )
      // print(input, antinodeCoords)
    })

    // console.log(
    //   ' For element on ',
    //   rowIndex,
    //   colIndex,
    //   ' antennas are ',
    //   antennas
    // )
  })

  return antinodeCoords.size
}

function part2(input: DataT) {}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt').map((x) => x.split(''))

  console.log('============== Part 1 ================')
  console.log(part1(data))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(part2(data))
}

main()
