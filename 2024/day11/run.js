import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const stones = input.split(' ').map(n => Number(n))

// num,numLoops => count
let cache = new Map()

const countLoops = (number, loops) => {
  if (loops === 0) {
    return 1
  }

  const serialized = `${number},${loops}`

  if (cache.has(serialized)) {
    return cache.get(serialized)
  }

  if (number === 0) {
    const count = countLoops(1, loops - 1)
    cache.set(serialized, count)
    return count
  }

const str = number.toString()
  if (str.length % 2 === 0) {
    const num1 = Number(str.slice(0, str.length / 2))
    const num2 = Number(str.slice(str.length / 2))
    const count1 = countLoops(num1, loops - 1)
    const count2 = countLoops(num2, loops - 1)
    const count = count1 + count2
    cache.set(serialized, count)
    return count
  }

  const count = countLoops(number * 2024, loops - 1)
  cache.set(serialized, count)
  return count
}

const countRocksDynamic = (loops) => {
  return stones.reduce((total, stone) => {
    return total + countLoops(stone, loops)
  }, 0)
}

const part1 = () => {
  return countRocksDynamic(25)
}

const part2 = () => {
  return countRocksDynamic(75)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
