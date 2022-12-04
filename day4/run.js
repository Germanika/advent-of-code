import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n')

/**
 *  Turn input into this shape:
 *  [
 *    [{start, end}, {start, end}]
 *    [{start, end}, {start, end}]
 *  ]
 *
 * */
const pairs = lines
  .map(line => line.split(',')
    .map(range => {
      const [start, end] = range.split('-')
      return { start: Number(start), end: Number(end) }
    })
  )

const part1 = () =>
  pairs.reduce((sum, [first, second]) => {
    const firstInSecond = second.start <= first.start && second.end >= first.end
    const secondInFirst = first.start <= second.start && first.end >= second.end

    return firstInSecond || secondInFirst
      ? ++sum
      : sum
  }, 0)


const part2 = () =>
  pairs.reduce((sum, [first, second]) => {
    const firstInSecond = second.start <= first.start && second.end >= first.start
    const secondInFirst = first.start <= second.start && first.end >= second.start

    return firstInSecond || secondInFirst
      ? ++sum
      : sum
  }, 0)

console.log('Part 1:', part1())
console.log('Part 2:', part2())
