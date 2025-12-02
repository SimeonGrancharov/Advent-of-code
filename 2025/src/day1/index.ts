import { loadDataFromFile } from '../utility'

type Data = [direction: 'L' | 'R', revs: string][]

function prepareData(d: string[]): Data {
  return d.map((line) => {
    return [line[0], line.slice(1, line.length)] as any
  })
}

function rotate(pos: number, direction: 'L' | 'R', revs: number) {
  const newPos = pos + (((direction === 'L' ? -1 : 1) * revs) % 100)

  return newPos > 99 ? newPos - 100 : newPos < 0 ? newPos + 100 : newPos
}

function part1(d: Data) {
  let zeroCount = 0
  let currentPosition = 50

  d.forEach((l) => {
    const dir = l[0]
    const revs = parseInt(l[1])

    if (revs < 0) {
      return
    }
    currentPosition = rotate(currentPosition, dir, revs)
    console.log(' currentPosition >> ', currentPosition)

    if (currentPosition === 0) {
      zeroCount++
    }
  })

  return zeroCount
}

function part2(d: Data) {
  let zeroCount = 0
  let currentPosition = 50

  d.forEach((l) => {
    const dir = l[0]
    const revs = parseInt(l[1])

    if (revs < 0) {
      return
    }

    let prevPosition = currentPosition

    currentPosition = rotate(currentPosition, dir, revs)

    // Then we have went through the zero
    if (
      prevPosition !== 0 &&
      currentPosition !== 0 &&
      dir === 'L' &&
      (currentPosition > prevPosition || currentPosition === 0)
    ) {
      zeroCount++
    }

    // Then we have went through the 99
    if (
      currentPosition !== 0 &&
      prevPosition !== 0 &&
      dir === 'R' &&
      currentPosition < prevPosition
    ) {
      zeroCount++
    }

    if (currentPosition === 0) {
      zeroCount++
    }

    zeroCount += Math.floor(revs / 100)
  })

  return zeroCount
}

function main() {
  const raw = loadDataFromFile(__dirname + '/data.txt')

  const data = prepareData(raw)

  console.log('============== Part 1 ================')
  console.log(part1(data))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(part2(data))
}

main()
