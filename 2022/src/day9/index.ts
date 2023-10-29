import { loadDataFromFile } from '../utilities'

type DirectionT = 'left' | 'right' | 'up' | 'down'

type PositionT = {
  x: number
  y: number
}

class RopeEnding {
  private currentPosition: PositionT

  constructor() {
    this.currentPosition = {
      x: 50,
      y: 50,
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
    throw new Error('Not supported Direction! Check again')
  }
}

function solution1(data: string[]) {
  const head = new RopeEnding()
  const tail = new RopeEnding()
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
      const headPosition = head.getPosition()
      const tailPosition = tail.getPosition()
      const dX = headPosition.x - tailPosition.x
      const dY = headPosition.y - tailPosition.y

      // Then the tail is adjacent to the head
      if (Math.abs(dX) <= 1 && Math.abs(dY) <= 1) {
        continue
      }

      if (headPosition.x !== tailPosition.x) {
        tail.move(headPosition.x > tailPosition.x ? 'right' : 'left')
      }

      if (headPosition.y !== tailPosition.y) {
        tail.move(headPosition.y > tailPosition.y ? 'up' : 'down')
      }

      const newTailPosition = tail.getPosition()

      tailPositions.add(`${newTailPosition.x} ${newTailPosition.y}`)
    }
  }

  return tailPositions.size
}

function main(): void {
  const data = loadDataFromFile(__dirname + '/input.txt')

  const visitedPlaces = solution1(data)

  console.log('============ Solution 1 ========== ', visitedPlaces)
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
