import { after, before } from 'node:test'
import { loadDataFromFile } from '../utility'

type DataT = {
  beforeLookup: Record<string, string[]>
  afterLookup: Record<string, string[]>

  updates: string[][]
}

function parseInput(input: string[]) {
  const result: DataT = {
    afterLookup: {},
    beforeLookup: {},

    updates: [],
  }

  const indexOfDelimiter = input.indexOf('')

  const instructions = input.slice(0, indexOfDelimiter)
  const updates = input.slice(indexOfDelimiter + 1)

  for (const instruction of instructions) {
    const [left, right] = instruction.split('|')

    if (!result.beforeLookup[left]) {
      result.beforeLookup[left] = []
    }

    result.beforeLookup[left].push(right)

    if (!result.afterLookup[right]) {
      result.afterLookup[right] = []
    }

    result.afterLookup[right].push(left)
  }

  for (const update of updates) {
    if (!update) {
      continue
    }

    result.updates.push(update.split(','))
  }

  return result
}

function extractInputs(input: DataT, extractValid: boolean = true): string[][] {
  const validInputs: string[][] = []

  for (const update of input.updates) {
    let isValid = true

    for (let index = 0; index <= update.length - 1; index++) {
      const seq = update[index]
      const beforeRule = input.beforeLookup[seq]

      if (beforeRule) {
        isValid = update.slice(index + 1).every((x) => beforeRule.includes(x))
      }

      if (isValid) {
        const afterRule = input.afterLookup[seq]

        if (afterRule) {
          isValid = update.slice(0, index).every((x) => afterRule.includes(x))
        }
      }

      if (!isValid) {
        break
      }
    }

    if (isValid) {
      validInputs.push(update)
    }
  }

  return input.updates.filter((update) =>
    extractValid ? validInputs.includes(update) : !validInputs.includes(update)
  )
}

function part1(input: string[]) {
  const parsed = parseInput(input)

  const validInputs = extractInputs(parsed)

  return validInputs.reduce((sum, update) => {
    const middle = parseInt(update[Math.floor(update.length / 2)])

    return sum + middle
  }, 0)
}

function part2(input: string[]) {
  const parsed = parseInput(input)

  const invalidInputs = extractInputs(parsed, false)

  const newInputs = [...invalidInputs.map((x) => [...x])]

  for (const input of newInputs) {
    input.sort((a, b) => {
      const beforeRule = parsed.beforeLookup[a]
      const afterRule = parsed.afterLookup[a]
      let sorting = 0

      if (afterRule?.includes(b)) {
        sorting = 1
      } else if (beforeRule?.includes(b)) {
        sorting = -1
      }

      return sorting
    })
  }

  return newInputs.reduce((sum, update) => {
    const middle = parseInt(update[Math.floor(update.length / 2)])

    return sum + middle
  }, 0)
}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt', () => true)

  console.log('============== Part 1 ================')
  console.log(part1(data))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(part2(data))
}

main()
