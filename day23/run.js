import fs from 'fs'
import {log, time, timeEnd} from 'console'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const lines = input.split('\n').map(line => line.split('-'))

const initialGroups = new Set(lines.map(conn => conn.sort().join(',')))
const connections = new Map()
const computers = new Set()

lines.forEach(([a, b]) => {
  // maybe should be a set?
  let currA = connections.get(a) ?? []
  let currB = connections.get(b)?? []
  connections.set(a, [...currA, b])
  connections.set(b, [...currB, a])
  computers.add(a, b)
})

const expand = (groups) => {
  let expanded = new Set()
  const grs = Array.from(groups).map(g => g.split(','))
  grs.forEach((group) => {
    const newGroups = []
    computers.forEach((c1) => {
      const conns = connections.get(c1)
      if (!group.includes(c1) && group.every(c2 => conns.includes(c2))) {
        newGroups.push([...group, c1])
      }
    })
    newGroups.forEach(g => {
      expanded.add(g.sort().join(','))
    })
  })
  return expanded
}

const part1 = () => {
  // groups of 3 where a computer starts with 't'
  const groupsOf3 = expand(initialGroups)
  return Array.from(groupsOf3).filter(group => {
    return group.split(',').some(name => name.startsWith('t'))
  }).length
}

const part2 = () => {
  // find groups of 3, using groups of 2
  // find groups of 4, using groups of 3
  // find groups of 5, using groups of 4
  // keep going until we only find one group of size n
  // if we find zero groups -> probably messed up somewhere
  // return the password (sorted, comma-separated group of size max(n))
  let largestGroups = initialGroups
  while (largestGroups.size > 1) {
    log('number to expand', largestGroups.size)
    log('expanding to size', largestGroups.values().next().value.split(',').length + 1)
    largestGroups = expand(largestGroups)
  }

  return Array.from(largestGroups)[0]
}


time('part 1')
log(part1())
timeEnd('part 1')

time('part 2')
log(part2())
timeEnd('part 2')
