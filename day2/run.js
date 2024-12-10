import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const reports = input.split('\n').map(line => line.split(" ").map(n => Number(n)))

const isIncreasing = (report) =>
  report.every((num, index) => {
    if (index === 0) return true
    const diff = num - report[index - 1]
    return diff <=3 && diff > 0
  })

const isDecreasing = (report) => 
  report.every((num, index) => {
    if (index === 0) return true
    const diff = report[index - 1] - num
    return diff <= 3 && diff > 0
  })

const isSafe = (report) => {
  if (report[1] > report[0]) {
    return isIncreasing(report)
  }

  if(report[1] < report[0]) {
    return isDecreasing(report)
  }
  return false
}

const part1 = () => {
  return reports.reduce((total, report) => {
    const safe = isSafe(report)
    return safe ? total + 1 : total;
  }, 0)
}

const part2 = () => {
  // for each case of removing an element, is the resulting report safe?
  return reports.reduce((total, report) => {
    let safe = isSafe(report) || report.some((_, index) => {
      const damped = [...report]
      damped.splice(index, 1)
      return isSafe(damped)
    })
    return safe ? total + 1 : total
  }, 0)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
