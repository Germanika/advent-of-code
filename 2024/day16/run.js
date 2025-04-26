import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const maze = input.split('\n').map(line => line.split(''))

/**
 * Start at "S", end at "E"
 * Start facing "east"
 * Free space: '.'
 * Wall: '#'
 * 
 * Scoring:
 * - move fwd: 1pt
 * - turn 90deg: 1000pts
 */

const dirs = ['r','d','l','u']
const moveFwd = ({x, y, direction}) => {
  const deltas = {
    'r': [0, 1],
    'l': [0, -1],
    'u': [-1, 0],
    'd': [1, 0]
  }
  const [dx, dy] = deltas[direction]
  return {
    x: x + dx,
    y: y + dy,
    direction
  }
}

const turn = (direction, c) => {
  const directions = ['r', 'd', 'l', 'u']
  const nextIndex = (directions.indexOf(direction) + c) % directions.length
  return directions[nextIndex
  ]
}

let scores = new Map()
let paths = new Map()
const getKey = (x, y, direction) => `${x},${y},${direction}`

// dijksta search?
let toVisit = []
maze.forEach((row,x) => row.forEach((_, y) => {
  dirs.forEach(dir => {
    scores.set(getKey(x,y,dir), Infinity)
    if (maze[x][y] !== '#') {
      toVisit.push({x, y, direction: dir})
    }
  })
  if (maze[x][y] === 'S') {
    scores.set(getKey(x, y, 'r'), 0)
    paths.set(getKey(x, y, 'r'), new Set([getKey(x, y, 'r')]))
  }
}))

const updateScore = ({x, y, direction}, newScore, path) => {
  if (maze[x][y] === '#') return

  const pKey = getKey(x, y, direction)

  if (newScore < scores.get(pKey)) {
    scores.set(pKey, newScore)
    paths.set(pKey, new Set([...path, pKey]))
  } else if (newScore === scores.get(pKey)) {
    paths.get(pKey).add(...path, pKey)
  }
}

// returns [x, y]
// slowest minHeap of all time
const nextClosest = () => {
  toVisit = toVisit.sort((a, b) =>
    scores.get(getKey(b.x, b.y, b.direction)) - scores.get(getKey(a.x, a.y, a.direction))
  )
  return toVisit.pop()
}

while (toVisit.length > 0) {
  const {x, y, direction} = nextClosest()
  const pKey = getKey(x, y, direction)
  const currentScore = scores.get(pKey)
  const path = paths.get(pKey)

  const fwd = moveFwd({x, y, direction})
  const right = {x, y, direction: turn(direction, 1)}
  const left = {x, y, direction: turn(direction, -1)}

  updateScore(fwd, currentScore + 1, path)
  updateScore(left, currentScore + 1000, path)
  updateScore(right, currentScore + 1000, path)
}


const part1 = () => {
  const xEnd = 1
  const yEnd = maze[0].length - 2
  let lowestScore = Infinity
  dirs.forEach(dir => {
    const key = getKey(xEnd, yEnd, dir)
    const score = scores.get(key)
    if (score < lowestScore) {
      lowestScore = score
    }
  })
  return lowestScore
}

const part2 = () => {
  // from the scores...
  // start at end, look at nodes in all 4 directions
  // lowest score -> add to pathset (could be more than 1)
  // stop when reaching start node?
  let xEnd = 1
  let yEnd = maze[0].length - 2

  let lowestScore = Infinity
  let lowest
  dirs.forEach(dir => {
    const key = getKey(xEnd, yEnd, dir)
    const score = scores.get(key)
    if (score < lowestScore) {
      lowestScore = score
      lowest = key
    }
  })
  let nodes = new Set()
  paths.get(lowest).forEach(key => {
    const [x, y, dir] = key.split(',')
    nodes.add(`${x},${y}`)
  })

  return nodes.size
}

console.time('part1')
console.log('Part 1:', part1())
console.timeEnd('part1')
console.time('part2')
console.log('Part 2:', part2())
console.timeEnd('part2')
