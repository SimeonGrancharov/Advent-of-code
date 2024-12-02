import fs from 'fs'

export const loadDataFromFile = (filePath: string): string[] => {
  return fs.readFileSync(filePath).toString().split('\n').filter(Boolean)
}
