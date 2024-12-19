import fs from "fs";
import { log, time, timeEnd } from "console";

const args = process.argv.slice(2);
const inputFile = args[0] ?? "input.txt";

const input = fs.readFileSync(inputFile, "utf8").toString();
const [towelInput, designInput] = input.split("\n\n");

const towels = towelInput.split(", ").filter((x) => x !== "")
const designs = designInput.split("\n").filter((x) => x !== "")

const part1 = () => {
  const cache = new Map()
  const isPossible = (design, towels) => {
    if (design === "") return true
    if (cache.has(design)) return cache.get(design)

    const possible = towels.some(towel => {
      if (design.startsWith(towel)) return isPossible(design.replace(towel, ""), towels)
      return false;
    })
    cache.set(design, possible)
    return possible
  }

  return designs.filter(design => isPossible(design, towels)).length
}

const part2 = () => {
  let cache = new Map();

  const getPossibleDesigns = (design, towels) => {
    if (design === "") return 1;
    if (cache.has(design)) return cache.get(design)

    const toTest = towels.filter((towel) => design.startsWith(towel));
    const result = toTest.reduce((total, towel) => {
      return total + getPossibleDesigns(design.replace(towel, ""), towels)
    }, 0)
    cache.set(design, result)
    return result;
  };

  const possibleDesigns = designs.map((design) => getPossibleDesigns(design, towels));
  return possibleDesigns.reduce((total, designs) => total + designs, 0);
}

time("part 1");
log(part1());
timeEnd("part 1");

time("part 2");
log(part2());
timeEnd("part 2");
