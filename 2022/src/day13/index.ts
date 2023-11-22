import { loadDataFromFile } from '../utilities'

type ItemT = number | ItemT[]

type DataT = [ItemT[], ItemT[]][]

// Could be done with JSON.parse :|
function parseInput(input: string[]): DataT {
  const result: DataT = []

  for (let row = 0; row <= input.length - 1; row += 2) {
    const pair: [ItemT[], ItemT[]] = [[], []]

    result.push(pair)

    // Skip first and last char as they are always [ for first and ] for last
    for (let pairCount = 1; pairCount <= 2; pairCount++) {
      const queue: ItemT[] = []
      const workRow = input[row + pairCount - 1]
      const workPair = pair[pairCount - 1]

      queue.push(workPair)

      for (let charIdx = 1; charIdx <= workRow.length - 2; ) {
        if (workRow[charIdx] === '[') {
          const newArray: ItemT = []

          const lastOfQueue = queue[queue.length - 1]

          if (lastOfQueue && Array.isArray(lastOfQueue)) {
            lastOfQueue.push(newArray)
          }

          queue.push(newArray)
        } else if (workRow[charIdx] === ']') {
          queue.pop()
        } else if (parseInt(workRow[charIdx]) >= 0) {
          let numIdx = charIdx + 1
          let result: string = workRow[charIdx]

          while (parseInt(workRow[numIdx]) >= 0) {
            result += workRow[numIdx]

            numIdx++
          }

          const lastOfQueue = queue[queue.length - 1]

          if (Array.isArray(lastOfQueue)) {
            lastOfQueue?.push(parseInt(result))
          }

          charIdx = numIdx
          continue
        }

        charIdx++
      }
    }
  }

  return result
}

function compare(pair: [ItemT, ItemT]): 'correct' | 'wrong' | 'unknown' {
  const a = pair[0]
  const b = pair[1]

  if (typeof a === 'number' && typeof b === 'number') {
    return a === b ? 'unknown' : a < b ? 'correct' : 'wrong'
  }

  const leftValue = (typeof a !== 'number' ? a : [a]) as ItemT[]
  const rightValue = (typeof b !== 'number' ? b : [b]) as ItemT[]

  for (
    let index = 0;
    index < Math.max(leftValue.length, rightValue.length);
    index++
  ) {
    const first = leftValue[index]
    const second = rightValue[index]

    if (first !== undefined && second === undefined) {
      return 'wrong'
    }

    if (first === undefined && second !== undefined) {
      return 'correct'
    }

    const comparison = compare([first, second])

    if (comparison !== 'unknown') {
      return comparison
    }
  }

  return 'unknown'
}

function solution1(data: DataT): number {
  const correctOrderedIndexes: number[] = []

  for (let index = 0; index <= data.length - 1; index++) {
    const isCorrectlyOrdered = compare(data[index])

    if (isCorrectlyOrdered !== 'wrong') {
      correctOrderedIndexes.push(index + 1)
    }
  }

  return correctOrderedIndexes.reduce((a, b) => a + b, 0)
}

function solution2(data: DataT): number {
  const flattened: ItemT[] = []

  data.forEach((tuple) => {
    flattened.push(...tuple)
  })

  const firstPacket = [[2]]
  const secondPacket = [[6]]

  flattened.push(firstPacket)
  flattened.push(secondPacket)

  const sorted = flattened.sort((a, b) => {
    const comparison = compare([a, b])

    return comparison === 'correct' ? -1 : comparison === 'unknown' ? 0 : 1
  })

  const indexOfFirstPacket = sorted.findIndex(
    (packet) => packet === firstPacket
  )
  const indexOfSecondPacket = sorted.findIndex(
    (packet) => packet === secondPacket
  )

  return (indexOfSecondPacket + 1) * (indexOfFirstPacket + 1)
}

function main(): void {
  const data = loadDataFromFile(__dirname + '/input.txt')
  const input = parseInput(data)

  const res = solution1(input)

  // 5684
  console.log('================ Solution 1 ============== ', res)

  // 22932
  const res2 = solution2(input)

  console.log('================ Solution 2 ============== ', res2)
}

main()
