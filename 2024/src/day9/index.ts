import { loadDataFromFile } from '../utility'

const isEven = (n: number) => n % 2 === 0

function parseAndGenerateArray(data: string[]): (number | string)[] {
  let id = 0

  return data[0].split('').reduce<(string | number)[]>((r, el, index) => {
    if (isEven(index)) {
      r.push(...Array<number>(parseInt(el)).fill(id))
      id++
    } else {
      r.push(...Array<string>(parseInt(el)).fill('.'))
    }

    return r
  }, [])
}

function part1(data: (string | number)[]) {
  const work = [...data]
  let sum = 0
  let getPointer = data.length - 1

  for (let index = 0; index <= getPointer; index++) {
    if (data[getPointer] === '.') {
      while (data[getPointer] === '.') {
        getPointer--
      }
    }

    if (data[index] === '.') {
      const shiftElement = data[getPointer]

      work[index] = shiftElement
      work[getPointer] = '.'

      sum += index * (shiftElement as any)

      getPointer--
    } else {
      sum += index * (data[index] as any)
    }

    // console.log(work.join(''), index, getPointer)
  }

  // console.log('0099811188827773336446555566..............')
  // console.log(work.join(''))
  return sum
}

function part2(data: (string | number)[]) {
  const work = [...data]

  // Start from back to start
  for (let index = data.length - 1; index >= 0; index--) {
    let file: undefined | { size: number; id: number; startingIndex: number }

    // If an symbol other than dot is found, start reading file
    if (data[index] !== '.') {
      file = {
        id: data[index] as number,
        size: 0,
        startingIndex: 0,
      }

      // While we match the same file id -> continue
      while (data[index] === file.id) {
        file.size++
        index--
      }

      // Save where the file starts for easier replacement after
      file.startingIndex = index + 1
      // Hacky but we sae on variable for the while loop (shrug)
      index++
    }

    // Just TS stuff
    if (!file) {
      continue
    }

    let space: { index: number; size: number } | undefined

    // Start searching spaces always from the start.
    // Can be optimised not to read them from start but it got late
    for (let s = 0; s <= index; s++) {
      // if a space is matched start consuming it
      if (work[s] === '.') {
        space = { index: s, size: 0 }

        // consume consume
        while (work[s] === '.') {
          space.size++
          s++
        }

        // If the found space can fit the file, stop searching
        if (space.size >= file?.size) {
          break
        }

        space = undefined
      }
    }

    // If there is no space suitable found, bye, we can't refit this file :/
    if (!space) {
      continue
    }

    // The easiest part, just swap them symbols
    for (let sI = 0; sI < file.size; sI++) {
      if (!space) break

      work[space.index + sI] = file.id
      work[file.startingIndex + sI] = '.'
    }
  }

  return work.reduce<number>(
    (s, a, i) => s + (typeof a === 'number' ? (a as number) * i : 0),
    0
  )
}
function main() {
  const data = loadDataFromFile(__dirname + '/data.txt')

  const input = parseAndGenerateArray(data)

  console.log('============== Part 1 ================')
  console.log(part1(input))
  console.log('\n\n')
  console.log('============== Part 2 ================')
  console.log(part2(input))
}

main()
