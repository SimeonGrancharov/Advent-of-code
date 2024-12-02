import { loadDataFromFile } from '../utility'

type DataT = number[][]

type DirectionT = 'dec' | 'inc'

function prepareData(input: string[]): DataT {
  return input.map((row) => row.split(' ').map((char) => parseInt(char)))
}

const MaxDiff = 3
const MinDiff = 1

function satisfies(diff: number) {
  return diff >= MinDiff && diff <= MaxDiff
}

function getIsSequenceValid(row: number[]): boolean {
  let savedDirection: 'dec' | 'inc' | undefined

  for (let index = 0; index <= row.length - 2; index++) {
    const diff = row[index] - row[index + 1]

    const direction: DirectionT = diff > 0 ? 'inc' : 'dec'

    if (!savedDirection) {
      savedDirection = direction
    }

    if (savedDirection !== direction || !satisfies(Math.abs(diff))) {
      return false
    }
  }

  return true
}

function retrySequence(row: number[]): boolean {
  for (let index = 0; index <= row.length - 1; index++) {
    const isValid = getIsSequenceValid([...row].filter((_, i) => i !== index))

    if (isValid) {
      return true
    }
  }

  return false
}

function part2(data: DataT): number {
  let result = 0

  for (const row of data) {
    const isValid = getIsSequenceValid(row) || retrySequence(row)

    result += isValid ? 1 : 0
  }

  return result
}

function part1(data: DataT): number {
  let result = data.length

  for (const row of data) {
    const isValid = getIsSequenceValid(row)

    result += isValid ? 1 : 0
  }

  return result
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
