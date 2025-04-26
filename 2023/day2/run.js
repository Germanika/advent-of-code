import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const lines = input.split('\n')

/** Possible colours: red, green, blue
  * Format: "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
  *
  * Parsed format:
  * { id: 1
  *   sets: [
  *    {blue: 3, red: 4},
  *    {red: 1, green: 2, blue: 6},
  *    {green: 2}
  *   ]
  * }
  */

const parsed = lines.map(line => {
  let [game, sets] = line.split(': ')
  const id = Number(game.match(/\d+/))
  sets = sets
    .split('; ')
    .map(str => {
      const balls = str.split(', ')
      return balls.reduce((set, ball) => {
        const [count, colour] = ball.split(' ')
        return {...set, [colour]: Number(count)}
      }, {})
    })
  
  return {id, sets}
})

const part1 = () => {
  const bag = { 'red': 12, 'green': 13, 'blue': 14 }

  const isValid = set => 
    Object.keys(set).every(key => set[key] <= bag[key])

  return parsed.reduce((total, round) => {
    if (round.sets.every(isValid)) {
      return total + round.id
    } else {
      return total
    }
  }, 0)
}

const part2 = () => {
  
  const getMaxCountForColour = (sets, colour) => {
    let max = 0
    sets.forEach(set => {
      if (set[colour] > max) {
        max = set[colour]
      }
    })
    return max
  }

  const getBagForSets = sets => {
    return {
      'red': getMaxCountForColour(sets, 'red'),
      'green': getMaxCountForColour(sets, 'green'),
      'blue': getMaxCountForColour(sets, 'blue')
    }
  }
  
  return parsed.map(round => round.sets)
    .map(getBagForSets)
    .map(({red, green, blue}) => red * green * blue)
    .reduce((total, roundScore) => total + roundScore, 0)

}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
