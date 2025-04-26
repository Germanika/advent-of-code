import fs from 'fs'
import {log, time, timeEnd} from 'console'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'


const input = fs.readFileSync(inputFile, 'utf8').toString();
const grid = input.split('\n').map(line => line.split(''))
let start, end
const pointsOnTrack = new Set()
const getKey = ([x, y]) => `${x},${y}`;
const track = []
const distances = new Map()

grid.forEach((row, x) => row.forEach((val, y) => {
  if (val !== '#') pointsOnTrack.add(getKey([x, y]))
  if (val === 'S') {
    start = [x, y]
  }
}))

const isOnTrack = ([x, y]) => pointsOnTrack.has(getKey([x, y]))

const getNext = ([x, y], [px, py]) => {
  const adjacent = []
  if (isOnTrack([x + 1, y])) adjacent.push([x + 1, y])
  if (isOnTrack([x - 1, y])) adjacent.push([x - 1, y])
  if (isOnTrack([x, y + 1])) adjacent.push([x, y + 1])
  if (isOnTrack([x, y - 1])) adjacent.push([x, y - 1])
  
  return adjacent.find(([x, y]) => x !== px || y !== py)
};


let currentPoint = start
let prev = [-1, -1]
let dist = 0
while (!end) {
  const [x, y] = currentPoint
  distances.set(getKey(currentPoint),  dist)
  track.push(currentPoint)
  if (grid[x][y] === 'E') {
    end = currentPoint
  }
  const next = getNext(currentPoint, prev)
  prev = currentPoint
  currentPoint = next
  dist ++
}

const getManhattanPoints = ([x, y], r) => {
  let points = []
  if (r === 0) return []
  for (const offset of Array(r).keys()) {
    const inv = r - offset
    points.push([x + offset, y + inv])
    points.push([x + inv, y - offset])
    points.push([x - offset, y - inv])
    points.push([x - inv, y + offset])
  }
  return points.filter(isOnTrack)
}

const cheatsFromPoint = (p1, minTimeSaved, length) => {
  let cheatCount = 0
  const d1 = distances.get(getKey(p1))
  getManhattanPoints(p1, length).forEach(p2 => {
    const d2 = distances.get(getKey(p2))
    const timeSaved = d2 - d1 - length
    if (timeSaved >= minTimeSaved) cheatCount++
  })
  return cheatCount
}

const cheatsOfLength = (minTimeSaved, length) => 
  track.reduce((total, p) => total + cheatsFromPoint(p, minTimeSaved, length), 0)

const getCheatCount = (minTimeSaved, maxCheatLength) => {
  let totalCheats = 0
  for (const cheatLength of Array(maxCheatLength).keys()) {
    totalCheats += cheatsOfLength(minTimeSaved, cheatLength + 1)
  }
  return totalCheats
}

const part1 = () => {
  return getCheatCount(100, 2)
}

const part2 = () => {
  const minTimeSaved = 100
  const maxCheatLength = 20
  return getCheatCount(minTimeSaved, maxCheatLength)
}


time('part 1')
log(part1())
timeEnd('part 1')

time('part 2')
log(part2())
timeEnd('part 2')
