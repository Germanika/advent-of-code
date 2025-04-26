import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n')
const grid = lines.map(line => line.split(''))

const states = {
  empty: 'L',
  occupied: '#',
  floor: '.',
}

const getCopy = layout => layout.slice().map(row => row.slice())

// part 1 - game of seats
const countAdjacent = (x, y, layout) => {
  return [
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1]
  ].reduce((count, [x, y]) =>
      layout[x]?.[y] === states.occupied ? count + 1 : count
  , 0)
}

const getNextSeatPart1 = layout => (x, y, value) => {
    if (value === states.floor) return value
    const adjacent = countAdjacent(x, y, layout)
    if (value === states.empty && adjacent === 0)
      return states.occupied
    if (value === states.occupied && adjacent >= 4)
      return states.empty
    return value
}

const rearrangeSeats = (currentLayout, getNextSeat) => {
  const nextLayout = getCopy(currentLayout)

  nextLayout.forEach((row, x) => {
    row.forEach((value, y) => {
      nextLayout[x][y] = getNextSeat(currentLayout)(x, y, value)
    })
  })

  if (JSON.stringify(nextLayout) === JSON.stringify(currentLayout)) {
    return currentLayout.reduce((count, row) =>
      count + row.reduce(
        (count, val) => val === states.occupied
          ? count + 1
          : count
      , 0)
    , 0)
  } // else
  return rearrangeSeats(nextLayout, getNextSeat)
}


// Part 2
const checkDirection = (row, col, layout) => increment => {
  let [nextRow, nextCol] = increment(row, col)
  let nextSeat = layout[row]?.[col]
  while (nextSeat) {
    if (nextSeat === states.occupied) return true;
    if (nextSeat === states.empty) return false;
    [nextRow,nextCol] = increment(nextRow, nextCol)
    nextSeat = layout[row]?.[col]
  }
  return false
}
const countVisiblyAdjacent = (row, col, layout) => {
  let visible = 0
  let checkLine = checkDirection(row,col,layout);
  [
    (x, y) => [x - 1, y],
    (x, y) => [x - 1, y - 1],
    (x, y) => [x - 1, y + 1],
    (x, y) => [x, y - 1],
    (x, y) => [x, y + 1],
    (x, y) => [x + 1, y + 1],
    (x, y) => [x + 1, y],
    (x, y) => [x + 1, y - 1],
  ].forEach(increment => {
    visible = checkLine(increment) ? visible + 1 : visible
  })
  return visible
}

const getNextSeatPart2 = layout => (x, y, value) => {
  if (value === states.floor) return value
  const adjacent = countVisiblyAdjacent(x, y, layout)
  if (value === states.empty && adjacent === 0)
    return states.occupied
  if (value === states.occupied && adjacent >= 5)
    return states.empty
  return value
}

console.log('Part 1', rearrangeSeats(grid, getNextSeatPart1))
console.log('Part 2:', rearrangeSeats(grid, getNextSeatPart2))
