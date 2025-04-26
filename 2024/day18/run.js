import fs from "fs";
import { log, time, timeEnd } from "console";

const args = process.argv.slice(2);
const inputFile = args[0] ?? "input.txt";

const input = fs.readFileSync(inputFile, "utf8").toString();
const coords = input.split("\n").map((line) => line.split(",").map(Number));

const dimension = 71;
const grid = Array.from({ length: dimension }, () =>
  Array.from({ length: dimension }, () => ".")
);
const start = [0, 0];
const end = [dimension - 1, dimension - 1];

const printGrid = (grid) => {
  grid.forEach((row) => {
    log(row.join(""));
  });
};

const dropBytes = (grid, n) => {
  const newGrid = grid.map((row) => row.slice());
  for(let i = 0; i < n; i++) {
    const [x, y] = coords[i];
    newGrid[x][y] = "#";
  }
  return newGrid;
};

const getKey = ([x, y]) => `${x},${y}`;

const dijkstra = (grid, start, end) => {
  const queue = [start];
  const distance = new Map();

  const visitable = (x, y) => {
    if (x < 0 || x >= dimension || y < 0 || y >= dimension) return false;
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

  return distance.get(getKey(end));
};

const part1 = () => {
  const testGrid = dropBytes(grid, 21);

  return dijkstra(testGrid, start, end);
};

const part2 = () => {
  let left = 0;
  let right = coords.length - 1;
  let lastValid = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const testGrid = dropBytes(grid, mid);
    const d = dijkstra(testGrid, start, end);

    if (d === Infinity) {
      right = mid - 1;
    } else {
      lastValid = mid;
      left = mid + 1;
    }
  }

  return coords[lastValid];
};

time("part 1");
log(part1());
timeEnd("part 1");

time("part 2");
log(part2());
timeEnd("part 2");
