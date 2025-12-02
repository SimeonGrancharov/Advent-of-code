import { loadDataFromFile } from '../utility'

type Data = [string, string][]

function prepareData(raw: string): Data {
  return raw.split(',').map((x) => [x.split('-')[0], x.split('-')[1]])
}
const isEven = (s: string): boolean => {
  return s.length % 2 === 0
}

function checkIsValid(str: string): boolean {
  if (!isEven(str)) {
    return true
  }

  return str.slice(0, str.length / 2) !== str.slice(str.length / 2, str.length)
}

function checkHasValidSequence(str: string): boolean {
  if (str.length === 1) {
    return true
  }

  const len = Math.ceil(str.length / 2)

  if (str.split('').every((sym) => sym === str[0])) {
    return false
  }

  let sequence = ''

  for (let l = 2; l <= len; l += 1) {
    let isInvalid = true
    sequence = str.slice(0, l)

    const iterations = Math.ceil(str.length / l)

    for (let itt = 1; itt <= iterations; itt++) {
      const currentSequence = str.slice((itt - 1) * l, itt * l)

      if (currentSequence !== sequence) {
        isInvalid = false
        break
      }
    }

    if (isInvalid) {
      return false
    }
  }

  return true
}

function solve(d: Data, check: (str: string) => boolean) {
  const checked: Record<string, boolean> = {}
  let counter = 0

  d.forEach((line) => {
    const [start, end] = line

    for (let c = parseInt(start); c <= parseInt(end); c++) {
      const str = c.toString()

      if (checked[str] === undefined) {
        checked[c.toString()] = check(c.toString())
      }

      counter += checked[c.toString()] ? 0 : c
    }
  })

  return counter
}

function main() {
  const [raw] = loadDataFromFile(__dirname + '/data.txt')

  const data = prepareData(raw)

  console.log('============== Part 1 ================')
  console.log(solve(data, checkIsValid))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(solve(data, checkHasValidSequence))
}

main()
