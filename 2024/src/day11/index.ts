import { loadDataFromFile } from '../utility'

const hasEvenLength = (n: number) => n.toString().length % 2 === 0
type Data1T = Record<number, number>

function blinkStones(d: Data1T): Data1T {
  const res: Data1T = {}

  for (const data of Object.entries(d)) {
    const v = parseInt(data[0] as string)
    const multiplicator = data[1] as number

    if (v === 0) {
      res[1] = (res[1] ?? 0) + multiplicator
      continue
    }

    if (hasEvenLength(v)) {
      const stringified = v.toString()
      const numberLength = stringified.length

      const left = stringified.slice(0, numberLength / 2)
      const right = stringified.slice(numberLength / 2)

      res[parseInt(left)] = (res[parseInt(left)] ?? 0) + multiplicator
      res[parseInt(right)] = (res[parseInt(right)] ?? 0) + multiplicator
      continue
    }

    res[v * 2024] = (res[v * 2024] ?? 0) + multiplicator
  }

  return res
}

function solution(input: number[], blinks: number) {
  let r: Data1T = input.reduce((a, x) => {
    if (!a[x]) {
      a[x] = 0
    }

    a[x] += 1
    return a
  }, {} as Data1T)

  for (let blink = 1; blink <= blinks; blink++) {
    r = blinkStones(r)
  }

  return Object.values(r).reduce((s, v) => s + v, 0)
}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt').map((x) =>
    x.split(' ').map((y) => parseInt(y))
  )[0]

  console.log('============== Part 1 ================')
  console.log(solution(data, 25))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(solution(data, 75))
}

main()
