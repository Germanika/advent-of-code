import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();

const parseClaw = (line) => {
  const regex = /X[+=](\d+),\s*Y[+=](\d+)/
  const matches = line.match(regex)
  return {
    x: parseInt(matches[1]),
    y: parseInt(matches[2])
  }
}
const claws = input.split('\n\n').map(claw => claw.split('\n').map(parseClaw)).map(([a,b,prize]) => ({a, b, prize}))

/**
 * {
 *  a: { x: 94, y: 34 },
 *  b: { x: 22, y: 67 },
 *  prize: { x: 8400, y: 5400 }
 * },
 */
const cramerSolve = ({a, b, prize}) => {
  const det = (a.x * b.y) - (a.y * b.x)
  const aCount = ((prize.x * b.y) - (prize.y * b.x)) / det
  const bCount = ((a.x * prize.y) - (a.y * prize.x)) / det

  return { a: aCount, b: bCount }
}

const isValidSolution = (max) => ({a, b}) =>
  Number.isInteger(a) && Number.isInteger(b) && a <= max && b <= max

const part1 = () => {
  return claws
    .map(cramerSolve)
    .filter(isValidSolution(100))
    .reduce((total, {a,b}) => total + 3 * a + b, 0)
}

const part2 = () => {
  const adjustment = 10000000000000

  return claws
    .map(claw => ({
      ...claw,
      prize: { x: claw.prize.x + adjustment, y: claw.prize.y + adjustment }
    }))
    .map(cramerSolve)
    .filter(isValidSolution(Number.MAX_SAFE_INTEGER))
    .reduce((total, {a, b}) => total + 3 * a + b, 0)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
