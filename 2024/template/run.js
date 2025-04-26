import fs from 'fs'
import {log, time, timeEnd} from 'console'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const lines = input.split('\n')

const part1 = () => {

}

const part2 = () => {

}


time('part 1')
log(part1())
timeEnd('part 1')

time('part 2')
log(part2())
timeEnd('part 2')
