import { loadDataFromFile } from '../utilities'

type DirectionT = 'left' | 'right' | 'up' | 'down'

type PositionT = {
  x: number
  y: number
}

class RopeKnot {
  private currentPosition: PositionT

  constructor() {
    this.currentPosition = {
      x: 0,
      y: 0,
    }
  }

  move = (direction: DirectionT): void => {
    switch (direction) {
      case 'up': {
        this.currentPosition.y++
        break
      }
      case 'down': {
        this.currentPosition.y--
        break
      }
      case 'left': {
        this.currentPosition.x--
        break
      }
      case 'right': {
        this.currentPosition.x++
        break
      }
    }
  }

  getPosition = (): PositionT => ({
    x: this.currentPosition.x,
    y: this.currentPosition.y,
  })
}

class RopeKnotWithAdjacentPoint extends RopeKnot {
  private adjacentKnot: RopeKnot

  constructor(adjacentTo: RopeKnot | RopeKnotWithAdjacentPoint) {
    super()

    this.adjacentKnot = adjacentTo
  }

  moveToAdjacentKnot = (): void => {
    const adjacentKnotPosition = this.adjacentKnot.getPosition()
    const knotPosition = this.getPosition()

    const dX = adjacentKnotPosition.x - knotPosition.x
    const dY = adjacentKnotPosition.y - knotPosition.y

    const absoluteDX = Math.abs(dX)
    const absoluteDY = Math.abs(dY)

    // Then the tail is adjacent to the head
    if (absoluteDX <= 1 && absoluteDY <= 1) {
      return
    }

    if (dX === 0) {
      // Move by the Y axis
      this.move(dY > 0 ? 'up' : 'down')
    } else if (dY === 0) {
      // Move on the X axis
      this.move(dX > 0 ? 'right' : 'left')
    } else {
      // Move diagonally
      this.move(dY > 0 ? 'up' : 'down')
      this.move(dX > 0 ? 'right' : 'left')
    }
  }
}

function getDirectionFromInput(input: string): DirectionT {
  if (input === 'R') {
    return 'right'
  } else if (input === 'L') {
    return 'left'
  } else if (input === 'D') {
    return 'down'
  } else if (input === 'U') {
    return 'up'
  } else {
    throw new Error(`Not supported Direction ${input}! Terminating`)
  }
}

function solution1() {
  const data = loadDataFromFile(__dirname + '/input.txt')

  const head = new RopeKnot()
  const tail = new RopeKnotWithAdjacentPoint(head)
  const tailPositions = new Set<string>(['50 50'])

  for (const move of data) {
    const [dir, repetitions] = move.split(' ')
    const direction = getDirectionFromInput(dir)

    for (
      let repetition = 1;
      repetition <= parseInt(repetitions);
      repetition++
    ) {
      head.move(direction)

      tail.moveToAdjacentKnot()

      const newTailPosition = tail.getPosition()

      tailPositions.add(`${newTailPosition.x} ${newTailPosition.y}`)
    }
  }

  return tailPositions.size
}

function solution2() {
  const data = loadDataFromFile(__dirname + '/input.txt')

  const middleKnots = 8
  const head = new RopeKnot()
  const knots: RopeKnotWithAdjacentPoint[] = []

  for (let i = 1; i <= middleKnots; i++) {
    const prev = knots[knots.length - 1]

    knots.push(new RopeKnotWithAdjacentPoint(prev !== undefined ? prev : head))
  }

  const tail = new RopeKnotWithAdjacentPoint(knots[knots.length - 1])
  const tailPositions = new Set<string>(['0 0'])

  for (const move of data) {
    const [dir, repetitions] = move.split(' ')
    const direction = getDirectionFromInput(dir)

    for (
      let repetition = 1;
      repetition <= parseInt(repetitions);
      repetition++
    ) {
      head.move(direction)

      for (let knotNumber = 1; knotNumber <= middleKnots; knotNumber++) {
        knots[knotNumber - 1].moveToAdjacentKnot()
      }

      tail.moveToAdjacentKnot()

      const newTailPosition = tail.getPosition()

      tailPositions.add(`${newTailPosition.x} ${newTailPosition.y}`)
    }
  }

  return tailPositions.size
}

function main(): void {
  const visitedPlaces = solution1()
  console.log('============ Solution 1 ========== ', visitedPlaces)

  const visitedPlaces2 = solution2()
  console.log('============ Solution 2 ========== ', visitedPlaces2)
}

main()

/**
 * ....T....
 *......H...
 * -----------
 *  ....T....
 *  ......H..
 * ----------
 *..........
 * ......TH..
 *
 *
 */
