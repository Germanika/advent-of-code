import fs from 'fs'

const input = fs.readFileSync('input.txt', 'utf8').toString()
const numbers = input.split('\n').map(x => Number(x))

const PREAMBLE_LENGTH = 25

const validate = (number, preamble) => 
    preamble.some((a, index) =>
        preamble.slice(0, index).includes(number - a)
    )

let preamble = numbers.slice(0, PREAMBLE_LENGTH)
const firstNonConformingNumber = numbers 
    .slice(PREAMBLE_LENGTH)
    .map(value => Number(value))
    .find(number => {
        if (validate(number, preamble)) {
            preamble.push(number)
            preamble.shift()
            return false
        }
        return true
    })

console.log('part 1:', firstNonConformingNumber)

// ------------------- PART 2 ---------------------- //
let sum = 0
let slidingWindow = []
const target = firstNonConformingNumber

numbers.some(number => {
    slidingWindow.push(number)
    sum += number
    while (sum > target) sum -= slidingWindow.shift()
    return sum === target
})
slidingWindow = slidingWindow.sort((a,b) => a - b)

console.log('Part 2:', slidingWindow[0] + slidingWindow.slice(-1)[0])