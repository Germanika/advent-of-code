import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const robots = input.split('\n').map(line => {
  const [initial, velocity] = line.split(' ')
  const [x, y] = initial.replace('p=', '').split(',').map(x => Number(x))
  const [vx, vy] = velocity.replace('v=', '').split(',').map(x => Number(x))

  return {
    position: {x, y},
    velocity: {vx, vy}
  }
})

const getPosition = (width, height) => ({position, velocity}, seconds) => {
  const x = (position.x + seconds * velocity.vx) % width
  const y = (position.y + seconds * velocity.vy) % height

  return {
    x: x < 0 ? width + x : x,
    y: y < 0 ? height + y: y
  }
}

const safetyFactor = (width, height) => positions => {
  const middleX = Math.floor(width / 2)
  const middleY = Math.floor(height / 2)

  let quads = new Array(4).fill(0)
  positions.forEach(({x, y}) => {
    if (x < middleX && y < middleY) quads[0]++
    if (x > middleX && y < middleY) quads[1]++
    if (x < middleX && y > middleY) quads[2]++
    if (x > middleX && y > middleY) quads[3]++
  })

  return quads.reduce((total, curr) => total * curr, 1)
}

const getMap = (width, height) => {
  let grid = new Array(width).fill()
  grid = grid.map(_ => new Array(height).fill(0))
  return (bots) => {
    bots.forEach(({x,y}) => {
      grid[x][y]++
    })
    return grid
  }
}

const logMap = (grid) => {
  let flipped = grid[0].map((_, col) => grid.map(row => row[col]))
  let str = flipped.map(row => row.join('').replaceAll('0', '.').replaceAll(/\d/g, 'X'))
  str.forEach(str => console.log(str))
}

const part1 = () => {
  const width = 101
  const height = 103
  const seconds = 100
  const example = getPosition(width, height)
  const exampleBots = robots.map(robot => example(robot, seconds))

  return safetyFactor(width, height)(exampleBots)
}

const part2 = () => {
  const width = 101
  const height = 103

  const tick = getPosition(width, height)
  const getSafety = safetyFactor(width, height)

  const getBots = seconds => robots.map(robot => tick(robot, seconds))

  // assuming the tree is drawn in the centre
  let seconds = 0
  let lowestSafetyFactor = getSafety(getBots(0))
  let secondsToTree = 0

  while (seconds < width * height) {
    const safety = getSafety(getBots(seconds))
    if (safety < lowestSafetyFactor) {
      lowestSafetyFactor = safety
      secondsToTree = seconds
    }
    seconds++
  }
  logMap(getMap(width,height)(getBots(secondsToTree)))
  return secondsToTree
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
