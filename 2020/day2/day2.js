import fs from 'fs'

const getFileData = () => {
    try {
        let data = fs.readFileSync('input.txt', 'utf8');
        return data.toString();
    } catch (e) {
        console.error(e.message)
    }
}


const firstValidator = (rule, password) => {
    const {min, max, letter} = rule
    const count = (password.match(new RegExp(letter, 'g')) || []).length
    return count >= min && count <= max
}

const secondValidator = (rule, password) => {
    const {min: first, max: second, letter} = rule
    const isFirst = password[first - 1] === letter
    const isSecond = password[second - 1] === letter
    return isFirst && !isSecond || !isFirst && isSecond
}

const lines = getFileData().split('\n');


const run = (validator) => {
    let validCount = 0

    lines.forEach(line => {
        const [rule, password] = line.split(':');
        const [limits, letter] = rule.split(' ');
        const [min, max] = limits.split('-');

        if (validator({ min, max, letter}, password.trim())) {
            validCount++
        }
    })
    return validCount
}

console.log(run(firstValidator))
console.log(run(secondValidator))


