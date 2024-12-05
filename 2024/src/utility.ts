import fs from 'fs'

export const loadDataFromFile = (
  filePath: string,
  filterFn?: (d: string) => boolean
): string[] => {
  return fs
    .readFileSync(filePath)
    .toString()
    .split('\n')
    .filter(filterFn ?? Boolean)
}
