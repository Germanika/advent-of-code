import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();

const multRegex = /mul\([0-9]+,[0-9]+\)/g

const addMults = (input) => {
  const instructions = Array.from(input.matchAll(multRegex)).map(([x]) => x)
  const pairs = instructions.map(ins => {
    let mult = ins.replace("mul(", "")
    mult = mult.replace(")", "")
    const [a,b] = mult.split(",")
    return [a,b].map(x => Number(x))
  })

  return pairs.reduce((sum, pair) => {
    return sum + pair[0] * pair[1]
  }, 0)
}

const part1 = () => {
  return addMults(input)
}

const part2 = () => {
  // go through and remove anything between don't and do
  // then run part1 against whatever's left?
  const reg = /(don't\(\)).*?(do\(\))/gs
  let newInput = input.replaceAll(reg, "")
  return addMults(newInput)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
