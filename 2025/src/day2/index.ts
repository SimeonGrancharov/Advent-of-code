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

function part1(d: Data) {
  const checked: Record<string, boolean> = {}
  let counter = 0

  d.forEach((line) => {
    const [start, end] = line

    for (let c = parseInt(start); c <= parseInt(end); c++) {
      const str = c.toString()

      if (checked[str] === undefined) {
        checked[c.toString()] = checkIsValid(c.toString())
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
  console.log(part1(data))
  console.log('\n\n')
  // console.log('============== Part 2 ================')
  // console.log(part2(data))
}

main()
