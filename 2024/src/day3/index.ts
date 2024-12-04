import { loadDataFromFile } from '../utility'

function parseOperators(input: string, canDisable?: boolean): number[][] {
  const result: number[][] = []

  let enabled: boolean = true
  let operator: { left: string; right: string } | undefined
  let currentMatch: string = ''

  for (const char of input.split('')) {
    if (!enabled) {
      if (!currentMatch && char === 'd') {
        currentMatch += char
      } else if (currentMatch === 'd' && char === 'o') {
        currentMatch += char
      } else if (currentMatch === 'do' && char === '(') {
        currentMatch += char
      } else if (currentMatch === 'do(' && char === ')') {
        currentMatch = ''
        enabled = true
      } else {
        currentMatch = ''
      }

      continue
    }

    if (!currentMatch && char === 'd') {
      currentMatch += char
    } else if (currentMatch === 'd' && char === 'o') {
      currentMatch += char
    } else if (currentMatch === 'do' && char === 'n') {
      currentMatch += char
    } else if (currentMatch === 'don' && char === "'") {
      currentMatch += char
    } else if (currentMatch === "don'" && char === 't') {
      currentMatch += char
    } else if (currentMatch === "don't" && char === '(') {
      currentMatch += char
    } else if (currentMatch === "don't(" && char === ')') {
      enabled = canDisable ? false : true
      currentMatch = ''
    } else if (!currentMatch && char === 'm') {
      currentMatch += char
    } else if (currentMatch === 'm' && char === 'u') {
      currentMatch += char
    } else if (currentMatch === 'mu' && char === 'l') {
      currentMatch += char
    } else if (currentMatch === 'mul' && char === '(') {
      currentMatch += char
    } else if (currentMatch === 'mul(' && char.match(/\d/)) {
      operator = {
        left: char,
        right: '',
      }

      currentMatch += char
    } else if (
      operator?.left !== undefined &&
      !operator.right &&
      currentMatch[currentMatch.length - 1] !== ',' &&
      char.match(/\d/)
    ) {
      operator.left += char
      currentMatch += char
    } else if (operator?.left !== undefined && char === ',') {
      currentMatch += char
    } else if (
      operator?.left !== undefined &&
      currentMatch[currentMatch.length - 1] === ',' &&
      char.match(/\d/)
    ) {
      operator.right = char
      currentMatch += char
    } else if (operator?.right !== undefined && char.match(/\d/)) {
      operator.right += char
      currentMatch += char
    } else if (operator?.right && char === ')') {
      // End
      currentMatch += char

      result.push([parseInt(operator.left), parseInt(operator.right)])

      operator = undefined
      currentMatch = ''
    } else {
      operator = undefined
      currentMatch = ''
    }
  }

  return result
}

function part1(data: string) {
  const operands = parseOperators(data)

  const sum = operands.reduce((sum, mul, index) => {
    // console.log(mul, index)

    return sum + mul[0] * mul[1]
  }, 0)

  return sum
}

function part2(data: string) {
  const operands = parseOperators(data, true)

  const sum = operands.reduce((sum, mul, index) => {
    // console.log(mul, index)

    return sum + mul[0] * mul[1]
  }, 0)

  return sum
}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt')

  console.log('============== Part 1 ================')
  console.log(part1(data.join('')))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(part2(data.join('')))
}

main()
