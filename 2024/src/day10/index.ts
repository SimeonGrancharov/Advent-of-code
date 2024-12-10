import { loadDataFromFile } from '../utility'

type DataT = number[][]

type DirectionT = 'up' | 'down' | 'left' | 'right'

function getDirectionsToMove(
  map: DataT,
  row: number,
  col: number,
  tileHeight: number
): DirectionT[] {
  const dir: DirectionT[] = []
  if ((map[row - 1]?.[col] ?? 0) - tileHeight === 1) {
    dir.push('up')
  }

  if ((map[row + 1]?.[col] ?? 0) - tileHeight === 1) {
    dir.push('down')
  }

  if ((map[row]?.[col + 1] ?? 0) - tileHeight === 1) {
    dir.push('right')
  }

  if ((map[row]?.[col - 1] ?? 0) - tileHeight === 1) {
    dir.push('left')
  }

  return dir
}

function move(
  map: DataT,
  row: number,
  col: number,
  height: number,
  onEndHeightFound: (row: number, col: number) => void
) {
  const availableDirections = getDirectionsToMove(map, row, col, height)

  if (availableDirections.length === 0 || height === 9) {
    if (height === 9) {
      onEndHeightFound(row, col)
    }

    return
  }

  for (const dir of availableDirections) {
    switch (dir) {
      case 'up': {
        move(map, row - 1, col, height + 1, onEndHeightFound)
        break
      }
      case 'down': {
        move(map, row + 1, col, height + 1, onEndHeightFound)
        break
      }
      case 'right': {
        move(map, row, col + 1, height + 1, onEndHeightFound)
        break
      }
      case 'left': {
        move(map, row, col - 1, height + 1, onEndHeightFound)
        break
      }
    }
  }
}

function part1(map: DataT) {
  let sum = 0
  for (let row = 0; row <= map.length - 1; row++) {
    for (let col = 0; col <= map.length - 1; col++) {
      // trailhead hit -> move
      if (map[row][col] === 0) {
        const trailEnds: Record<string, true> = {}

        move(map, row, col, 0, (endRow, endCol) => {
          const key = `${endRow}-${endCol}`

          if (!trailEnds[key]) {
            trailEnds[key] = true
          }
        })

        // console.log(' trail ends', trailEnds, ' score is ', trailEnds.length)
        sum += Object.keys(trailEnds).length
      }
    }
  }

  return sum
}

function part2(map: DataT): number {
  let sum = 0
  for (let row = 0; row <= map.length - 1; row++) {
    for (let col = 0; col <= map.length - 1; col++) {
      // trailhead hit -> move
      if (map[row][col] === 0) {
        move(map, row, col, 0, () => {
          sum++
        })
      }
    }
  }

  return sum
}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt').map((x) =>
    x.split('').map((y) => parseInt(y))
  )

  console.log('============== Part 1 ================')
  console.log(part1(data))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(part2(data))
}

main()
