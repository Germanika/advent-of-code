import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();

const swap = (arr, i, j) => {
  const a = arr[i]
  arr[i] = arr[j]
  arr[j] = a
  return arr
}

const initDisc = () => {
  let disc = []

  input.split('').forEach((val, index) => {
    let items
    let value = Number(val)

    if (index % 2 === 0) { 
      const id = index/2
      items = new Array(value).fill(id)
    } else {
      items = new Array(value).fill(".")
    }
    disc.push(...items)
  })

  return disc
}

const checksum = (disc) => disc.reduce((total, value, index) => value === '.' ? total : value * index + total, 0)

const part1 = () => {
  let disc = initDisc()

  disc.forEach((value, i) => {
    if (value === '.') {
      const toSwap = disc.findLastIndex(c => c !== '.')
      if (i < toSwap) {
        swap(disc, i, toSwap)
      }
    }
  })

  return checksum(disc)
}

const part2 = () => {
  const disc = initDisc()

  const moveBlock = block => {
    if (block.id === null) return
    const length = block.end - block.start + 1

    const swapStart = disc.findIndex((val, index) => {
      if (val === '.') {
        // if there are at length empty spaces in a row, good
        let test = disc.slice(index, index + length)
        return test.length === length && test.every(x => x ==='.')
      }
    })

    if (swapStart !== -1 && swapStart < block.start) {
      for(let i = swapStart; i < swapStart + length; i++) {
        disc[i] = block.id
      }
      for(let i = block.start; i < block.end + 1; i++) {
        disc[i] = '.'
      }
    }
  }

  const lastNonEmpty = disc.findLastIndex(c => c !== '.')
  let block = {
    id: disc[lastNonEmpty],
    start: lastNonEmpty,
    end: lastNonEmpty
  }

  for (let i = lastNonEmpty; i > 0; i--) {
    if (block.id === disc[i]) { // still same block
      block.start = i
    } else { // new block
      moveBlock(block)
      if (disc[i] !== '.') {
        block.id = disc[i];
        block.start =  i
        block.end = i
      } else { // reached empty space
        block.id = null
      }
    }
  }

  return checksum(disc)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
