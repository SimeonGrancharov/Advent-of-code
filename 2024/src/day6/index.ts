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
    if (newPath === '#' || newPath === 'O') {
      return [row, col]
    }

    return newPosition
  }

  if (direction === 'right') {
    const newPosition: [number, number] = [row, col + 1]
    const newPath = map[newPosition[0]]?.[newPosition[1]]
    // Obstacle is hit  couldn't move :/
    if (newPath === '#' || newPath === 'O') {
      return [row, col]
    }

    return newPosition
  }

  if (direction === 'down') {
    const newPosition: [number, number] = [row + 1, col]
    const newPath = map[newPosition[0]]?.[newPosition[1]]

    // Obstacle is hit  couldn't move :/
    if (newPath === '#' || newPath === 'O') {
      return [row, col]
    }

    return newPosition
  }
  if (direction === 'left') {
    const newPosition: [number, number] = [row, col - 1]
    const newPath = map[newPosition[0]]?.[newPosition[1]]

    // Obstacle is hit  couldn't move :/
    if (newPath === '#' || newPath === 'O') {
      return [row, col]
    }

    return newPosition
  }

  return [row, col]
}

function findPath(
  map: MapT,
  onStep: (coord: [number, number], direction: DirectionT) => boolean | void
) {
  const currentPosition: [number, number] = [...getStartPosition(map)]
  let direction: DirectionT = 'up'

  onStep(currentPosition, direction)
  while (
    currentPosition[0] >= 0 &&
    currentPosition[0] <= map.length - 1 &&
    currentPosition[1] >= 0 &&
    currentPosition[1] <= map[0].length - 1
  ) {
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

    const shouldBreak = onStep(currentPosition, direction)

    if (shouldBreak) {
      break
    }
  }
}

function part1(map: MapT): number {
  const uniqueSteps = new Set<string>()

  findPath(map, (coords) => {
    uniqueSteps.add(`${coords[0]}-${coords[1]}`)
  })

  return uniqueSteps.size - 1
}

function part2(workData: MapT): number {
  const path: Record<`${number}-${number}`, [number, number]> = {}

  findPath(
    workData.map((x) => [...x]),
    (coords) => {
      if (
        coords[0] >= 0 &&
        coords[0] < workData.length &&
        coords[1] >= 0 &&
        coords[1] < workData[0].length
      ) {
        path[`${coords[0]}-${coords[1]}`] = [coords[0], coords[1]]
      }
    }
  )

  let infiniteLoopsCount: number = 0

  for (const point of Object.values(path)) {
    const map = workData.map((x) => [...x])

    map[point[0]][point[1]] = '#'

    const visitedPoints: Record<`${number}-${number}-${DirectionT}`, true> = {}

    findPath(map, (coords, direction) => {
      if (visitedPoints[`${coords[0]}-${coords[1]}-${direction}`]) {
        infiniteLoopsCount++
        return true
      } else {
        visitedPoints[`${coords[0]}-${coords[1]}-${direction}`] = true
      }
    })
  }

  return infiniteLoopsCount
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
