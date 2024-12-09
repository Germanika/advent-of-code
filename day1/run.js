import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const lines = input.split('\n')

let list1 = [],
list2 = []

lines.forEach(line => {
  const [a,b] = line.split('   ')
  list1.push(Number(a))
  list2.push(Number(b))
})
list1 = list1.sort()
list2 = list2.sort()

const part1 = () => {
  // smallest in left list with smallest in right
  // find distance between pairs
  // add up the distances
  const getDist = (a, b) => Math.abs(a - b)

  const total = list1.reduce((sum, num, index) => {
    return sum + getDist(num, list2[index])
  }, 0)

  return total
}

const part2 = () => {
  // for each number in the left list:
  // count how many times it appears in the right list
  // number * appearances in right +=
  return list1
    .reduce((total, num) =>
      total + num * list2.filter(b => b === num).length
    , 0)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
