import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const [mapInput, moveInput] = input.split('\n\n')

// >^V<
const moves = moveInput.split('')
const initGrid = mapInput.split('\n').map(line => line.split(''))

const getRobot = (grid) => {
  let robot
  grid.forEach((row, x) => row.forEach((col, y) => {
    if (col === '@') robot = {x,y}
  }))
  return robot
}

const logGrid = (grid) => {
  console.log(grid.map(row => row.join('')).join('\n'))
}

const swap = (grid, [x1,y1], [x2, y2]) => {
  let temp = grid[x2][y2]
  grid[x2][y2] = grid[x1][y1]
  grid[x1][y1] = temp
}

const part1 = () => {
  let grid = initGrid.map(row => [...row])
  let robot = getRobot(grid)

  const move = (grid, robot, modifier) => {
    // find first free space above it
    let pos = modifier([robot.x, robot.y])
    let found = false
    let toSwap = []
    while (!found && grid[pos[0]][pos[1]] !== '#') {
      if (grid[pos[0]][pos[1]] === '.') {
        found = true
        toSwap.unshift([robot.x, robot.y])
      } else {
        toSwap.push(pos)
        pos = modifier(pos)
      }
    }
  
    // swap the free space down until we've swapped with bot
    while (found && toSwap.length) {
      const next = toSwap.pop()
      swap(grid, next, modifier(next))
    }
    // update bot coords
    if (found) {
      let newPos = modifier([robot.x, robot.y])
      robot.x = newPos[0]
      robot.y = newPos[1]
    }
  }

  const moveUp = (grid, robot) => {
    move(grid, robot, ([x,y]) => [x - 1, y])
  }
 
  const moveDown = (grid, robot) => {
    move(grid, robot, ([x,y]) => [x + 1, y])
  }
  
  const moveRight = (grid, robot) => {
    move(grid, robot, ([x,y]) => [x, y + 1])
  }
  
  const moveLeft = (grid, robot) => {
    move(grid, robot, ([x,y]) => [x, y - 1])
  }
  
  const makeMove = (grid, robot, move) => {
    if (move === '^') moveUp(grid, robot)
    if (move === '>') moveRight(grid, robot)
    if (move === 'v') moveDown(grid, robot)
    if (move === '<') moveLeft(grid, robot)
  }

  moves.forEach(move => {
    makeMove(grid, robot, move)
  })

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
  let grid = initGrid.map(row => row.flatMap(col => {
    if (col === '#') return ['#', '#']
    if (col === 'O') return ['[', ']']
    if (col === '.') return ['.', '.']
    return ['@', '.']
  }))

  let robot = getRobot(grid)

  const moveUp = () => {
    let x = robot.x - 1;
    let y = robot.y
    let found = false
    let cols = [y]
    let toMove = []

    const canPushRow = row => cols.every(col => grid[row][col] !== '#')
    const rowEmpty = row => cols.every(col => grid[row][col] === '.')

    while (!found && canPushRow(x)) {
      if (rowEmpty(x)) {
        found = true
        toMove.unshift([robot.x, robot.y])
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
      cols.forEach(col => toMove.push([x,col]))
      x--
    }

    while (found && toMove.length) {
      const next = toMove.pop()
      swap(grid, next, [next[0] - 1, next[1]])
    }

    if (found) robot.x--
  }
  
  const moveDown = () => {
    let x = robot.x + 1;
    let y = robot.y
    let found = false
    let cols = [y]
    let toMove = []

    const canPushRow = row => cols.every(col => grid[row][col] !== '#')
    const rowEmpty = row => cols.every(col => grid[row][col] === '.')

    while (!found && canPushRow(x)) {
      if (rowEmpty(x)) {
        found = true
        toMove.unshift([robot.x, robot.y])
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
      cols.forEach(col => toMove.push([x,col]))
      x++
    }

    while (found && toMove.length) {
      const next = toMove.pop()
      swap(grid, next, [next[0] + 1, next[1]])
    }

    if (found) robot.x++
  }
  
  const moveRight = () => {
    let x = robot.x;
    let y = robot.y + 1
    let found = false
    while (!found && grid[x][y] !== '#') {
      if (grid[x][y] === '.') {
        found = true
      } else {
        y++
      }
    }
  
    while (found && y > robot.y) {
      swap(grid, [x, y], [x, y - 1])
      y--
    }
    if (found) robot.y++
  }
  
  const moveLeft = () => {
    let x = robot.x;
    let y = robot.y - 1;
    let found = false
    while (!found && grid[x][y] !== '#') {
      if (grid[x][y] === '.') {
        found = true
      } else {
        y--
      }
    }
  
    while (found && y < robot.y) {
      swap(grid, [x, y], [x, y + 1])
      y++
    }
    if (found) robot.y--
  }

  const makeMove = (move) => {
      if (move === '^') moveUp(grid, robot)
      if (move === '>') moveRight(grid, robot)
      if (move === 'v') moveDown(grid, robot)
      if (move === '<') moveLeft(grid, robot)
  }

  moves.forEach((move) => {
    makeMove(move)
  })
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
