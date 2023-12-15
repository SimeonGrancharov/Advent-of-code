import { match } from 'assert'
import { loadDataFromFile } from '../utilities'

function parseInput(input: string[]): { winning: number[]; owned: number[] }[] {
  return input.map((row) => {
    const raw = row.replace(/Card\s+\d+:/, '').split('|')

    return {
      winning: raw[0]
        .split(' ')
        .filter(Boolean)
        .map((x) => parseInt(x)),
      owned: raw[1]
        .split(' ')
        .filter(Boolean)
        .map((x) => parseInt(x)),
    }
  })
}

function solution1(input: string[]): number {
  const cards = parseInput(input)

  let result: number = 0

  for (const { winning, owned } of cards) {
    let matches: number = 0

    for (const num of Array.from(new Set(owned).values())) {
      if (winning.includes(num)) {
        matches++
      }
    }

    if (matches > 0) {
      result += 2 ** (matches - 1)
    }
  }

  return result
}

function solution2(input: string[]): number {
  const cards = parseInput(input)

  const cardsByIdToMatches = cards.reduce<Record<number, number>>(
    (acc, _, idx) => ({ ...acc, [idx + 1]: 1 }),
    {}
  )

  let currentCard: number = 1

  for (const { winning, owned } of cards) {
    let matches: number = 0

    for (const num of Array.from(new Set(owned).values())) {
      if (winning.includes(num)) {
        matches++
      }
    }

    if (matches) {
      for (let match = 1; match <= matches; match++) {
        cardsByIdToMatches[currentCard + match] +=
          cardsByIdToMatches[currentCard]
      }
    }

    currentCard++
  }

  return Object.values(cardsByIdToMatches).reduce((sum, s) => sum + s, 0)
}

function main(): void {
  const data = loadDataFromFile(__dirname + '/input.txt')

  const res1 = solution1(data)

  // 21558
  console.log('========== Solution 1 ===========', res1)

  // 10425665
  const res2 = solution2(data)

  console.log('========== Solution 2 ===========', res2)
}

main()
