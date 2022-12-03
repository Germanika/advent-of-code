import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n')

// a-z -> 97 - 122 -> 1-26
// A-Z -> 65 - 90 ->  27-52
const getPriority = (letter => {
  const charCode = letter.charCodeAt(0)
  return charCode > 90 ? charCode - 96 : charCode - 38
})

const part1 = () =>
  lines
    .map(line => ([line.slice(0, line.length / 2), line.slice(line.length / 2)]))
    .map(([first, second]) => first.split('').find(char => second.includes(char)))
    .map(getPriority)
    .reduce((sum, priority) => sum + priority, 0)

const part2 = () =>
  new Array(lines.length / 3)
    .fill('')
    .map(_ => lines.splice(0, 3))
    .map(([first, second, third]) => first.split('').find(char => second.includes(char) && third.includes(char)))
    .map(getPriority)
    .reduce((sum, curr) => sum + curr, 0)

console.log('Part 1:', part1())
console.log('Part 2:', part2())
