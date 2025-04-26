import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n')
const instructions = lines.map(line => line.split(' = '))

const part1 = () => {
  let mask = '',
    memory = {}

  const applyMask = value => {
    let binary = value.toString(2)
    let reversed = binary.split('').reverse()
    mask.split('').reverse().forEach((m, index) => {
      if (m === '1') reversed[index] = '1'
      else if (m === '0') reversed[index] = '0'
      else reversed[index] = reversed[index] || '0'
    }) 
    return reversed.reverse().join('')
  }

  const updateMemory = (address, value) => {
      let thing = applyMask(value)
      memory[address] = parseInt(thing, 2)
  }

  instructions.forEach(([instruction, value]) => {
      if (instruction.startsWith('mask'))
          mask = value
      else
          updateMemory(instruction.match(/\d+/)[0], Number(value))
  })

  return Object.values(memory).reduce((total, value) => total += value, 0)
}

const part2 = () => {
  let mask = '',
    memory = {}

  const applyMask = value => {
    let binary = value.toString(2)
    let reversed = binary.split('').reverse()
    mask.split('').reverse().forEach((m, index) => {
      if (m === '1') reversed[index] = '1'
      else if (m === '0') reversed[index] = reversed[index] || '0'
      else reversed[index] = 'X'
    }) 
    return reversed.reverse().join('')
  }

  const getPermutations = masked => {
    if (masked.includes('X')) {
      let res1 = getPermutations(masked.replace('X', '1'))
      let res2 = getPermutations(masked.replace('X', '0'))
      return [...res1, ...res2]
    } else {
      return [masked]
    }
  }

  const updateMemory = (address, value) => {
    const masked = applyMask(address);
    getPermutations(masked).forEach(
      key => memory[key] = value
    )
  }

  instructions.forEach(([instruction, value]) => {
    if (instruction.startsWith('mask'))
        mask = value
    else
        updateMemory(Number(instruction.match(/\d+/)[0]), Number(value))
  })

  return Object.values(memory).reduce((total, value) => total += value, 0)
}

console.log('Part 1', part1())
console.log('Part 2', part2())
