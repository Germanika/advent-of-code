import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const grid = input.split('\n').map(line => line.split(""))

const part1 = () => {
  // when finding an x
  // check back, backup, up, forup, for, fordown, down, backdown
  // at each 'xmas', add 1
  const countXmas = (i,j) => {
    let count = 0
    const add = test => {
      if(test === 'XMAS') count++
    }
    const ilen = grid.length
    const jlen = grid[0].length

    // ew
    const up = i-3>=0 ? grid[i][j] + grid[i-1][j] + grid[i-2][j] + grid[i-3][j] : ''
    const backup = i-3>=0 && j-3>=0 ? grid[i][j] + grid[i-1][j-1] + grid[i-2][j-2] + grid[i-3][j-3] : ''
    const back = j-3>=0 ? grid[i][j] + grid[i][j-1] + grid[i][j-2] + grid[i][j-3] : ''
    const downBack= i+3<ilen && j-3>=0 ? grid[i][j] + grid[i+1][j-1] + grid[i+2][j-2] + grid[i+3][j-3] : ''
    const down = i+3<ilen ? grid[i][j] + grid[i+1][j] + grid[i+2][j] + grid[i+3][j] : ''
    const fwdDown = i+3<ilen && j+3<jlen ? grid[i][j] + grid[i+1][j+1] + grid[i+2][j+2] + grid[i+3][j+3] : ''
    const fwd = j+3<jlen ? grid[i][j] + grid[i][j+1] + grid[i][j+2] + grid[i][j+3] : ''
    const fwdUp = i-3>=0 && j+3<jlen ? grid[i][j] + grid[i-1][j+1] + grid[i-2][j+2] + grid[i-3][j+3] : ''

    add(up)
    add(backup)
    add(back)
    add(downBack)
    add(down)
    add(fwdDown)
    add(fwd)
    add(fwdUp)
    return count
  }


  let total = 0
  grid.forEach((row,i) => row.forEach((value, j) => {
    if (value === 'X') {
      const count = countXmas(i, j)
      total += count
    }
  }))
  return total
}

const part2 = () => {
  const countXmas = (i,j) => {
    let count = 0

    const test = x => x === 'MAS' || x ==='SAM'

    const ilen = grid.length
    const jlen = grid[0].length

    if (i <= 0 || j <= 0 || i >= ilen - 1 || j >= jlen-1) return 0

    const rightDown = grid[i-1][j-1] + grid[i][j] + grid[i+1][j+1]
    const rightUp = grid[i+1][j-1] + grid[i][j] + grid[i-1][j+1]

    if (test(rightDown) && test(rightUp)) {
      count ++
    }
    return count
  }


  let total = 0
  grid.forEach((row,i) => row.forEach((value, j) => {
    if (value === 'A') {
      const count = countXmas(i, j)
      total += count
    }
  }))
  return total
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
