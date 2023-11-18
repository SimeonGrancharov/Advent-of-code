import { loadDataFromFile } from '../utilities'

type OperationT = {
  type: 'multiply' | 'add'
  arg: number | 'self'
}

type ConditionT = {
  type: 'division'
  arg: number
}

type OutputT = {
  true: {
    next: number
  }
  false: {
    next: number
  }
}

function last<T>(arr: T[]): T {
  return arr[arr.length - 1]
}

function parseOperation(operation: string): OperationT {
  const semi = operation.split(':')[1].split(' ')

  return {
    type: semi[semi.length - 2] === '*' ? 'multiply' : 'add',
    arg: last(semi) === 'old' ? 'self' : parseInt(last(semi)),
  }
}

function parseCondition(cond: string): ConditionT {
  return {
    type: 'division',
    arg: parseInt(last(cond.split(':')[1].split(' '))),
  }
}

function parseOutput(data: string): { next: number } {
  return {
    next: parseInt(last(data.split(' '))),
  }
}

function parseMonkeys(
  input: string[],
  monkeyType: 'bad' | 'good'
): Map<number, Monkey> {
  const result: Map<number, Monkey> = new Map()

  let row = 0

  while (row < input.length) {
    result.set(
      parseInt(last(input[row].split(' '))),
      new Monkey(
        input[row + 1]
          .split(':')[1]
          .trim()
          .split(',')
          .map((x) => parseInt(x)),
        parseOperation(input[row + 2]),
        parseCondition(input[row + 3]),
        {
          true: parseOutput(input[row + 4]),
          false: parseOutput(input[row + 5]),
        }
      )
    )

    row += 6
  }

  // We must let the monkeys decide what their siblings are
  for (const monkey of result.values()) {
    monkey.setNeighbours(result, monkeyType === 'bad')
  }

  return result
}

class Monkey {
  private relieve: (item: number) => number = () => 0
  private items: number[]
  private operation: OperationT
  private condition: ConditionT
  private output: OutputT

  private neighbours: Map<number, Monkey> = new Map()

  inspectedItemsCount: number = 0

  constructor(
    items: number[],
    operation: OperationT,
    condition: ConditionT,
    output: OutputT
  ) {
    this.items = items
    this.operation = operation
    this.condition = condition
    this.output = output

    this.inspectedItemsCount = 0
  }

  setNeighbours = (monkeys: Map<number, Monkey>, areMonkeysBad: boolean) => {
    const firstSibling = monkeys.get(this.output.true.next)

    if (firstSibling) {
      this.neighbours.set(this.output.true.next, firstSibling)
    }

    const secondSibling = monkeys.get(this.output.false.next)

    if (secondSibling) {
      this.neighbours.set(this.output.false.next, secondSibling)
    }

    if (areMonkeysBad) {
      const divisor = Array.from(monkeys.values()).reduce(
        (div, m) => div * m.condition.arg,
        1
      )
      console.log('divisor >>>>>>> ', divisor)
      this.relieve = (item: number) => item % divisor
    } else {
      this.relieve = (item: number) => Math.trunc(item / 3)
    }
  }

  ping = (): void => {
    while (this.items.length > 0) {
      const item = this.items.shift()

      if (!item) {
        console.log('Item not found eh')
        return
      }

      const worryLevelOfInspectedItem = this.inspect(item)

      const worryLevelAfterRelief = this.relieve(worryLevelOfInspectedItem)

      const testPassed = this.test(worryLevelAfterRelief)

      if (testPassed) {
        this.throwItem(
          this.getSibling(this.output.true.next),
          worryLevelAfterRelief
        )
      } else {
        this.throwItem(
          this.getSibling(this.output.false.next),
          worryLevelAfterRelief
        )
      }

      this.inspectedItemsCount += 1
    }
  }

  catchItem = (item: number): void => {
    this.items.push(item)
  }

  private inspect(item: number): number {
    const arg = this.operation.arg === 'self' ? item : this.operation.arg

    switch (this.operation.type) {
      case 'add': {
        return item + arg
      }

      case 'multiply': {
        return item * arg
      }
    }
  }

  private test(item: number): boolean {
    let result: number = 0

    switch (this.condition.type) {
      case 'division': {
        result = item / this.condition.arg
      }
    }

    return result === Math.trunc(result)
  }

  private throwItem(monkey: Monkey | undefined, item: number): void {
    if (!monkey) {
      return
    }

    monkey.catchItem(item)
  }

  private getSibling(id: number): Monkey | undefined {
    return this.neighbours.get(id)
  }
}

function solution(data: string[], harsh: boolean): number {
  const monkeys = parseMonkeys(data, !harsh ? 'good' : 'bad')

  const rounds = harsh ? 10000 : 20

  for (let round = 1; round <= rounds; round++) {
    for (const monkey of monkeys.values()) {
      monkey.ping()
    }
  }

  console.log(monkeys.values())

  return Array.from(monkeys.values())
    .sort(
      (a: Monkey, b: Monkey) => b.inspectedItemsCount - a.inspectedItemsCount
    )
    .slice(0, 2)
    .reduce((r, m) => r * m.inspectedItemsCount, 1)
}

function main(): void {
  const data = loadDataFromFile(__dirname + '/input.txt')
  const res = solution(data, false)

  const res2 = solution(data, true)
  // 55930
  console.log('================ Solution 1 ============== ', res)
  // 55930
  console.log('================ Solution 2 ============== ', res2)

  // const commands2 = parseCommands(data)
  // const plot = solution2(commands2)
  // console.log('============ Solution 2 ========== \n')
  // console.log(draw(plot))
}

main()
