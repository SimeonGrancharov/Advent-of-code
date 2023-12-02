import { loadDataFromFile, recordKeys } from '../utilities'

type ColorT = 'red' | 'green' | 'blue'

type SetT = Record<ColorT, number>

type DrawsT = [SetT, SetT, SetT][]

function parseInput(data: string[]): DrawsT {
  return data.map((draw) => {
    const sets = draw.split(/Game \d+: /)[1].split(';')

    return sets.map((set) => {
      return set
        .trim()
        .split(',')
        .reduce((s, cubes) => {
          const [drawn, fromColor] = cubes.trim().split(' ')

          return { ...s, [fromColor as ColorT]: parseInt(drawn) }
        }, {} as SetT)
    }) as [SetT, SetT, SetT]
  })
}

function solution1(data: string[]): number {
  const maxCubesByColor: Record<ColorT, number> = {
    red: 12,
    green: 13,
    blue: 14,
  }

  const draws = parseInput(data)

  return draws.reduce((sum, draw, idx) => {
    let isGamePossible: boolean = true

    for (const set of draw) {
      for (const color of recordKeys(set)) {
        if (set[color] > maxCubesByColor[color]) {
          isGamePossible = false
          break
        }
      }

      if (!isGamePossible) {
        break
      }
    }

    return (sum += isGamePossible ? idx + 1 : 0)
  }, 0)
}

function solution2(data: string[]): number {
  const draws = parseInput(data)

  return draws.reduce((sum, draw) => {
    const leastNeededCubesByColor: Record<ColorT, number> = {
      red: -Infinity,
      green: -Infinity,
      blue: -Infinity,
    }

    for (const set of draw) {
      for (const color of recordKeys(set)) {
        if (set[color] > leastNeededCubesByColor[color]) {
          leastNeededCubesByColor[color] = set[color]
        }
      }
    }

    return (sum += recordKeys(leastNeededCubesByColor).reduce(
      (s, x) => s * leastNeededCubesByColor[x],
      1
    ))
  }, 0)
}

function main(): void {
  const data = loadDataFromFile(__dirname + '/input.txt')

  const res1 = solution1(data)

  console.log('========== Solution 1 ===========', res1)

  const res2 = solution2(data)

  console.log('========== Solution 2 ===========', res2)
}

main()
