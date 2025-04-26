import fs from "fs";

const args = process.argv.slice(2);
const inputFile = args[0] ?? "input.txt";

const input = fs.readFileSync(inputFile, "utf8").toString();
const [time, record] = input
  .split("\n")
  .map((line) =>
    line
      .split(/\s/)
      .filter((x) => x)
      .map((x) => Number(x)),
  )
  .filter((x) => x.length)
  .map((x) => x.slice(1));

const races = time.map((time, index) => ({
  time,
  record: record[index],
}));

function simRace(time, speed) {
  const remainingTicks = time - speed;
  return remainingTicks * speed;
}

function countWins({ time, record }) {
  let count = 0;
  for (let i = 0; i < time; i++) {
    if (simRace(time, i) > record) count++;
  }
  return count;
}

// how a race works:
// start at speed 0
// increase speed by 1 at each tick
// at release, distance = speec * remainingTicks

const part1 = () => {
  // Find how many ways you can beat the record for each race
  // Multiply results
  return races
    .map((race) => countWins(race))
    .reduce((total, wins) => total * wins, 1);
};

const part2 = () => {
  const megaRace = {
    time: "",
    record: "",
  };

  races.forEach((race) => {
    megaRace.time = Number(`${megaRace.time}` + `${race.time}`);
    megaRace.record = Number(`${megaRace.record}` + `${race.record}`);
  });

  return countWins(megaRace);
};

console.log("Part 1:", part1());
console.log("Part 2:", part2());
