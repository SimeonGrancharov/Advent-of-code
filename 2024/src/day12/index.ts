import { loadDataFromFile } from '../utility'

type Garden = string[][]

/*
 *
 *
 *  R: [string[][]]
 * R: [ [["R", 'R']], [ ['R', 'R'], ['R', 'R']] ]
 *
 *
 */

type Point = {
  row: number
  col: number
}

function getNewPoly(input: Garden) {
  const polygon: string[][] = []

  for (let r = 0; r <= input.length - 1; r++) {
    const arr: string[] = []
    polygon.push(arr)

    for (let ind = 0; ind <= input[0].length - 1; ind++) {
      arr.push(' ')
    }
  }
  return polygon
}

function traverse(
  map: Garden,
  plant: string,
  position: Point,
  onPlantFound: (plant: string, point: Point) => void,
  onPlantNotFound?: (plant: string, point: Point) => void
) {
  const { row, col } = position

  if (map[row]?.[col] !== plant) {
    onPlantNotFound?.(plant, position)
    return
  }

  onPlantFound(plant, position)

  // up
  traverse(
    map,
    plant,
    { row: row - 1, col: col },
    onPlantFound,
    onPlantNotFound
  )

  // down
  traverse(
    map,
    plant,
    { row: row + 1, col: col },
    onPlantFound,
    onPlantNotFound
  )

  // left
  traverse(map, plant, { row, col: col - 1 }, onPlantFound, onPlantNotFound)

  // right
  traverse(map, plant, { row, col: col + 1 }, onPlantFound, onPlantNotFound)
}

function print(polygonsByPlant: Record<string, string[][][]>) {
  for (const plant of Object.entries(polygonsByPlant)) {
    console.log(' Plant: ', plant[0])

    plant[1].forEach((polygon) => {
      console.log(' ++++++++++++ ')

      console.log(polygon.map((row) => row.join('')).join('\n'))
    })
  }
}

function extractPolygons(input: Garden): Record<string, string[][][]> {
  const polygonsByPlant: Record<string, string[][][]> = {}

  // First extract all polygons
  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col <= input[0].length - 1; col++) {
      const plant = input[row][col]

      if (plant !== '.') {
        const polygon = getNewPoly(input)

        traverse(
          input,
          plant,
          { row, col },
          (plant: string, position: Point) => {
            polygon[position.row][position.col] = plant
            input[position.row][position.col] = '.'
          }
        )

        if (!polygonsByPlant[plant]) {
          polygonsByPlant[plant] = []
        }

        polygonsByPlant[plant].push(polygon)
      }
    }
  }
  return polygonsByPlant
}

function solution1(input: Garden) {
  const polygonsByPlant = extractPolygons(input)

  let price = 0

  // Then traverse extracted polygons
  for (const plant of Object.entries(polygonsByPlant)) {
    for (const plantPolygon of plant[1]) {
      for (let row = 0; row <= plantPolygon.length - 1; row++) {
        for (let col = 0; col <= plantPolygon[0].length - 1; col++) {
          const data: { area: number; perimeter: number } = {
            area: 0,
            perimeter: 0,
          }

          if (plantPolygon[row][col] === plant[0]) {
            traverse(
              plantPolygon,
              plant[0],
              { row, col },
              (_, position: Point) => {
                plantPolygon[position.row][position.col] = '.'
                data.area += 1
              },
              (_, position: Point) => {
                if (plantPolygon[position.row]?.[position.col] !== '.') {
                  data.perimeter += 1
                }
              }
            )
            console.log(' for plant', plant[0], ' data is  ', data)

            price += data.area * data.perimeter
          }
        }
      }
    }
  }

  return price
}

function main() {
  const data = loadDataFromFile(__dirname + '/data.txt').map((x) => x.split(''))

  console.log('============== Part 1 ================')
  console.log(solution1(data))
  // console.log('\n\n')
  // console.log('============== Part 2 ================')
  // console.log(solution(data))
}

main()
