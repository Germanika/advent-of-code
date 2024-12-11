import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const grid = input.split('\n').map(line => line.split(''))

let initialPos

grid.find((row, x) => row.find((value, y) => {
  if (value === '^') {
    initialPos = {x,y,direction: 'up'}
    return true
  }
}))

const isLegal = (pos) => pos.x >=0 && pos.x < grid.length && pos.y >=0 && pos.y < grid[0].length

const turn = direction => {
  switch (direction) {
    case 'up':
      return 'right'
    case 'right':
      return 'down'
    case 'down':
      return 'left'
    case 'left':
      return 'up'
    default:
      throw new Error('illegal direction')
  }
}

const move = (grid, pos) => {
  let {x,y,direction} = pos

  if (direction === 'up') {
    x = pos.x - 1
  } else if (direction === 'right') {
    y = pos.y + 1
  } else if (direction === 'down') {
    x = pos.x + 1
  } else if (direction === 'left') {
    y = pos.y - 1
  }
  let newPos = {...pos, x, y}
  if (isLegal(newPos) && grid[x][y] === '#') {
    newPos = {...pos, direction: turn(direction)}
  }
  return newPos
}

const part1 = () => {
  /**
   * find starting position
   * move through map, update position
   * at each step, add to set of "visited" coords
   * stop when reaching out of bounds
   */
  let pos = {...initialPos}

  const visited = new Set();
  const id = ({x,y}) => `${x},${y}`

  while(isLegal(pos)) {
    visited.add(id(pos))
    pos = move(grid, pos)
  }

  return visited.size
}

const part2 = () => {
  // if we end up in the same spot, same direction, we're in a cycle.
  // at each position (except start pos and already obst)
  // add an obstacle
  // run the sym
  // if we find a cycle, add to list of possible obstacles

  const containsCycle = grid => {
    const visited = new Set([]);
    const id = ({x,y,direction}) => `${x},${y},${direction}`
    let pos = {...initialPos}
  
    while(isLegal(pos)) {
      // back where we started
      if (visited.has(id(pos))) {
        return true
      }
      visited.add(id(pos))
      pos = move(grid, pos)
    }
    // escaped
    return false
  }

  let goodObstacles = 0;

  grid.forEach((row,i) => row.forEach((value, j) => {
    const testGrid = grid.map(row => row.slice())
    if (!['^','#'].includes(value)) {
      testGrid[i][j] = '#'
      goodObstacles += containsCycle(testGrid) ? 1 : 0
    }
  }))
  return goodObstacles
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
