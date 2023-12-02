import fs from 'fs'

export function recordKeys<T extends Record<string, any>, K extends keyof T>(
  obj: T
): K[] {
  return Object.keys(obj) as K[]
}

export const loadDataFromFile = (filePath: string): string[] => {
  return fs.readFileSync(filePath).toString().split('\n').filter(Boolean)
}
