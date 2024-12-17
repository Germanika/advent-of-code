import fs from "fs";
import { log, time, timeEnd } from "console";

const args = process.argv.slice(2);
const inputFile = args[0] ?? "input.txt";

const input = fs.readFileSync(inputFile, "utf8").toString();
const [regs, prog] = input.split("\n\n");

const initialRegs = regs.split("\n").map((reg) => {
  const [, val] = reg.split(": ");
  return Number(val);
});

const program = prog
  .split(": ")[1]
  .split(",")
  .map((x) => Number(x));

let [A, B, C] = initialRegs;
let pntr = 0;
let output = [];

const combo = (op) => {
  if (op >= 0 && op <= 3) return op;
  if (op === 4) return A;
  if (op === 5) return B;
  if (op === 6) return C;
  if (op === 7) throw new Error("invalid operand");
};

const divPow2 = (op) => Math.trunc(A / Math.pow(2, combo(op)));

// running into int32 overflow issues
const XOR = (a, b) => Number(BigInt(a) ^ BigInt(b));

const adv = (op) => (A = divPow2(op));
const bxl = (op) => (B = XOR(B, op));
const bst = (op) => (B = combo(op) % 8);
const jnz = (op) => {
  if (A !== 0) {
    pntr = op - 2;
  }
};
const bxc = () => (B = XOR(B, C));
const out = (op) => output.push(combo(op) % 8);
const bdv = (op) => (B = divPow2(op));
const cdv = (op) => (C = divPow2(op));

const ops = [adv, bxl, bst, jnz, bxc, out, bdv, cdv];

const run = (init) => {
  pntr = 0;
  output = [];
  if (init) A = init;

  while (pntr < program.length) {
    ops[program[pntr]](program[pntr + 1]);
    pntr += 2;
  }
};

const part1 = () => {
  run();
  return output.join(",");
};

const part2 = () => {
  const div = (a) => {
    let b = XOR(a % 8, 1);
    let c = Math.trunc(a / Math.pow(2, b));
    return c;
  };

  const getOut = (a) => {
    /**
     * B = A % 8
     * B = B ^ 1
     * C = A / pow(2,B)
     * A = A / pow(2,3)
     * B = B ^ A
     * B = B ^ C
     * out -> B % 8
     */
    // let out = (a & 7) ^ 1 ^ divPow2(3) ^ div(a);

    let b = a % 8;
    b = XOR(b, 1);
    b = XOR(b, Math.trunc(a / 8));
    b = XOR(b, div(a));
    // we can write the loop's output as a function of a
    return b % 8;
  };

  const findInitialValue = (curr = 0, i = program.length - 1) => {
    // 3-bit digits!!!!!!
    for (let a = curr; a < curr + 8; a++) {
      run(a);
      if (output[0] === program[i]) {
        const value = i > 0 ? findInitialValue(a * 8, i - 1) : a;
        if (value >= 0) return value;
      }
    }
    return -1;
  };

  const ans = findInitialValue();
  return ans;
};

time("part 1");
log(part1());
timeEnd("part 1");

time("part 2");
log(part2());
timeEnd("part 2");
