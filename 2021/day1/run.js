import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n').map(line => Number(line))

const part1 = () => {
  let increasedCount = 0
  let previousLine

  lines.forEach(line => {
    if (!previousLine) previousLine = line
    else {
      if (line > previousLine) increasedCount++
      previousLine = line
    }
  })

  return increasedCount
}

const part2 = () => {
  let start=0, end=2;
  let previousWindow;
  let result = 0;
  while (end <= lines.length) {
    const windowSum = lines[start] + lines[start + 1] + lines[end]
    if (!previousWindow) previousWindow = windowSum
    else {
      if (windowSum > previousWindow) {
        result++
      }
      previousWindow = windowSum
      start++
      end++
    }
  }
  return result;
}

console.log('Part 1', part1());
console.log('Part 2', part2());
