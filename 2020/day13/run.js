import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n')

// Part 1
const part1 = () => {
    const timestamp = Number(lines[0])
    const busses = lines[1].split(',')
        .filter(bus => bus !== 'x')
        .map(bus => Number(bus))

    // get time to next bus
    const busTimes = busses
        .map(bus => ({ bus, time: bus - timestamp % bus }))
        .sort((a, b) => a.time - b.time)
    const nextBus = busTimes[0]
    return nextBus.time * nextBus.bus
}
console.log('Part 1: ', part1())

// Part 2
const busMatches = time => ({ bus, index }) => (time + index) % bus === 0

const findFirstMatch = (busses, time, increment) => {
    while (!busses.every(busMatches(time)))
        time += increment
    return time
}

const part2 = () => {
    const busses = lines[1].split(',')
        .map((bus, index) => ({ bus, index }))
        .filter(({ bus }) => bus !== 'x')
        .map(({ bus, index }) => ({ bus: Number(bus), index }))
    
    const first = busses.shift()
    let arr = [first]
    let timestamp = first.bus
    let increment = timestamp
    busses.forEach(bus => {
        arr.push(bus)
        timestamp = findFirstMatch(arr, timestamp, increment)
        increment *= bus.bus
    })
    return timestamp
}
console.log('part 2:', part2())
