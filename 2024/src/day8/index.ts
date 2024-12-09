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

      const antinode = getNewAntinode(
        input,
        nestedRowIndex,
        nestedColIndex,
        dR,
        dC
      )

      if (!antinode) {
        return
      }

      antinodeCoords.add(`${antinode[0]}-${antinode[1]}`)
    })
  })

  return antinodeCoords.size
}

function getNewAntinode(
  input: string[][],
  cR: number,
  cC: number,
  dR: number,
  dC: number
): [number, number] | undefined {
  const antinodeRow = cR + dR
  const antinodeCol = cC + dC

  // Then the antinode is out of bounds
  if (
    antinodeRow < 0 ||
    antinodeRow >= input.length ||
    antinodeCol < 0 ||
    antinodeCol >= input[cR].length
  ) {
    return
  }

  return [antinodeRow, antinodeCol]
}

function part2(input: DataT) {
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

      // If line is found then we immediately add the two antennas as antinodes
      antinodeCoords.add(`${rowIndex}-${colIndex}`)
      antinodeCoords.add(`${nestedRowIndex}-${nestedColIndex}`)

      const dR = nestedRowIndex - rowIndex
      const dC = nestedColIndex - colIndex

      let sourceRow = nestedRowIndex
      let sourceCol = nestedColIndex

      while (true) {
        const antinode = getNewAntinode(input, sourceRow, sourceCol, dR, dC)

        if (!antinode) {
          break
        }

        sourceRow = antinode[0]
        sourceCol = antinode[1]

        antinodeCoords.add(`${antinode[0]}-${antinode[1]}`)
      }
    })
  })

  print(input, antinodeCoords)

  return antinodeCoords.size
}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt').map((x) => x.split(''))

  console.log('============== Part 1 ================')
  console.log(part1(data))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(part2(data))
}

main()
