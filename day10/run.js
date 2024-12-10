import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const grid = input.split('\n').map(line => line.split('').map(x=>Number(x)))
const clen = grid[0].length
const rlen = grid.length

const part1 = () => {
  // find a 0
  // explore all 4 directions
  // from each of those, check 4 directions
  // if found n + 1 => check that direction
  // if reach a 9 -> add [i,j],[x,y] to result set
  // Remove any duplicate pair of coords
  const map = new Map()

  const hike = (start,row,col) => {
    const num = grid[row][col]
    if (num == 9) {
      let set = map.get(start)
      const end = `${row},${col}`
      set.add(end)
    }
    const next = num + 1
    //up
    if (row - 1 >= 0 && grid[row-1][col] == next) {
      hike(start, row-1, col)
    }
    //right
    if(col+1<clen &&grid[row][col+1]==next){
      hike(start,row,col+1)
    }
    //down
    if(row+1<rlen&&grid[row+1][col]==next){
      hike(start,row+1,col)
    }
    //left
    if(col-1>=0&&grid[row][col-1]==next) {
      hike(start,row,col-1)
    }
  }

  for(let row=0; row<grid.length; row++) {
    for (let col=0; col<grid[0].length; col++) {
      if (grid[row][col] == 0) {
        const start = `${row},${col}`
        map.set(start, new Set())
        hike(start,row,col)
      }
    }
  }

  let total = 0
  map.forEach((value) => total += value.size)
  return total
}

const part2 = () => {
  const map = new Map()

  const hike = (start,row,col) => {
    const num = grid[row][col]

    if (num == 9) {
      let rating = map.get(start)
      map.set(start,rating + 1)
    }

    const next = num + 1

    if (row - 1 >= 0 && grid[row-1][col] == next) {
      hike(start, row-1, col)
    }

    if(col+1<clen &&grid[row][col+1]==next){
      hike(start,row,col+1)
    }

    if(row+1<rlen&&grid[row+1][col]==next){
      hike(start,row+1,col)
    }

    if(col-1>=0&&grid[row][col-1]==next) {
      hike(start,row,col-1)
    }
  }

  for(let row=0; row<grid.length; row++) {
    for (let col=0; col<grid[0].length; col++) {
      if (grid[row][col] == 0) {
        const start = `${row},${col}`
        map.set(start, 0)
        hike(start,row,col)
      }
    }
  }

  let total = 0
  map.forEach(value => total += value)
  return total
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
