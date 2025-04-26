import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const [rulesInput, updatesInput] = input.split('\n\n')

// Array of [first,second] pairs
const rules = rulesInput.split('\n').map(line => line.split('|').map(n => Number(n)))

// [1,2,3,4]
const updates = updatesInput.split('\n').map(line => line.split(',').map(n => Number(n)))

const getMiddle = arr => {
  const index = (arr.length - arr.length % 2) / 2
  return arr[index]
}

const addMiddles = arr => arr.reduce((total, curr) => total + getMiddle(curr), 0)

const satisfiesRule = (arr, rule) => {
  const first = arr.indexOf(rule[0])
  const second = arr.indexOf(rule[1])
  return first === -1 || second === -1 || first < second
}

const satisfiesAllRules = arr => rules.every(rule => satisfiesRule(arr, rule))

const part1 = () => {
  const filtered = updates.filter(satisfiesAllRules)
  return addMiddles(filtered)
}

const part2 = () => {
  // 6 should come before [...]
  // 6 => [1,4,5,3]
  const ruleMap = new Map()
  rules.forEach(([first,second]) => {
    if (ruleMap.get(first)) {
      ruleMap.set(first, [...ruleMap.get(first), second])
    } else {
      ruleMap.set(first, [second])
    }
  })

  const filtered = updates.filter(update => !satisfiesAllRules(update))
  const fixed = filtered
    .map(update => {
      let res = []
      update.forEach(num => {
        const rule = ruleMap.get(num)
        // Place as close to the end as allowable
        if (!rule) {
          res.push(num)
        } else {
          const idx = res.findIndex(el => rule.includes(el))
          if (idx == -1) res.push(num)
          else res.splice(idx, 0, num)
        }
      })
      return res
    })
  return addMiddles(fixed)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
