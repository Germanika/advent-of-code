import fs from 'fs'
import {dir, log, time, timeEnd} from 'console'
import exp from 'constants';

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const codes = input.split('\n').map(line => line.split(''))

const memo = func => {
  let cache = new Map()
  return (...args) => {
    const key = args.join(',')
    if (cache.has(key)) return cache.get(key)
    const res = func(...args)
    cache.set(key, res)
    return res
  }
}

// const keypad = {
//   pos: 'A',
//   adjacent: {
//     'A': ['0', '3'],
//     '0': ['A', '2'],
//     '1': ['2', '4'],
//     '2': ['0', '1', '3', '5'],
//     '3': ['A', '2', '6'],
//     '4': ['1', '5', '7'],
//     '5': ['2', '4', '6', '8'],
//     '6': ['3', '5', '9'],
//     '7': ['4', '8'],
//     '8': ['5', '7', '9'],
//     '9': ['6', '8']
//   },
//   // distances: ??
// }

const dirs = {
  DOWN: 'v',
  UP: '^',
  RIGHT: '>',
  LEFT: '<',
  SUBMIT: 'A'
}

const keypad = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  [ '', '0', 'A']
]

const dirpad = [
  ['', '^', 'A'],
  ['<', 'v', '>']
]

/**
 * door keypad:
 * - starts pointed at A (3,2)
 * - (3,0) is out of bounds
 * if x=3 => ^V first
 * if x<3 => <> first
+---+---+---+
| 7 | 8 | 9 |
+---+---+---+
| 4 | 5 | 6 |
+---+---+---+
| 1 | 2 | 3 |
+---+---+---+
    | 0 | A |
    +---+---+

Directional pad robot 1:
- starts pointed at A (0,2) if x=0 -> ^V first, if x=1 => <> first
- (0,0) is out of bounds
    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+

-- DO NOT point robots at gaps, out of bounds = panic.
 */


const getShortestPaths = (grid, start, target) => {
    const queue = []
    const startingPath = [start]
  
    const visitable = ([x, y]) => {
      if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) return false;
      if (grid[x][y] === "") return false;
      return true;
    };
  
    const getAdjacent = ([x, y]) => {
      const adj =  [
        [x, y + 1, dirs.RIGHT],
        [x + 1, y, dirs.DOWN],
        [x, y - 1, dirs.LEFT],
        [x - 1, y, dirs.UP],
      ]
      return adj.filter(visitable)
    };
  
    queue.push(startingPath)
    while (queue.length) {
      const path = queue.shift()
      const next = path.at(-1)
      const [cx, cy] = next;

      if (grid[cx][cy] === target) {
        // return all paths that end at tart
        const viable = queue
          .filter(p => {
            const [cx, cy] = p.at(-1)
            return grid[cx][cy] === target
          })
        return [path, ...viable].map(path => {
          let p = path.slice(1).map(([,,dir]) => dir)
          p.push('A')
          return p
        })
      }

      const adjacent = getAdjacent(next);
      adjacent.forEach(adj => {
        let newPath = [...path, adj]
        queue.push(newPath)
      })
    }
}

const shortestPaths = new Map()

/**
 * Getting all possible shortest paths from one point to another on the keypad
 */
const keypadBtn = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A']
keypad.forEach((row, x) => row.forEach((n, y) => keypadBtn.forEach(btn => {
  const start = [x, y]
  const target = btn
  const key = [n,btn].join(',')
  if (n !== '') {
    const paths = getShortestPaths(keypad, start, target)
    shortestPaths.set(key, paths)
  }
})))

const dirpadBtns = ['v','^','<','>','A']
dirpad.forEach((row, x) => row.forEach((n, y) => dirpadBtns.forEach(btn => {
  const start = [x, y]
  const target = btn
  const key = [n,btn].join(',')
  if (n !== '') {
    const paths = getShortestPaths(dirpad, start, target)
    shortestPaths.set(key, paths)
  }
})))

const getInputsForCode = (code, index = 0, prev = 'A', currPath = []) => {
  if (index === code.length) {
    return [currPath]
  }
  const key = [prev, code[index]].join(',')
  const viablePaths = shortestPaths.get(key)
  let res = []
  viablePaths.forEach(path => {
    let inputs = getInputsForCode(code, index + 1, code[index], [...currPath, ...path])
    res.push(...inputs)
  })
  return res
}

const getShortestInputForDepth = memo((input, depth) => {
  if (depth === 0) return input.length

  const nextInputs = getInputsForCode(input)

  let min = Infinity
  nextInputs.forEach(viableInput => {
    // janky splitting into sub-instructions
    let chunks = viableInput.join('').split('A')
    chunks = chunks.map((chunk, i) => {
      if (i === chunks.length - 1) return ''
      else if (chunk === '') return ['A']
      return [...chunk, 'A']
    }).filter(x => x)

    let l = chunks.reduce((total, chunk) => {
      return total + getShortestInputForDepth(chunk, depth - 1)
    }, 0)
    min = Math.min(l, min)
  })

  return min
})


const part1 = () => {
  // find shortest sequence to get the five codes
  // map numpad to robot 1
  // map keypad1 to robot 2
  // map keypad2 to robot 3
  // map keypad3 input

  // get all possible shortest paths from one ke to another
  // don't bother storing the 'A'?
  // ex: '0,3' => ['>^', '^>']
  // TODO: remove zigzag paths

  // num = O29A -> 29
  // len = length of sequence for keypad3
  // complexity = len * num
  // ans = sum(complexity)

  return codes
    .map(code => getShortestInputForDepth(code, 3))
    .reduce((total, len, i) => {
      const num = Number(codes[i].slice(0, -1).join(''))
      return total += len * num
    }, 0)
}

const part2 = () => {
  let tot = codes
  .map(code => getShortestInputForDepth(code, 26))
  .reduce((total, len, i) => {
    const num = Number(codes[i].slice(0, -1).join(''))
    return total += len * num
  }, 0)
return tot
}


time('part 1')
log(part1())
timeEnd('part 1')

time('part 2')
log(part2())
timeEnd('part 2')
