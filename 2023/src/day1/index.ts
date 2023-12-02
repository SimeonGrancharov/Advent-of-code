import { loadDataFromFile } from '../utilities'

const strToNum: Record<string, number> = {
  on: 1,
  tw: 2,
  thre: 3,
  four: 4,
  fiv: 5,
  six: 6,
  seve: 7,
  eigh: 8,
  nin: 9,
}

function filteroutNumbers(
  data: string[],
  regexp: RegExp,
  map?: Record<string, number>
): number[] {
  return data.map((row) => {
    const _matches = row.matchAll(regexp)
    const matches = Array.from(_matches).map((m) => m[0])

    if (!matches) {
      return 0
    }

    const first = matches[0]

    const second = matches[matches.length - 1]

    const string = `${first?.length > 1 ? map?.[first] ?? first : first ?? ''}${
      second?.length > 1 ? map?.[second] ?? second ?? '' : second ?? ''
    }`

    const res = parseInt(string.padEnd(2, string.charAt(0) ?? ''))

    return res
  })
}

function solution1(data: string[]): number {
  const nums = filteroutNumbers(data, /\d/g)

  return nums.reduce((x, y) => x + y, 0)
}

function solution2(data: string[]): number {
  const regexp =
    /\d|on(?=e)|tw(?=o)|thre(?=e)|four|fiv(?=e)|six|seve(?=n)|eigh(?=t)|nin(?=e)/g
  const nums = filteroutNumbers(data, regexp, strToNum)

  return nums.reduce((x, y) => x + y, 0)
}

function main(): void {
  const data = loadDataFromFile(__dirname + '/input.txt')

  // const res1 = solution1(data);
  //
  // console.log("========== Solution 1 ===========", res1);

  const res2 = solution2(data)

  console.log('========== Solution 2 ===========', res2)
}

main()
