import fs from 'fs'
import {log, time, timeEnd} from 'console'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const track = input.split('\n').map(line => line.split(''))
let start, end

const removableWalls = []
const spaces = []
const free = ['.','S','E']

track.forEach((row, x) => row.forEach((val, y) => {
  if (val === 'S') {
    start = [x, y]
    spaces.push(start)
  } else if (val === 'E') {
    end = [x, y]
    spaces.push(end)
  }
  else if (val === '.') {
    spaces.push([x, y])
  } else if (x > 0 && x < track.length - 1 && y > 0 && y < track[0].length - 1) {
    if (free.includes(track[x - 1][y]) && free.includes(track[x + 1][y])) {
      removableWalls.push([x,y])
    } else if (free.includes(track[x][y-1]) && free.includes(track[x][y+1])) {
      removableWalls.push([x,y])
    }
  }
}))

const getKey = ([x, y]) => `${x},${y}`;

const dijkstra = (grid, start) => { 
  const queue = [start];
  const distance = new Map();

  const visitable = (x, y) => {
    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) return false;
    if (grid[x][y] === "#") return false;
    return true;
  };

  const getAdjacent = ([x, y]) => {
    const adjacent = [];
    if (visitable(x + 1, y)) adjacent.push([x + 1, y]);
    if (visitable(x - 1, y)) adjacent.push([x - 1, y]);
    if (visitable(x, y + 1)) adjacent.push([x, y + 1]);
    if (visitable(x, y - 1)) adjacent.push([x, y - 1]);
    return adjacent;
  };

  grid.forEach((row, x) => row.forEach((_, y) => distance.set(getKey([x, y]), Infinity)))
  distance.set(getKey(start), 0);

  // janky priority queue again
  const getNext = () => {
    let min = Infinity;
    let minPoint = null;
    let toRemove;
    queue.forEach(([x, y], i) => {
      const key = getKey([x, y]);
      if (distance.get(key) < min) {
        min = distance.get(key);
        minPoint = [x, y];
        toRemove = i;
      }
    });
    queue.splice(toRemove, 1);
    return minPoint;
  };

  while (queue.length) {
    const next = getNext();
    const [cx, cy] = next;
    const adjacent = getAdjacent([cx, cy]);

    adjacent.forEach(([nx, ny]) => {
      const currentDistance = distance.get(getKey([cx, cy]));
      const newDistance = currentDistance + 1;
      const key = getKey([nx, ny]);
      if (newDistance < distance.get(key)) {
        distance.set(key, newDistance);
        queue.push([nx, ny]);
      }
    });
  }

  return distance;
};

const timeBetween = ([x1,y1], [x2,y2]) => {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1)
}

const distances = dijkstra(track, start)
const getCheatCount = (minTimeSaved, maxCheatLength) => {
  let cheatCount = 0
  spaces.forEach((p1) => {
    const d1 = distances.get(getKey(p1))
    spaces.forEach(p2 => {
      const t = timeBetween(p1, p2)
      const d2 = distances.get(getKey(p2))
      const timeSaved = d2 - d1 - t
      if (timeSaved >= minTimeSaved && t <= maxCheatLength) {
        cheatCount++
      }
    })
  })
  return cheatCount
}

const part1 = () => {
  // get distance to E
  // const distances = dijkstra(track, start)
  // const initialDistance = distances.get(getKey(end))
  // // find all the cheats that would cut down on d(E)
  // let cheats = 0
  // removableWalls.forEach(([x, y]) => {
  //   track[x][y] = '.'
  //   let dist = dijkstra(track, start)
  //   let timeSaved = initialDistance - dist.get(getKey(end))
  //   if (timeSaved >= 100) {
  //     cheats++
  //   }
  //   track[x][y] = '#'
  // })
  // return cheats
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
