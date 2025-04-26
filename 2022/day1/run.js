import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n')

let largestTotal = 0
let currentTotal = 0
let allElves = []
lines.forEach(line => {
    if (line === '') {
        if (currentTotal > largestTotal) {
            largestTotal = currentTotal
        }
        allElves.push(currentTotal)
        currentTotal = 0
    } else {
        currentTotal += Number(line)
    }
})

const part1 = () => {
    return largestTotal
}

// Total up the top 3
const part2 = () => {
    allElves.sort((a,b) => a - b).reverse();
    return allElves.slice(0, 3).reduce((total, current) => total + current, 0)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
