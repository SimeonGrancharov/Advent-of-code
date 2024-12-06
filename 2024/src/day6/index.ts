import { loadDataFromFile } from '../utility'

type DirectionT = 'up' | 'down' | 'left' | 'right'
type MapT = string[][]

function getStartPosition(map: MapT): [row: number, col: number] {
  return map.reduce(
    (coords, row, index) => {
      const guardPos = row.indexOf('^')

      if (guardPos > -1) {
        return [index, guardPos]
      }

      return coords
    },
    [0, 0]
  )
}

function move(
  map: MapT,
  row: number,
  col: number,
  direction: DirectionT
): [row: number, col: number] {
  if (direction === 'up') {
    const newPosition: [number, number] = [row - 1, col]
    const newPath = map[newPosition[0]]?.[newPosition[1]]

    // Obstacle is hit  couldn't move :/
    if (newPath === '#') {
      return [row, col]
    }

    return newPosition
  }

  if (direction === 'right') {
    const newPosition: [number, number] = [row, col + 1]
    const newPath = map[newPosition[0]]?.[newPosition[1]]
    // Obstacle is hit  couldn't move :/
    if (newPath === '#') {
      return [row, col]
    }

    return newPosition
  }

  if (direction === 'down') {
    const newPosition: [number, number] = [row + 1, col]
    const newPath = map[newPosition[0]]?.[newPosition[1]]

    // Obstacle is hit  couldn't move :/
    if (newPath === '#') {
      return [row, col]
    }

    return newPosition
  }
  if (direction === 'left') {
    const newPosition: [number, number] = [row, col - 1]
    const newPath = map[newPosition[0]]?.[newPosition[1]]

    // Obstacle is hit  couldn't move :/
    if (newPath === '#') {
      return [row, col]
    }

    return newPosition
  }

  return [row, col]
}

function part1(map: MapT): number {
  let steps = 1

  const currentPosition = [...getStartPosition(map)]
  let direction: DirectionT = 'up'
  // console.log(' starting on ', currentPosition)
  map[currentPosition[0]][currentPosition[1]] = 'X'

  let itt = 0
  while (
    currentPosition[0] >= 0 &&
    currentPosition[0] <= map.length - 1 &&
    currentPosition[1] >= 0 &&
    currentPosition[1] <= map[0].length - 1
  ) {
    itt++
    const newPosition = move(
      map,
      currentPosition[0],
      currentPosition[1],
      direction
    )
    // Then move is not possible, so change direction :/
    if (
      newPosition[0] === currentPosition[0] &&
      newPosition[1] === currentPosition[1]
    ) {
      switch (direction) {
        case 'up': {
          direction = 'right'
          break
        }
        case 'right': {
          direction = 'down'
          break
        }
        case 'down': {
          direction = 'left'
          break
        }
        case 'left': {
          direction = 'up'
          break
        }
      }

      continue
    }

    currentPosition[0] = newPosition[0]
    currentPosition[1] = newPosition[1]

    if (['.', '^'].includes(map[currentPosition[0]]?.[currentPosition[1]])) {
      map[currentPosition[0]][currentPosition[1]] = 'X'

      steps++
    }
  }
  //
  console.log(map.map((x) => x.join('')).join('\n'))

  return steps
}

function getSymbolForDirection() {}

function part2(data: MapT): number {
  let steps = 0

  return steps
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
