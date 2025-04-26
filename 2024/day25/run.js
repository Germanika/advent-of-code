import fs from 'fs'
import {log, time, timeEnd} from 'console'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const blocks = input.split('\n\n').map(block => block.split('\n').map(line => line.split('')))

const getLockHeight = lock => lock[0]
    .map((_, col) => lock.map(r => r[col]))
    .map(col => col.lastIndexOf('#'))
const getKeyHeight = key => getLockHeight(key.reverse())

const locks = blocks
  .filter(block => block[0].every(col => col === '#'))
  .map(lock => getLockHeight(lock))

const keys = blocks
  .filter(block => block[0].every(col => col === '.'))
  .map(key => getKeyHeight(key))

const part1 = () => {
  const pairs = new Set()

  locks.forEach((lock, l) => {
    keys.forEach((key, k) => {
      const fits = lock.every(((pin, i) => pin + key[i] <= 5))
      if (fits) {
        pairs.add(`${l},${k}`)
      }
    })
  })

  return pairs.size
}

const part2 = () => {

}


time('part 1')
log(part1())
timeEnd('part 1')

time('part 2')
log(part2())
timeEnd('part 2')
