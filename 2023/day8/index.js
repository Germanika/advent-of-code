import fs from "fs";
import { log, time, timeEnd } from "console";
import { lcm } from "../../utilities/math.mjs";

const args = process.argv.slice(2);
const inputFile = args[0] ?? "input.txt";

const input = fs.readFileSync(inputFile, "utf8").toString();
const [dirs, lines] = input.split("\n\n");

// node -> [left, right]
const nodes = new Map();

lines
  .split("\n")
  .filter((x) => x)
  .map((line) => {
    const [node, rest] = line.split(" = ");
    const [left, right] = rest.split(", ");
    const clean = (n) => n.replace("(", "").replace(")", "");
    nodes.set(node, [clean(left), clean(right)]);
  });

function* dirGen(dirs) {
  let nextIndex = 0;
  while (true) {
    yield dirs[nextIndex];
    nextIndex = (nextIndex + 1) % dirs.length;
  }
}

const part1 = () => {
  const dir = dirGen(dirs.split(""));
  let steps = 0;
  let node = "AAA";
  while (node !== "ZZZ") {
    const nextDir = dir.next().value === "L" ? 0 : 1;
    node = nodes.get(node)[nextDir];
    ++steps;
  }

  return steps;
};

const part2 = () => {
  const dir = dirGen(dirs.split(""));

  let steps = 0;
  let currNodes = Array.from(nodes.keys()).filter((node) => node.endsWith("A"));
  let stepsToZ = new Array(currNodes.length);

  const foundEnd = () => {
    currNodes.forEach((node, i) => {
      if (node.endsWith("Z")) {
        stepsToZ[i] = steps;
      }
    });
    return currNodes.every((_, i) => !!stepsToZ[i]);
  };

  while (!foundEnd()) {
    const nextDir = dir.next().value === "L" ? 0 : 1;
    currNodes = currNodes.map((node) => nodes.get(node)[nextDir]);
    steps++;
  }

  // lowest common multiple
  return lcm(...stepsToZ);
};

time("Part 1");
log("Part 1:", part1());
timeEnd("Part 1");

time("Part 2");
log("Part 2:", part2());
timeEnd("Part 2");
