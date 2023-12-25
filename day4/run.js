import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const lines = input.split('\n')


const cards = lines.map(line  => {
  const [firstHalf, secondHalf] = line.split('|')
  const winning = [...(firstHalf.split(':')[1]).matchAll(/\d+/g)].map(number => Number(number))
  const scratched = [...secondHalf.matchAll(/\d+/g)].map(number => Number(number))
  const winningSet = new Set(winning)
  const matchingNumbers = scratched.filter(n => winningSet.has(n)).length
  const score = matchingNumbers ? Math.pow(2, matchingNumbers - 1) : 0
  return {score, matchingNumbers, count: 1}
})

const part1 = () => {
  return cards.reduce((total, {score}) => total + score, 0)
}

const part2 = () => {
  cards.forEach((card, index) => {
    const {count, matchingNumbers} = card
    for (let i = index + 1; i <= index + matchingNumbers; i++) {
      cards[i] = {...cards[i], count: cards[i].count + count}
    }
  })
  return cards.reduce((total, card) => total + card.count, 0)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
