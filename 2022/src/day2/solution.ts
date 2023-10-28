const fs = require('fs')

const readInput = () => {
  const input = fs.readFileSync('./input.txt')

  return input.toString()
}

// A, X - Rock
// B, Y - Paper
// C, Z - Scissors

type OwnChoiceT = 'X' | 'Y' | 'Z'

const PointsByChoice: Record<OwnChoiceT, number> = {
  X: 1,
  Y: 2,
  Z: 3,
}

const MovesByResults: Record<number, string[]> = {
  // Loss
  0: ['A Z', 'B X', 'C Y'],
  //  Draw
  3: ['A X', 'B Y', 'C Z'],
  // Win
  6: ['A Y', 'B Z', 'C X'],
}

const part1 = () => {
  const data = readInput()

  let result = 0

  for (const round of data.split('\n')) {
    result +=
      PointsByChoice[round.split(' ')[1] as keyof typeof PointsByChoice] ?? 0

    for (const [points, moves] of Object.entries(MovesByResults)) {
      if (moves.includes(round)) {
        result += parseInt(points)
        break
      }
    }
  }

  console.log(result)
}

const TargetResultToPoints: Record<OwnChoiceT, number> = {
  X: 0,
  Y: 3,
  Z: 6,
}

const part2 = () => {
  const data = readInput()
  let result = 0

  for (const round of data.split('\n')) {
    if (!round) {
      console.log('No round skipping. Noviq red nakraq :|')
      continue
    }

    const [theirNewChoice, target]: [string, OwnChoiceT] = round.split(' ')
    const outcomePoints = TargetResultToPoints[target]

    result += outcomePoints

    for (const move of MovesByResults[outcomePoints]) {
      const [theirChoice, myChoice]: string[] = move.split(' ')

      if (theirChoice === theirNewChoice) {
        result += PointsByChoice[myChoice as OwnChoiceT]
        break
      }
    }
  }
  console.log(result)
}

//part1();
part2()
