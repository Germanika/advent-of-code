import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const grid = input.split('\n').map(line => line.split(''))

const part1 = () => {
  // How many unique locations within the bounds of the map contain an antinode?
  // lowercase letter, uppercase letter, or digit => antenna location
  // antinodes are placed same distance as antennas are from each other, one on either side of a matched pair
  const antenna = (id, row, col) => ({id, row, col})

  // add all antenna locations to an array
  const antennas = [];
  grid.forEach((line, row) => {
    line.forEach((node, col) => {
      if (node.match(/\w/)) antennas.push(antenna(node, row, col))
    })
  })

  // make pairs
  const uniquePairs = []
  while (antennas.length) {
    const a = antennas.shift()
    antennas.forEach(b => {
      if (a.id === b.id) {
        uniquePairs.push([a,b])
      }
    })
  }

  // for each pair, find the antinode locations
  const antinodes = new Set()
  const addAntiNode = (x,y) => {
    if (x >= 0 && y >= 0 && x < grid.length && y < grid[0].length) {
      antinodes.add(`${x},${y}`)
    }
  }
  while (uniquePairs.length) {
    const curr = uniquePairs.shift()
    const xdiff = curr[0].row - curr[1].row
    const ydiff = curr[0].col - curr[1].col
    addAntiNode(curr[0].row + xdiff, curr[0].col + ydiff)
    addAntiNode(curr[1].row - xdiff, curr[1].col - ydiff)
  }
  
  return antinodes.size
}
  // for any antenna, find all its matches
  // place antinodes for any of the matches, when within bounds of the grid
  // count the total antinode locations


const part2 = () => {
  const antenna = (id, row, col) => ({id, row, col})

  // add all antenna locations to an array
  const antennas = [];
  grid.forEach((line, row) => {
    line.forEach((node, col) => {
      if (node.match(/\w/)) antennas.push(antenna(node, row, col))
    })
  })

  // make pairs
  const uniquePairs = []
  while (antennas.length) {
    const a = antennas.shift()
    antennas.forEach(b => {
      if (a.id === b.id) {
        uniquePairs.push([a,b])
      }
    })
  }

  // for each pair, find the antinode locations
  const antinodes = new Set()
  const addAntiNode = (x,y) => {
    if (x >= 0 && y >= 0 && x < grid.length && y < grid[0].length) {
      antinodes.add(`${x},${y}`)
      return true
    }
    return false
  }

  // recursively add antinodes in a line
  const addAllAntiNodes = (start, xdiff, ydiff) => {
    addAntiNode(start.row, start.col)
    const x = start.row + xdiff
    const y = start.col + ydiff
    if (addAntiNode(x,y)) {
      addAllAntiNodes({row: x, col: y},xdiff,ydiff)
    }
  }

  while (uniquePairs.length) {
    const curr = uniquePairs.shift()
    const xdiff = curr[0].row - curr[1].row
    const ydiff = curr[0].col - curr[1].col
    addAllAntiNodes(curr[0], xdiff, ydiff)
    addAllAntiNodes(curr[1], -xdiff, -ydiff)
  }
  
  return antinodes.size
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
