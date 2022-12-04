import fs from 'fs'

const i = fs.readFileSync('input.txt', 'utf8').toString()
const lines = i.split('\n')

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

const golf1 = () => i.split`\n`.map(l=>l.split(/,|-/)).reduce((t,[a,b,c,d])=>(a-c^d-b)>=0||(c-a^b-d)>=0?t+1:t,0)

const part2 = () =>
  pairs.reduce((sum, [first, second]) => {
    const firstInSecond = second.start <= first.start && second.end >= first.start
    const secondInFirst = first.start <= second.start && first.end >= second.start

    return firstInSecond || secondInFirst
      ? ++sum
      : sum
  }, 0)

const golf2 = () => i.split`\n`.map(l=>l.split(/,|-/)).reduce((t,[a,b,c,d])=>d-a^b-c>=0?t+1:t,0)

console.log('Part 1:', part1())
console.log('Golf1', golf1())
console.log('Part 2:', part2())
console.log('Golf2', golf2())
