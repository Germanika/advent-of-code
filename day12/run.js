import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const grid = input.split('\n').map(line => line.split(''))

function* id(i) {
  let curr = i
  while (true) {
    curr++
    yield curr
  }
}

const idGen = id(0)
const nextId = () => idGen.next().value

const plot = (plant, region = null) => ({
  plant, region
})



let farm = grid.map(row => row.map(plant => plot(plant)))

const shouldSpread = ((plant, adjacent) => 
  adjacent && !adjacent.region && adjacent.plant === plant
)

const spreadRegion = (x, y) => {
  const {plant, region} = farm[x][y]
  const top = y > 0 ? farm[x][y - 1] : null
  if (shouldSpread(plant, top)) {
    top.region = region
    spreadRegion(x, y - 1)
  }
  const bottom = y < farm[0].length - 1 ? farm[x][y + 1] : null
  if (shouldSpread(plant, bottom)) {
    bottom.region = region
    spreadRegion(x, y + 1)
  }
  const left = x > 0 ? farm[x - 1][y] : null
  if (shouldSpread(plant, left)) {
    left.region = region
    spreadRegion(x - 1, y)
  }
  const right = x < farm.length - 1 ? farm[x + 1][y] : null;
  if (shouldSpread(plant, right)) {
    right.region = region
    spreadRegion(x + 1, y)
  }
}

// go through the plot and add stuff to regions!
// how do we know it's in a region?
// any adjacent plot of the same type? -> add to region
grid.forEach((row, x) => row.forEach((plant, y) => {
  const plot = farm[x][y];
  if (!plot.region) {
    plot.region = nextId()
    spreadRegion(x,y)
  }
}))

const part1 = () => {
  // plot: one square, single plant
  // region: adjacent plots
  // region area: number of squares in plot
  // region perimeter: number of sides adjacent to the plot

  // price = area x perimeter

  // region can be inside another region
  // inside perimeters count

  // calc the total price!
  const getPerimeter = (x, y) => {
    const plot = farm[x][y]
    
    const top = y > 0 ? farm[x][y - 1] : null
    const bottom = y < farm[0].length - 1 ? farm[x][y + 1] : null
    const left = x > 0 ? farm[x - 1][y] : null
    const right = x < farm.length - 1 ? farm[x + 1][y] : null
    
    let perimeter = 0;
    [top,bottom,left,right].forEach(adjacentPlot => {
      if (!adjacentPlot || adjacentPlot.region !== plot.region) {
        perimeter ++
      }
    })
    return perimeter
  }

  // once categorized to regions
  // -> go over each plot, determine how much perimeter and area it adds to the region
  // -> add "1" to region area
  // -> add "1" to perimer for each side that's not adjacent to its own region
  // -> add it to a "region total" count
  // -> add up all the region totals?
  let regions = new Map()
  const initRegion = () => ({
    perimeter: 0,
    area: 0,
  })
  farm.forEach((row, x) => row.forEach((plot, y) => {
    let {perimeter, area} = regions.get(plot.region) ?? initRegion()
    regions.set(plot.region, {
        perimeter: perimeter + getPerimeter(x,y),
        area: area + 1
      })
  }))

  let total = 0
  regions.forEach(({perimeter, area}, _) => {
    total += perimeter * area
  })
  return total
}

const part2 = () => {
  let regions = new Map()
  let initRegion = () => ({
    area: 0,
    sides: 0,
  })

  farm.forEach((row) => row.forEach((plot) => {
    const curr = regions.get(plot.region) ?? initRegion()
    regions.set(plot.region, { ...curr, area: curr.area + 1 })
  }))

  const compareEdge = (row, adjacent) => {
    let prev = null
    row.forEach((plot, i) => {
      if (plot.region !== adjacent[i]?.region) {
        // found edge
        // is it a new edge, or a continuation?
        if (plot.region !== prev) {
          const curr = regions.get(plot.region)
          regions.set(plot.region, { ...curr, sides: curr.sides + 1 })
        }
        prev = plot.region
      } else {
        prev = null
      }
    })
  }

  farm.forEach((row, i) => {
    let adjacentTop = i > 0 ? farm[i-1] : []
    let adjacentBottom = i < farm.length - 1 ? farm[i + 1] : []
    compareEdge(row, adjacentTop)
    compareEdge(row, adjacentBottom)
  })


  const getCol = col => farm.map(row => row[col])
  farm[0].forEach((_, col) => {
    const column = getCol(col)
    const adjacentLeft = col > 0 ? getCol(col - 1) : []
    const adjacentRight = col < farm[0].length - 1 ? getCol(col + 1) : []
    compareEdge(column, adjacentLeft)
    compareEdge(column, adjacentRight)
  })

  let total = 0
  regions.forEach(({area, sides}) => {
    total += area * sides
  })
  return total
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
