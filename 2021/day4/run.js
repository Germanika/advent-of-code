import fs from 'fs'

const lines = fs.readFileSync('input.txt', 'utf8').toString().split('\n')

const play = lines[0].split(',')
// Each board's line should look like:
// [
//   { marked: false, value: '6' },
//   { marked: false, value: '10' },
//   { marked: false, value: '3' },
//   { marked: false, value: '18' },
//   { marked: false, value: '5' }
// ],

const parseBoards = () => {
  let boards = []
  let board = 0
  lines.slice(2).forEach(line => {
    if (line === '') {
      // next board!
      board++
    } else {
      const boardLine = line.split(' ').filter(x => x !== '').map(value => ({ marked: false, value }))
      boards[board] = [...(boards[board] || []), boardLine]
    }
  })
  return boards
}

const isWinningBoard = (board) => {
  // check rows
  const winningRow = !!board.find(row => row.every(({marked}) => marked))

  let winningCol = false
  for (let col = 0; col < board[0].length; col++) {
    if (board.every(row => row[col].marked == true)) {
      winningCol = true
    }
  }

  return winningRow || winningCol
}

const getUnmarkedSum = board => {
  let total = 0
  board.forEach(row => {
    row.forEach(col => {
      if (!col.marked) {
        total += Number(col.value)
      }
    })
  })
  return total
}

const markBoard = (board, number) => {
  board.forEach((row, i) => {
    row.forEach((col, j) => {
      if (col.value === number) {
        board[i][j].marked = true
      }
    })
  })
}

const part1 = () => {
  let boards = parseBoards()
  // play until we find a winner
  let winningBoard, winningNumber
  play.find(number => {
    return boards.find((board, index) => {
      markBoard(board, number)
      if (isWinningBoard(board)) {
        winningBoard = index
        winningNumber = number
        return true
      }
    })
  })
  const sum = getUnmarkedSum(boards[winningBoard])

  return sum * winningNumber
}

const part2 = () => {
  let boards = parseBoards()
  // play until we find a winner
  let latestWinner, winningNumber
  let winners = new Set()

  play.forEach(number => {
    return boards.forEach((board, index) => {
      if (!winners.has(index)) {
        markBoard(board, number)
        if (isWinningBoard(board)) {
          latestWinner = index
          winningNumber = number
          winners.add(index)
        }
      }
    })
  })
  const sum = getUnmarkedSum(boards[latestWinner])
  console.log('last winner', latestWinner)
  console.log('last number', winningNumber)
  console.log('sum', sum)

  return sum * winningNumber
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())

