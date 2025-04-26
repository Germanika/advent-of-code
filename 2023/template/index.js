import fs from "fs";
import { log, time, timeEnd } from "console";

const args = process.argv.slice(2);
const inputFile = args[0] ?? "input.txt";

const input = fs.readFileSync(inputFile, "utf8").toString();
const lines = input.split("\n");

const part1 = () => {};

const part2 = () => {};

time("Part 1");
log("Part 1:", part1());
timeEnd("Part 1");

time("Part 2");
log("Part 2:", part2());
timeEnd("Part 2");
