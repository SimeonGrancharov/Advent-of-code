import { prependListener } from 'process'
import { loadDataFromFile } from '../utility'

type DataT = [number[], number[]]

function prepareData(data: string[]): DataT {
  return data.reduce<DataT>(
    (tuple, row) => {
      const match = row.match(/(\d+)/g)

      const [left, right] = match ?? []

      tuple[0].push(left ? parseInt(left) : 0)
      tuple[1].push(right ? parseInt(right) : 0)

      return tuple
    },
    [[], []]
  )
}

function part1(data: DataT): number {
  const sorted = data.map((x) => [...x].sort((a, b) => (a > b ? 1 : -1)))

  const result: number[] = []

  for (let index = 0; index <= sorted[0].length - 1; index++) {
    const left = sorted[0][index]
    const right = sorted[1][index]

    result.push(Math.abs(right - left))
  }

  return result.reduce((a, b) => a + b, 0)
}

function part2(data: DataT): number {
  const result: Record<
    number,
    {
      left: number
      right: number
    }
  > = {}

  for (let index = 0; index <= data[0].length - 1; index++) {
    const value = data[0][index]

    if (!result[value]) {
      result[value] = { left: 0, right: 0 }
    }

    result[value].left++
  }

  for (let index = 0; index <= data[1].length - 1; index++) {
    const value = data[1][index]

    if (!result[value]) {
      continue
    }

    result[value].right++
  }

  return Object.entries(result).reduce(
    (sum, entry) => sum + entry[1].left * (parseInt(entry[0]) * entry[1].right),
    0
  )
}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt')

  const parsed = prepareData(data)

  console.log('============== Part 1 ================')
  console.log(part1(parsed))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(part2(parsed))
}

main()
