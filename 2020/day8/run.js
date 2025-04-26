import fs from 'fs'

const getFileData = () => {
    try {
        let data = fs.readFileSync('input.txt', 'utf8');
        return data.toString();
    } catch (e) {
        console.error(e.message)
    }
}

const input = getFileData()
const lines = input.split('\n')

// we want the acc
// data should look like... line number -> [instruction, value, visited]
// if you get somewhere that's "visited", return the acc
// actually, going by line numbers, let's just do a nested array because YOLO

const initialProgram = lines.map(line => {
    const [instruction, value] = line.split(' ');
    return [instruction, value, false]
});


const addValues = (first, second) => Number(first) + Number(second)

let runningTotal = 0
const runLine = (line, program) => {
    if (line >= program.length) {
        console.log('We\'ve reached the end!', runningTotal)
        return true
    }

    const [instruction, value, hasRun] = program[line];

    if (hasRun) return false
    program[line] = [instruction, value, true]

    switch (instruction) {
        case 'nop':
            return runLine(line + 1, program)
        case 'jmp':
            return runLine(addValues(line, value), program)
        case 'acc':
            runningTotal = addValues(runningTotal, value)
            return runLine(line + 1, program);
    }
}

const part1 = () => {
    const program = [...initialProgram]
    runLine(0, program)
    console.log('Part 1:', runningTotal)
}


const part2 = () => {
    let fixedProgram = [...initialProgram]

    const fixedLine = fixedProgram.findIndex((line, lineNumber) => {
        fixedProgram = [...initialProgram];
        runningTotal = 0;
        if (line[0] === 'jmp') {
            fixedProgram[lineNumber] = ['nop', line[1], false];
            if (runLine(0, fixedProgram)) {
                return true
            }
        } else if (line[0] === 'nop') {
            fixedProgram[lineNumber] = ['jmp', line[1], false];
            if (runLine(0, fixedProgram))  {
                return true
            }
        }
        return false
    })
    console.log('Part 2, fixed line:', fixedLine, 'acc value:', runningTotal)
}

part1()
part2()
