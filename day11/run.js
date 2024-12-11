import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const lines = input.split('\n')

const part1 = () => {

}

const part2 = () => {

}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
