import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n')

let directions = ['E','S','W','N'] // + 1 index = 90dev to the right

let direction = 0
const getDirection = () => directions[direction]
let east = 0 // east +, west -
let north = 0 // south -, north +

const actions = {
    'N': (value) => north += value,
    'S': (value) => north -= value,
    'E': (value) => east += value,
    'W': (value) => east -= value,
    'L': (value) => rotate(-value),
    'R': (value) => rotate(value),
    'F': (value) => actions[getDirection()](value)
}

const rotate = (value) => {
    const newDirection = direction + (value / 90)
    direction = newDirection >= 0
        ? newDirection % directions.length
        : directions.length + (newDirection % directions.length)
}

lines.map(line => ([line.slice(0,1), Number(line.slice(1))]))
    .forEach(([action, value]) => actions[action](value))

const manhattanDistance = Math.abs(east) + Math.abs(north)
console.log('Part 1', manhattanDistance)
