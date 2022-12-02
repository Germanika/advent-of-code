import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n')
const rounds = lines.map(line => line.split(' '));

const part1 = () => {
  // A,X -> rock, 1
  // B,Y -> paper, 2
  // C,Z -> scissors, 3
  // lose -> 0
  // draw -> 3
  // win -> 6


  const moveScores = {
    'X': 1,
    'Y': 2,
    'Z': 3,
  }

  const winScores = {
    'A': {
      'X': 3,
      'Y': 6,
      'Z': 0,
    },
    'B': {
      'X': 0,
      'Y': 3,
      'Z': 6,
    },
    'C': {
      'X': 6,
      'Y': 0,
      'Z': 3,
    },
  }

  const getScore = (move, counter) => {
    let score = 0;
    score += moveScores[counter];
    score += winScores[move][counter]
    return score;
  }
  
  return rounds.reduce((sum, [move, counter]) => sum + getScore(move, counter), 0)
}

const part2 = () => {
  // A -> rock, 1
  // B -> paper, 2
  // C -> scissors, 3

  // X, lose -> 0
  // Y, draw -> 3
  // Z, win -> 6


  const winScores = {
    'X': 0,
    'Y': 3,
    'Z': 6,
  }

  const moveScores = {
    'A': {
      'X': 3,
      'Y': 1,
      'Z': 2,
    },
    'B': {
      'X': 1,
      'Y': 2,
      'Z': 3,
    },
    'C': {
      'X': 2,
      'Y': 3,
      'Z': 1,
    },
  }

  const getScore = (move, counter) => {
    let score = 0;
    score += winScores[counter]
    score += moveScores[move][counter]

    return score;
  }

  return rounds.reduce((sum, [move, counter]) => sum + getScore(move, counter), 0)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
