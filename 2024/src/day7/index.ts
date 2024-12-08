import { loadDataFromFile } from '../utility'

type DataT = [number, number[]][]

function parseInput(input: string[]): DataT {
  return input.reduce<DataT>((r, row) => {
    const [left, right] = row.split(':')
    const leftValue = parseInt(left)

    r.push([
      leftValue,
      right
        .split(' ')
        .filter(Boolean)
        .map((x: string) => parseInt(x)),
    ])

    return r
  }, [])
}

function generateOperators(
  maxL: number,
  input: string[],
  syms: string[],
  r: string[][]
) {
  if (input.length === maxL) {
    r.push(input)
    return input
  }

  for (const sym of syms) {
    generateOperators(maxL, [...input, sym], syms, r)
  }

  return input
}

function evaluateExpression(
  leftOperand: number,
  rightOperand: number,
  operator: '+' | '*' | '||'
): number {
  switch (operator) {
    case '+': {
      return leftOperand + rightOperand
    }

    case '*': {
      return leftOperand * rightOperand
    }

    case '||': {
      return parseInt(`${leftOperand}${rightOperand}`)
    }
  }
}

function part1(data: DataT): number {
  let sum = 0

  for (const entry of data) {
    const res = entry[0]
    let resultForEntry = 0
    const operands = entry[1]
    const operators: ('*' | '+')[][] = []

    generateOperators(operands.length - 1, [], ['+', '*'] as const, operators)

    for (const currentOperators of operators) {
      resultForEntry = operands[0]
      for (let index = 0; index <= currentOperators.length - 1; index++) {
        resultForEntry = evaluateExpression(
          resultForEntry,
          operands[index + 1],
          currentOperators[index]
        )
      }

      if (resultForEntry === res) {
        sum += res
        break
      }
    }
  }

  return sum
}

function part2(data: DataT): number {
  let sum = 0

  for (const entry of data) {
    const res = entry[0]
    let resultForEntry = 0
    const operands = entry[1]
    const operators: ('*' | '+' | '||')[][] = []

    generateOperators(
      operands.length - 1,
      [],
      ['+', '*', '||'] as const,
      operators
    )

    for (const currentOperators of operators) {
      resultForEntry = operands[0]
      for (let index = 0; index <= currentOperators.length - 1; index++) {
        resultForEntry = evaluateExpression(
          resultForEntry,
          operands[index + 1],
          currentOperators[index]
        )
      }

      if (resultForEntry === res) {
        sum += res
        break
      }
    }
  }

  return sum
}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt')

  const parsed = parseInput(data)

  console.log('============== Part 1 ================')
  console.log(part1(parsed))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(part2(parsed))
}

main()
