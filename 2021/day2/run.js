import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n')

const directions = lines.filter(x => x).map(line => {
  const [direction, amount] = line.split(' ')
  return ({ direction, amount: Number(amount) })
})

const part1 = () => {
  let depth = 0
  let x = 0
  directions.forEach(({direction, amount}) => {
    if (direction === 'forward') {
        x += amount
    } else if (direction === 'up') {
      depth = depth - amount
    } else {
      depth = depth + amount
    }
  })

  return depth * x
}

const part2 = () => {
  let depth = 0
  let x = 0
  let aim = 0
  directions.forEach(({direction, amount}) => {
    if (direction === 'forward') {
        x += amount
        depth += aim * amount
    } else if (direction === 'up') {
      aim -= amount
    } else {
      aim += amount
    }
  })

  return depth * x
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())