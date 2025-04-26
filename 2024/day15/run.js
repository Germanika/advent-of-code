import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const [mapInput, moveInput] = input.split('\n\n')

const moves = moveInput.split('')
const initGrid = mapInput.split('\n').map(line => line.split(''))
let grid, robot

const findRobot = () => {
  grid.forEach((row, x) => row.forEach((col, y) => {
    if (col === '@') robot = [x,y]
  }))
}

const logGrid = (grid) => {
  console.log(grid.map(row => row.join('')).join('\n'))
}

const swap = (grid, [x1,y1], [x2, y2]) => {
  let temp = grid[x2][y2]
  grid[x2][y2] = grid[x1][y1]
  grid[x1][y1] = temp
}

const move = ([dx, dy]) => {
  // find first free space above it
  const modifier = ([x,y]) => [x + dx, y + dy]

  let pos = modifier(robot)
  let found = false
  let toMove = []
  while (!found && grid[pos[0]][pos[1]] !== '#') {
    if (grid[pos[0]][pos[1]] === '.') {
      found = true
      toMove.unshift(robot)
    } else {
      toMove.push(pos)
      pos = modifier(pos)
    }
  }

  // swap the free space down until we've swapped with bot
  while (found && toMove.length) {
    const next = toMove.pop()
    swap(grid, next, modifier(next))
  }
  // update bot coords
  if (found) robot = modifier(robot)
}

const part1 = () => {
  grid = initGrid.map(row => [...row])
  findRobot()
  
  const makeMove = (dir) => {
    if (dir === '^') move([-1,0])
    if (dir === '>') move([0,1])
    if (dir === 'v') move([1,0])
    if (dir === '<') move([0,-1])
  }
  moves.forEach(makeMove)

  let total = 0
  grid.forEach((row, x) => row.forEach((value, y) => {
    if (value === 'O') {
      total += x * 100 + y
    }
  }))

  logGrid(grid)
  return total
}

const part2 = () => {
  grid = initGrid.map(row => row.flatMap(col => {
    if (col === '#') return ['#', '#']
    if (col === 'O') return ['[', ']']
    if (col === '.') return ['.', '.']
    return ['@', '.']
  }))
  findRobot()

  const moveVert = (dx) => {
    const modifier = ([x, y]) => [x + dx, y]
    let [x, y] = modifier(robot)

    let found = false
    let cols = [y]
    let toMove = [robot]

    const canPushRow = row => cols.every(col => grid[row][col] !== '#')
    const rowEmpty = row => cols.every(col => grid[row][col] === '.')

    while (!found && canPushRow(x)) {
      if (rowEmpty(x)) {
        found = true
        break
      }
      let newCols = new Set()
      cols.forEach((col) => {
        let value = grid[x][col]
        if (value === '[') {
          newCols.add(col)
          newCols.add(col + 1)
        }
        if (value === ']') {
          newCols.add(col)
          newCols.add(col - 1)
        }
      })
      cols = Array.from(newCols)
      cols.forEach(col => toMove.push([x, col]))
      x += dx
    }
    
    if (!found) return

    while (toMove.length) {
      const next = toMove.pop()
      swap(grid, next, modifier(next))
    }
    robot = modifier(robot)
  }
  
  const makeMove = (dir) => {
    if (dir === '^') moveVert(-1)
    if (dir === 'v') moveVert(1)
    if (dir === '>') move([0,1])
    if (dir === '<') move([0,-1])
  }

  moves.forEach(makeMove)
  logGrid(grid)

  let total = 0
  grid.forEach((row, x) => row.forEach((value, y) => {
    if (value === '[') {
      total += x * 100 + y
    }
  }))
  return total
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
