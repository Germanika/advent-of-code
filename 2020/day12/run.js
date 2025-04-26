import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n')


const part1 = () => {
    let directions = ['E','S','W','N'] // + 1 index = 90dev to the right
    let direction = 0
    const getDirection = () => directions[direction]
    let east = 0
    let north = 0

    const actions = {
        'N': value => north += value,
        'S': value => north -= value,
        'E': value => east += value,
        'W': value => east -= value,
        'L': value => rotate(-value),
        'R': value => rotate(value),
        'F': value => actions[getDirection()](value)
    }

    const rotate = (value) => {
        const newDirection = direction + (value / 90)
        direction = newDirection >= 0
            ? newDirection % directions.length
            : directions.length + (newDirection % directions.length)
    }

    lines.map(line => ([line.slice(0,1), Number(line.slice(1))]))
        .forEach(([action, value]) => actions[action](value))

    return Math.abs(east) + Math.abs(north)
}

console.log('Part 1', part1())


const part2 = () => {
    let ship = { east: 0, north: 0 }
    let waypoint = { east: 10, north: 1 }

    const actions = {
        'N': value => waypoint.north += value,
        'S': value => waypoint.north -= value,
        'E': value => waypoint.east += value,
        'W': value => waypoint.east -= value,
        'L': value => rotate(-value),
        'R': value => rotate(value),
        'F': value => moveShip(value)
    }

    const rotate = (value) => {
        const rotation = value > 0 ? value : (360 + value)

        if (numberOfRotations === 90)
            waypoint = { east: waypoint.north, north: -waypoint.east }
        else if (numberOfRotations === 180)
            waypoint = { east: -waypoint.east, north: -waypoint.north }
        else if (numberOfRotations === 270)
            waypoint = { east: -waypoint.north, north: waypoint.east }
    }

    const moveShip = (value) => {
        ship.north += waypoint.north * value
        ship.east += waypoint.east * value
    }

    lines.map(line => ([line.slice(0,1), Number(line.slice(1))]))
        .forEach(([action, value]) => actions[action](value))

    return Math.abs(ship.east) + Math.abs(ship.north)
}

console.log('Part 2:', part2())