import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n')

const sorted = lines.map(line => Number(line)).sort((a,b) => a - b)

// Part 1

let oneJolts = 0
let threeJolts = 1 // 1 for the device
let previous = 0 // wall starts at 0
sorted.forEach(adapter => {
    const diff = adapter - previous
    if (diff === 1) oneJolts++
    if (diff === 3) threeJolts++
    previous = adapter
})
console.log('Part 1', oneJolts * threeJolts)


// Part 2

// add the wall and end device to the array :/
sorted.unshift(0)
sorted.push(sorted.slice(-1)[0] + 3)

let cache = {}

const arrangementsFrom = (index) => {
    if (cache[index]) return cache[index]
    if (index === sorted.length - 1) return 1

    let total = 0
    if (index + 1 < sorted.length) total += arrangementsFrom(index + 1)
    if (index + 2 < sorted.length && (sorted[index + 2] - sorted[index] <= 3)) total += arrangementsFrom(index + 2)
    if (index + 3 < sorted.length && (sorted[index + 3] - sorted[index] <= 3)) total += arrangementsFrom(index + 3)
    cache[index] = total
    return total
}

console.log('Part 2', arrangementsFrom(0))