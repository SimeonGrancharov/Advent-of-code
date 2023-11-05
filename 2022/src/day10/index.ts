import { loadDataFromFile } from '../utilities'

type CommandT =
  | {
      name: 'noop'
      cycles: 1
    }
  | {
      name: 'addx'
      cycles: 2
      arg: number
    }

function parseCommands(data: string[]): CommandT[] {
  const commands: CommandT[] = []

  for (const line of data) {
    const [command, arg] = line.split(' ')

    if (command === 'noop') {
      commands.push({
        name: 'noop',
        cycles: 1,
      })
    } else {
      commands.push({
        name: 'addx',
        cycles: 2,
        arg: parseInt(arg),
      })
    }
  }

  return commands
}

function processor(
  commands: CommandT[],
  onCommandExecution: (command: CommandT, cycle: number) => void
) {
  let cycle = 1
  let commandIndex = 0

  // Anyway this can be commandIndex <= commands.length - 1
  while (commandIndex < commands.length) {
    const command = commands[commandIndex]
    command.cycles--

    onCommandExecution(command, cycle)

    // End of command
    if (command.cycles <= 0) {
      commandIndex++
    }

    cycle++
  }
}

function render(plot: string[][], spritePosition: number, cycle: number): void {
  const DefSym = ' '
  const OverlapSym = '#'

  const row = cycle / 40

  if (row > plot.length) {
    plot.push([])
  }

  const currentRow = plot[plot.length - 1]
  const translatedX = cycle - Math.trunc(row) * 40

  if (translatedX >= spritePosition && translatedX <= spritePosition + 2) {
    currentRow.push(OverlapSym)
  } else {
    currentRow.push(DefSym)
  }
}

function draw(plot: string[][]): string {
  return plot.map((x) => x.join('')).join('\n')
}

function solution1(commands: CommandT[]) {
  // Here we intercept
  const SignificantCycles = [20, 60, 100, 140, 180, 220]

  let registry = 1
  let signalStrength = 0

  processor(commands, (command, cycle) => {
    const isSignificantCycle = SignificantCycles.includes(cycle)

    if (isSignificantCycle) {
      signalStrength += cycle * registry
    }

    switch (command.name) {
      case 'noop':
        break

      case 'addx': {
        if (command.cycles <= 0) {
          registry += command.arg
        }

        break
      }
    }
  })

  return signalStrength
}

function solution2(commands: CommandT[]) {
  const plot: string[][] = []
  let spritePosition = 1

  processor(commands, (command, cycle) => {
    render(plot, spritePosition, cycle)

    switch (command.name) {
      case 'noop':
        break

      case 'addx': {
        if (command.cycles <= 0) {
          spritePosition += command.arg
        }

        break
      }
    }
  })

  return plot
}

function main(): void {
  const data = loadDataFromFile(__dirname + '/input.txt')
  const commands = parseCommands(data)
  const signalStrength = solution1(commands)
  // 17180
  console.log('============ Solution 1 ========== \n', signalStrength, '\n')

  const commands2 = parseCommands(data)
  const plot = solution2(commands2)
  console.log('============ Solution 2 ========== \n')
  console.log(draw(plot))
}

main()
