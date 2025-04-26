import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n').filter(x => x)

const getComplement = n => n.split('').map(digit => digit === '0' ? '1' : '0').join('');
const getDecimal = x => parseInt(x, 2)

const getOnes = (list) => {
  let ones = new Array(list[0].length).fill(0)
  list.forEach(line => {
    line.split('').map((digit, index) => {
      if (digit === '1') ones[index] += 1
    })
  })
  return ones
}

const part1 = () => {
  const ones = getOnes(lines);
  let gamma = ones.map(digit => digit > (lines.length/2) ? '1' : '0').join('')
  const epsilon = getComplement(gamma)
  return getDecimal(gamma) * getDecimal(epsilon)
}

const part2 = () => {
  const findOxy = (list, index) => {
    const ones = getOnes(list);
    if (list.length === 1 || index > list[0].length) return list[0]
    const digit = ones[index] >= list.length/2 ? '1' : '0';
    const nextList = list.filter(n => n[index] === digit)
    return findOxy(nextList, index + 1)
  }

  const findCo2 = (list, index) => {
    const ones = getOnes(list);
    if (list.length === 1 || index > list[0].length) return list[0]
    const digit = ones[index] >= list.length/2 ? '0' : '1';
    const nextList = list.filter(n => n[index] === digit)
    return findCo2(nextList, index + 1)
  }
  let oxy = findOxy(lines, 0),
    co2 = findCo2(lines, 0);
    return getDecimal(oxy) * getDecimal(co2)
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())

