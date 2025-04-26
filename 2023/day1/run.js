import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const lines = input.split('\n')

const part1 = () => {
  const numbers = lines
    .map(line =>
      line.split('')
          .filter(char => char.match(/\d/))
    )
    .map(chars => [chars[0], chars[chars.length - 1]])
    .map(arr => arr.join(''))
    .map(s => Number(s))

  return numbers.reduce((sum, value) => sum + value, 0)
}

const part2 = () => {
  const validDigits = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9'
  ]

  const wordsToDigits = {
    'one': '1',
    'two': '2',
    'three': '3',
    'four': '4',
    'five': '5',
    'six': '6',
    'seven': '7',
    'eight': '8',
    'nine': '9'
  }

  const findFirst = line => {
    let digit;
    let minIndex = Number.MAX_SAFE_INTEGER;

    validDigits.forEach(n => {
      const index = line.indexOf(n)
      if (index >= 0 && index < minIndex) {
        minIndex = index
        digit = n
      }
    })
  
    return Number(digit) ? digit : wordsToDigits[digit]
  }
  
  const findLast = line => {
    let digit;
    let maxIndex = -1;
  
    validDigits.forEach(n => {
      const index = line.lastIndexOf(n)
      if (index >= 0 && index > maxIndex) {
        maxIndex = index
        digit = n
      }
    })
  
    return Number(digit) ? digit : wordsToDigits[digit]
  }


  const numbers = lines
    .map(line => [findFirst(line), findLast(line)])
    .map(arr => arr.join(''))
    .map(s => Number(s))

  return numbers.reduce((sum, value) => sum + value, 0)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
