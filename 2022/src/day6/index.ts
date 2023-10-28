import { loadDataFromFile } from '../utilities'

function hasDuplicatesInArray(arr: string[]): boolean {
  return new Set(arr).size !== arr.length
}

function findStartOfPackMarker(
  stream: string[],
  sizeOfPack: number
): number | undefined {
  let startOfPackMarker: number | undefined
  for (let index = 0; index <= stream.length - sizeOfPack; index++) {
    const dataStream = stream.slice(index, index + sizeOfPack)

    if (hasDuplicatesInArray(dataStream)) {
      continue
    }

    startOfPackMarker = index + sizeOfPack
    break
  }

  return startOfPackMarker
}

function solution1(input: string): number | undefined {
  return findStartOfPackMarker(input.split(''), 4)
}

function solution2(input: string): number | undefined {
  return findStartOfPackMarker(input.split(''), 14)
}

function main(): void {
  const data: string[] = loadDataFromFile(__dirname + '/input.txt')
  const input = data[0]

  const markerAtPosition1 = solution1(input)
  console.log('============== Solution 1 ==============\n', markerAtPosition1)

  const markerAtPosition2 = solution2(input)
  console.log('============== Solution 2 ==============\n', markerAtPosition2)
}

main()
