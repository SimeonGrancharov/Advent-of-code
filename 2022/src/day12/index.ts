import { loadDataFromFile } from '../utilities'

type BlockT = {
  row: number
  column: number
  char: string
  elevation: number
  distance: number | null
  isStartBlock: boolean
  isEndBlock: boolean
}

type MapT = BlockT[][]

function parseHeightMap(input: string[]): MapT {
  return input.map((rowData, row) =>
    rowData.split('').map((char, column) => ({
      row,
      char,
      column,
      elevation: char === 'S' ? 0 : char === 'E' ? 25 : char.charCodeAt(0) - 97,
      isStartBlock: char === 'S',
      isEndBlock: char === 'E',
      distance: null,
    }))
  )
}

function canMoveTo(current: BlockT, target: BlockT): boolean {
  return target.elevation <= current.elevation + 1
}

function getBlockAtLocation(
  { row, col }: { row: number; col: number },
  map: MapT
): BlockT | undefined {
  return map[row]?.[col]
}

function lookAround(block: BlockT, map: MapT): BlockT[] {
  const neighbours: (BlockT | undefined)[] = [
    // left
    getBlockAtLocation({ row: block.row - 1, col: block.column }, map),
    // right
    getBlockAtLocation({ row: block.row + 1, col: block.column }, map),
    // up
    getBlockAtLocation({ row: block.row, col: block.column - 1 }, map),
    // down
    getBlockAtLocation({ row: block.row, col: block.column + 1 }, map),
  ]

  return neighbours.filter((neighbour) => {
    return neighbour !== undefined && canMoveTo(block, neighbour)
  }) as BlockT[]
}

function visitBlock(
  block: BlockT,
  pathToBlock: BlockT[],
  result: BlockT[][],
  map: MapT,
  distanceFromStart: number
) {
  if (block.isEndBlock) {
    result.push([...pathToBlock])

    return
  }

  if (block.distance !== null && block.distance <= distanceFromStart) {
    return
  }

  block.distance = distanceFromStart

  const neighboursToVisit: BlockT[] = lookAround(block, map)

  for (const neighbour of neighboursToVisit) {
    if (neighbour.distance !== null && neighbour.distance <= block.distance) {
      continue
    }

    visitBlock(
      neighbour,
      [...pathToBlock, block],
      result,
      map,
      distanceFromStart + 1
    )
  }
}

function cleanUp(map: MapT): void {
  map.forEach((row) =>
    row.map((block) => {
      block.distance = null
    })
  )
}

function solution1(map: MapT) {
  let startingBlock: BlockT | undefined

  map.forEach((x) =>
    x.forEach((block) => {
      if (block.isStartBlock) {
        startingBlock = block
      }
    })
  )

  if (!startingBlock) {
    return
  }

  const result: BlockT[][] = []
  const path: BlockT[] = []

  visitBlock(startingBlock, path, result, map, 0)

  return result
    .sort((a, b) => a.length - b.length)[0]
    .map((k) => k.char)
    .join('').length
}

function solution2(map: MapT) {
  cleanUp(map)

  const allStartingLocations: BlockT[] = []

  map.forEach((row) => {
    row.forEach((block) => {
      if (block.char === 'a' || block.char === 'S') {
        allStartingLocations.push(block)
      }
    })
  })

  const result: BlockT[][] = []
  const path: BlockT[] = []

  for (const startingBlock of allStartingLocations) {
    visitBlock(startingBlock, path, result, map, 0)

    cleanUp(map)
  }

  return result
    .sort((a, b) => a.length - b.length)[0]
    .map((k) => k.char)
    .join('').length
}

function main(): void {
  const data = loadDataFromFile(__dirname + '/input.txt')
  const heightMap = parseHeightMap(data)

  const res = solution1(heightMap)

  // 339
  console.log('================ Solution 1 ============== ', res)

  // 332
  const res2 = solution2(heightMap)
  // 55930
  console.log('================ Solution 2 ============== ', res2)
}

main()
