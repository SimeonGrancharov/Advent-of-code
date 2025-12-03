import { loadDataFromFile } from '../utility'

type Data = string[]

function getLargestDigit(input: string, index: number): [number, number] {
  let largest = -Infinity
  let indexOfLargest = 0

  console.log(' searching in ', input, index)

  for (let ind = index; ind <= input.length - 1; ind++) {
    const asNum = parseInt(input[ind])

    if (asNum > largest) {
      largest = asNum
      indexOfLargest = ind
    }
  }

  return [largest, indexOfLargest]
}

function getLargestBattery(line: string, batterySize: number) {
  let result = ''
  let shouldSwitch = false
  let lastIndex = 0

  while (result.length < batterySize) {
    const [digit, digitIndex] = getLargestDigit(
      shouldSwitch ? line.split('').reverse().join('') : line,
      lastIndex
    )

    shouldSwitch = digitIndex === line.length - 1

    lastIndex = shouldSwitch ? line.length - digitIndex : digitIndex + 1

    result = shouldSwitch ? `${digit}${result}` : `${result}${digit}`
  }

  return result
}

function solve(d: Data, batterySize: number): number {
  let result: number = 0

  d.forEach((line) => {
    const battery = getLargestBattery(line, batterySize)

    console.log(' >> ', battery)
    result += parseInt(battery)
  })

  return result
}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt')

  console.log('============== Part 1 ================')
  console.log(solve(data, 2))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(solve(data, 12))
}

main()
