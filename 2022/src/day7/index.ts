import { loadDataFromFile } from '../utilities'

type NodeT = {
  name: string
  size: number
}

type DirectoryT = NodeT & {
  dirs: DirectoryT[]
  files: NodeT[]
}

function createDirectory(name: string): DirectoryT {
  return {
    name,
    size: 0,
    dirs: [],
    files: [],
  }
}

type RowT =
  | {
      type: 'command'
      data: {
        exec: 'cd' | 'ls'
        args: string | undefined
      }
    }
  | {
      type: 'file'
      data: NodeT
    }
  | {
      type: 'dir'
      data: DirectoryT
    }

function parseRows(rows: string[]): RowT[] {
  const parsedRows: RowT[] = []

  for (const row of rows) {
    if (row.startsWith('$')) {
      // Then it is a command
      const [_, exec, ...args] = row.split(' ')

      if (exec === 'cd') {
        parsedRows.push({
          type: 'command',
          data: {
            exec: 'cd',
            args: args[0],
          },
        })
      } else {
        parsedRows.push({
          type: 'command',
          data: {
            exec: 'ls',
            args: undefined,
          },
        })
      }
    } else {
      if (row.startsWith('dir')) {
        parsedRows.push({
          type: 'dir',
          data: {
            name: row.split(' ')[1],
            size: 0,
            dirs: [],
            files: [],
          },
        })
      } else {
        const [size, name] = row.split(' ')

        parsedRows.push({
          type: 'file',
          data: {
            name,
            size: parseInt(size),
          },
        })
      }
    }
  }

  return parsedRows
}

function buildFileSystem(
  currentDir: DirectoryT,
  rows: RowT[],
  currentCommandNumber: number
): number {
  for (let rowNumber = currentCommandNumber; rowNumber <= rows.length - 1; ) {
    const row = rows[rowNumber]

    switch (row.type) {
      case 'command': {
        switch (row.data.exec) {
          case 'cd': {
            const data = row.data

            if (data.args === '..') {
              // Then go back and return how much rows are eaten
              return rowNumber - currentCommandNumber + 1
            } else {
              // Just find the directory and continue building
              const directory = currentDir.dirs.find(
                (dir) => dir.name === data.args
              )

              if (directory !== undefined) {
                const parsedCommandCount = buildFileSystem(
                  directory,
                  rows,
                  rowNumber + 1
                )

                currentDir.size += directory.size
                rowNumber += parsedCommandCount + 1
                continue
              }
            }

            break
          }

          case 'ls': {
            break
          }
        }

        break
      }

      case 'dir': {
        currentDir.dirs.push(row.data)
        break
      }

      case 'file': {
        currentDir.files.push(row.data)

        currentDir.size += row.data.size
        break
      }
    }

    rowNumber++
  }

  return rows.length - currentCommandNumber
}

function calculateSize(currentDir: DirectoryT): number {
  let sum = 0

  for (const dir of currentDir.dirs) {
    if (dir.size <= 1 * 10 ** 5) {
      sum += dir.size
    }

    sum += calculateSize(dir)
  }

  return sum
}

function findTheSmallestDirNeededToFreeUpEnoughSpace(
  currentDir: DirectoryT,
  callback: (dir: DirectoryT) => void
): void {
  for (const dir of currentDir.dirs) {
    callback(dir)

    findTheSmallestDirNeededToFreeUpEnoughSpace(dir, callback)
  }
}

function solution1(rows: string[]): number {
  const root: DirectoryT = {
    name: '/',
    size: 0,
    dirs: [],
    files: [],
  }

  buildFileSystem(root, parseRows(rows), 1)

  return calculateSize(root)
}

function solution2(rows: string[]): number {
  const root: DirectoryT = {
    name: '/',
    size: 0,
    dirs: [],
    files: [],
  }

  buildFileSystem(root, parseRows(rows), 1)

  const maxDiskSpace = 7 * 10 ** 7
  const neededSpace = 3 * 10 ** 7

  const spaceToFreeUp = neededSpace - (maxDiskSpace - root.size)

  let sizeOfDirectory: number = Number.MAX_SAFE_INTEGER

  findTheSmallestDirNeededToFreeUpEnoughSpace(root, (dir) => {
    const diffToNeededSpace = dir.size - spaceToFreeUp

    if (diffToNeededSpace > 0 && dir.size < sizeOfDirectory) {
      sizeOfDirectory = dir.size
    }
  })

  return sizeOfDirectory
}

function main(): void {
  const data: string[] = loadDataFromFile(__dirname + '/input.txt')

  const size = solution1(data)
  console.log('============= Solution 1 ========= ', size)

  const sizeOfDir = solution2(data)
  console.log('============= Solution 2 ========= ', sizeOfDir)
}

main()
