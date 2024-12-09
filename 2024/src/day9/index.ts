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

function part2(data: string[]) {
  const work = [...data]
  let sum = 0
  let getPointer = data.length - 1

  for (let index = 0; index <= getPointer; index++) {
    let spaces = 0

    while (data[index] === '.') {
      spaces++
    }

    if (!spaces) {
      continue
    }

    // Now we know how much spaces should be filled -> start searcing appropriate file

    while (data[getPointer] === '.') {
      getPointer--
    }

    const fileIdToBeReplaced = data[getPointer]
    let getPointerActual = getPointer
    let fileSize = 0
    let foundFile = false

    while (fileSize <= spaces && getPointerActual > 0) {
      while (data[getPointerActual] === fileIdToBeReplaced) {
        fileSize++
        getPointerActual--
      }
    }

    if (foundFile) {
      for (let i = 0; i <= fileSize; i++) {
        work[index + i] = fileIdToBeReplaced
        work[getPointer + i] = '.'
      }

      getPointer = getPointerActual
    }

    // console.log(work.join(''), index, getPointer)
  }
  //
  // console.log('0099811188827773336446555566..............')
  // console.log(work.join(''))
  return sum
}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt')

  const input = parseAndGenerateArray(data)

  console.log('============== Part 1 ================')
  console.log(part1(input))
  console.log('\n\n')
  // console.log('============== Part 2 ================')
  // console.log(part2(data))
}

main()
