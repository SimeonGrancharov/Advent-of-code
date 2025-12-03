import { loadDataFromFile } from '../utility'

type Data = string[]

function getLargestDigit(input: string, index: number): [number, number] {
  let largest = -Infinity
  let indexOfLargest = 0

  for (let ind = index; ind <= input.length - 1; ind++) {
    const asNum = parseInt(input[ind])

    if (asNum > largest) {
      largest = asNum
      indexOfLargest = ind
    }
  }

  return [largest, indexOfLargest]
}

function getLargestBattery(line: string) {
  let [firstDigit, index] = getLargestDigit(line, 0)
  let secondDigit = -Infinity

  if (index === line.length - 1) {
    secondDigit = firstDigit
    ;[firstDigit] = getLargestDigit(line.split('').reverse().join(''), 1)
  } else {
    ;[secondDigit] = getLargestDigit(line, index + 1)
  }

  return `${firstDigit}${secondDigit}`
}

function part1(d: Data): number {
  let result: number = 0

  d.forEach((line) => {
    const battery = getLargestBattery(line)

    console.log(' >> ', battery)
    result += parseInt(battery)
  })

  return result
}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt')

  console.log('============== Part 1 ================')
  console.log(part1(data))
  console.log('\n\n')
  // console.log('============== Part 2 ================')
  // console.log(solve(data, checkHasValidSequence))
}

main()
