import fs from 'fs'

let [rules, ticket, others] =
  fs.readFileSync('input.txt', 'utf8')
    .toString()
    .split('\n\n')

const getRange = rangeString => {
  let [min, max] = rangeString.split('-')
  return { min: Number(min), max: Number(max) }
}

const getRuleFromLine = line => {
  const [name, ranges] = line.split(': ')
  const [range1, range2] = ranges.split(' or ')
  return (
    { name
    , range1: getRange(range1)
    , range2: getRange(range2)
    }
  )
}

rules = rules.split('\n').map(getRuleFromLine)
ticket = ticket.split('\n')[1].split(',').map(x => Number(x))
others = others.split('\n').slice(1).map(arr => arr.split(',').map(x => Number(x)))

const numInRange = (num, { min, max }) => num >= min && num <= max

const part1 = () => {
  let invalid = 0
  console.log('rules', rules)

  const validate = ticket => {
    ticket.forEach(num => {
      const validNumber = rules.some(({range1, range2}) =>
        numInRange(num, range1) || numInRange(num, range2)
      )
      if (!validNumber) {
        console.log('invalid', num)
        invalid += num
      }
    })
  }

  others.forEach(ticket => {
    validate(ticket)
  })

  return invalid
}

const part2 = () => {
  const validate = ticket =>
    ticket.every( num =>
      rules.some(({range1, range2}) =>
        numInRange(num, range1) || numInRange(num, range2)
      )
    )

  const validTickets = others.filter(ticket => validate(ticket))

  // start at first field, at each ticket, adjust set of possible rules that match
  // when we get to one rule in the set, add mapping of ruleIndex => index
  // rule => index

  const getPossibleRules = number => {
    let potential = []
    rules.forEach(rule => {
      if (numInRange(number, rule.range1) || numInRange(number, rule.range2)) {
        potential.push(rule.name)
      }
    })
    return potential
  }

  const ruleMap = new Map() // rule => index of field
  const accountedFields = new Set() // all the fields we've counted
  const possibleMap = new Map() // rule => possible fields

  for (let i = 0; i < validTickets[0].length; i++) {
    let potential = getPossibleRules(ticket[i])
    const found = validTickets.some(ticket => {
      const candidates = new Set(getPossibleRules(ticket[i]))
      potential = potential.filter(r => candidates.has(r))
      return potential.length === 1
    })
    if (found) {
      ruleMap.set(potential[0], i)
      accountedFields.add(i)
    } else {
      potential.forEach(rule => {
        const existing = possibleMap.get(rule) || []
        possibleMap.set(rule, [...existing, i])
      })
    }
  }

  let lastlen = possibleMap.size
  while (possibleMap.size > 0) {
    possibleMap.forEach((values, rule) => {
      if (ruleMap.has(rule)) possibleMap.delete(rule)
      else {
        let fields = values.filter(f => !accountedFields.has(f))
        if (fields.length === 1) {
          ruleMap.set(rule, fields[0])
          accountedFields.add(fields[0])
          possibleMap.delete(rule)
        } else {
          possibleMap.set(rule, fields)
        }
      }
    })
    if (lastlen === possibleMap.size) break // break infinite loop
    lastlen = possibleMap.size
  }
  if (lastlen > 0) {
    console.error('possible map', possibleMap)
    throw new Error('no thingy found')
  }

  let total = 1
  rules.filter(rule => rule.name.startsWith('departure'))
    .forEach(rule => {
      let x = ticket[ruleMap.get(rule.name)]
      total *= x
    })
  return total
}

console.log('Part 1', part1())
console.log('Part 2', part2())

