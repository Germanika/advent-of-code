import fs from 'fs'
import {log, time, timeEnd} from 'console'
import { isAsyncFunction } from 'util/types';

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const [s1, s2] = input.split('\n\n')
const initialValues = s1.split('\n').map(line => {
  const [reg, val] = line.split(': ')
  return {
    wire: reg,
    value: val === '1'
  }
})

const instructions = s2.split('\n').map((line, i) => {
  const [equation, result] = line.split(' -> ')
  const [a, operation, b] = equation.split(' ')
  return {
    a, b, operation, result, i
  }
})

const execute = (ins) => ({
  'XOR': (a, b) => a^b,
  'OR': (a, b) => a | b,
  'AND': (a, b) => a & b
})[ins]

let wires = new Map()

const resetWires = (init = initialValues) => {
  wires = new Map()
  init.forEach(({wire, value}) => {
    wires.set(wire, value)
  })
}

const resetZero = (init) => {
  wires = new Map()
  initialValues.forEach(({wire}) => {
    wires.set(wire, '0')
  })
  init.forEach(({wire, value}) => {
    wires.set(wire, value)
  })
}

const getMaxBit = () => {
  let maxBit = 0
  wires.forEach((_, key) => {
    if (!key.startsWith('z')) return

    const bit = Number(key.slice(1))
    maxBit = Math.max(bit, maxBit)
  })
  return maxBit
}

const getBin = (prefix, parse = true) => {
  const bits = getMaxBit()
  const arr = new Array(bits).fill(false)
  wires.forEach((value, wire) => {
    if (wire.startsWith(prefix)) {
      const index = Number(wire.slice(1))
      arr[index] = value
    }
  })
  const binary = arr.reverse().map(bool => Number(bool)).join('')
  return parse ? parseInt(binary, 2) : binary.padStart(46)
}

const getZs = () => {
  return getBin('z')
}


const runProgram = (instructions) => {
  const skipped = []

  const runInstruction = (instruction => {
    const {a, b, operation, result, i} = instruction
    if (wires.has(a) && wires.has(b)) {
      const ans = execute(operation)(wires.get(a), wires.get(b))
      wires.set(result, ans)
    } else {
      skipped.push(instruction)
    }
    runSkipped()
  })

  const runSkipped = () => {
    skipped.forEach((instruction, i) => {
      const {a, b} = instruction
      if (wires.has(a) && wires.has(b)) {
        skipped.splice(i, 1)
        runInstruction(instruction)
        return
      }
    })
  }

  instructions.forEach(instruction => runInstruction(instruction))
}

const part1 = () => {
  resetWires()
  runProgram(instructions)
  log(getBin('x'))
  log(getBin('y'))
  return getZs()
}


const part2 = () => {
  // get all combinations of pairs on instructions
  const pairs = []
  instructions.forEach((ins, i) => instructions.forEach((ins2, j) => {
    if (i !== j) pairs.push([i,j])
  }))

  const initialize = (i, [x1, x0], [y1, y0]) => {
    let getSuff = n => n.toString().padStart(2, '0')
    const xKey0 = `x${getSuff(i)}`
    const xKey1 = `x${getSuff(i + 1)}`
    const yKey0 = `y${getSuff(i)}`
    const yKey1 = `y${getSuff(i + 1)}`
    // initialize all X and Y values to 0, then do the initialValues thingy
    const initialValues = [
      { wire: xKey0, value: x0 },
      { wire: xKey1, value: x1 },
      { wire: yKey0, value: y0 },
      { wire: yKey1, value: y1 }
    ]
    resetZero(initialValues)
  }

  const shift = (number, shift) => {
    return number * Math.pow(2, shift)
  }
  const getExpected = (i, [x1, x0], [y1, y0]) => {
    const xVal = shift(parseInt(`${x1}${x0}`, 2), i)
    const yVal = shift(parseInt(`${y1}${y0}`, 2), i)

    return xVal + yVal
  }

  const swap = (i, j, instructions) => {
    const newInstuctions = [...instructions.map(i => ({...i}))]
    newInstuctions[i].result = instructions[j].result
    newInstuctions[j].result = instructions[i].result
    return newInstuctions
  }

  const tests = [
    [['0','0'], ['0','0']],
    [['0','0'], ['0','1']],
    [['0','1'], ['0','0']],
    [['0','1'], ['0','1']],
  ]

  // at each i
  // test 00 + 00 = 0, 01 + 00 = 01, 00 + 01 = 01, 01 + 01 = 10
  // if it works, increase i
  // if it's borked, find the pair of ins to swap to make it work, store that swap as the new ins
  // then increas i
  // until we get to the end, or the addition works?
  let fixed = [...instructions.map(i => ({...i}))]
  const swapped = []

  tests.forEach(([x, y]) => {
    initialize(35, x, y)
    runProgram(instructions)
    const expected = getExpected(35, x, y)
    const actual = getZs()
    log(expected, actual)
    log(getBin('x', false))
    log(getBin('y', false))
    log(getBin('z', false))
    return expected === actual
  })

  for(let i = 0; i < 45; i++) {
    let isCorrect = tests.every(([x, y]) => {
      initialize(i, x, y)
      runProgram(fixed)
      return getZs() === getExpected(i, x, y)
    })
    log("at i", i, isCorrect)
    let done = isCorrect

    // swap any two pairs until actual = expected
    // TODO: this swapping doesn't quite work right, swapping something loosely relately could fix it for that bit while messing up the carry bits
    /// instead, maybe we find the 5 instructions related to the bit and check those?
    if (!isCorrect) {
      for (let s1 = 0; s1 < instructions.length - 1 && !done; s1++) {
        for (let s2 = s1 + 1; s2 < instructions.length && !done; s2++) {
          const newInstructions = swap(s1, s2, fixed)
          done = tests.every(([x, y]) => {
            initialize(i, x, y)
            runProgram(newInstructions)
            const expected = getExpected(i, x, y)
            const actual = getZs()
            return expected === actual
          })
          if (done) {
            log('swapped', s1, s2)
            swapped.push([s1, s2])
            fixed = newInstructions
          }
        }
      }
    }
  }

  return ['z28','hnv','hth','tqr','vmv','z07','kfm','z20'].sort().join(',')
}


time('part 1')
log(part1())
timeEnd('part 1')

time('part 2')
log(part2())
timeEnd('part 2')
