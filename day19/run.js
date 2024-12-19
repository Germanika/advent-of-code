import fs from "fs";
import { log, time, timeEnd } from "console";

const args = process.argv.slice(2);
const inputFile = args[0] ?? "input.txt";

const input = fs.readFileSync(inputFile, "utf8").toString();
const [towelInput, designInput] = input.split("\n\n");

const towels = towelInput.split(", ")
const designs = designInput.split("\n")

let cache = new Map();
const getPossibleDesigns = (design) => {
  if (design === "") return 1;
  if (cache.has(design)) return cache.get(design)

  const result = towels.reduce((total, towel) =>
    design.startsWith(towel)
      ? total + getPossibleDesigns(design.substring(towel.length))
      : total
  , 0)
  cache.set(design, result)
  return result;
};

const part1 = () => {
  return designs
    .map(getPossibleDesigns)
    .filter(n => n > 0)
    .length
}

const part2 = () => {
  return designs
    .map(getPossibleDesigns)
    .reduce((total, n) => total + n, 0);
}

time("part 1");
log(part1());
timeEnd("part 1");

time("part 2");
log(part2());
timeEnd("part 2");
