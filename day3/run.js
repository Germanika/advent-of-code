import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString()
const lines = input.split('\n').map(line => line.split(''))

const parts = []

const isNumber = c => !Number.isNaN(Number(c))
const isSymbol = c => c !== '.' && !isNumber(c)

// Build an array of "parts"
// A part will look like: {number: 123, coords: [row, start, end]}
lines.forEach((line, row) => {
  let partNumber = ''
  let start = null

  line.forEach((cell, col) => {
    if (isNumber(cell)) {
      partNumber += cell
      if (start === null) start = col
    } else if (partNumber !== '') { // found the end
      parts.push({number: partNumber, coords: [row, start, col - 1]})
      partNumber = ''
      start = null
    }
  })
  if (partNumber !== '') { // number at end of line
    parts.push({number: partNumber, coords: [row, start, line.length - 1]})
  }
})

// For each part, search the OG matrix (adjacent cells, row above, row below)
const isValidPart = ({coords}) => {
  const [row, start, end] = coords
  const maxEnd = lines[0].length - 1
  // cell before
  if (start > 0 && isSymbol(lines[row][start - 1])) {
    return true
  }
  // cell after
  if (end < maxEnd && isSymbol(lines[row][end + 1])) {
    return true
  }

  const rowStart = start > 0 ? start - 1 : 0
  const rowEnd = end < maxEnd ? end + 1 : maxEnd

  // row above
  if (row > 0 && lines[row - 1].slice(rowStart, rowEnd + 1).some(isSymbol)) {
    return true
  }

  // row below
  if (row < lines.length && lines[row + 1].slice(rowStart, rowEnd + 1).some(isSymbol)) {
    return true
  }
}

const validParts = parts.filter(isValidPart)

const getAdjacentParts = (row, col) =>
  validParts.filter(({coords}) => {
    const [partRow, partStart, partEnd] = coords
    return Math.abs(row - partRow) <= 1 &&
      col >= (partStart - 1) &&
      col <= (partEnd + 1)
  })

const part1 = () => {
  return validParts.reduce((sum, {number}) => sum + Number(number), 0)
}

const part2 = () => {
  // Find all * symbols 
  // Make an array of adjacent parts for each *
  const gears = []
  lines.forEach((line, row) => {
    line.forEach((char, col) => {
      if (char === '*') gears.push(getAdjacentParts(row, col))
    })
  })

  return gears
    .filter((parts) => parts.length === 2)
    .map((parts) => parts.map(({number}) => Number(number)))
    .map(parts => parts[0] * parts[1])
    .reduce((sum, current) => sum + current, 0)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
