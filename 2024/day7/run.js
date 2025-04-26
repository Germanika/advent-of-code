import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
/**
 * { test: 47, numbers: [1, 2, 3] }
 */
const lines = input.split('\n').map(line =>  {
  const [test, rest] = line.split(': ')
  const numbers = rest.split(' ').map(x => Number(x))
  return { test: Number(test), numbers }
})

const evaluate = equation => {
  let queue = [...equation]
  let total = queue.shift()
  let operator = queue.shift()
  while (queue.length) {
    const next = queue.shift()
    if (['+','*','|'].includes(next)) {
      operator = next
    } else {
      if (operator === '+') total += next
      if (operator === '*') total *= next
      if (operator === '|') total = Number(`${total}${next}`)
    }
  }
  return total
}


const getAllCombos = (operators, length) => {
  let combos = []

  const generateCombo = (curr) => {
    if (curr.length === length) {
      combos.push(curr)
      return
    }
    operators.forEach(operator => {
      generateCombo([...curr, operator])
    })
  }

  generateCombo([])
  return combos
}

const interleave = ([x, ...arr1], [y, ...arr2]) => {
  if (arr1.length === 0) return [x, y, ...arr2]
  if (arr2.length === 0) return [x, y, ...arr1]
  return [x, y, ...interleave(arr1, arr2)]
}

const part1 = () => {
  const operators = ['+', "*"]

  const filtered = lines.filter(
    ({test, numbers}) => {
      const numCombos = numbers.length - 1
      const combos = getAllCombos(operators, numCombos)

      return combos.some(combo => {
        const equation = interleave(numbers, combo)
        if (evaluate(equation) === test) {
          return true
        }
      })
    }
  )
  return filtered.reduce((total, {test}) => total += test, 0)
}

const part2 = () => {
  const operators = ['+', "*", '|']

  const filtered = lines.filter(
    ({test, numbers}) => {
      const numCombos = numbers.length - 1
      const combos = getAllCombos(operators, numCombos)

      // find the first combo that works
      return combos.some(combo => {
        const equation = interleave(numbers, combo)
        if (evaluate(equation) === test) {
          return true
        }
      })
    }
  )
  return filtered.reduce((total, {test}) => total += test, 0)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
