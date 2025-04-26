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

const groups = input.split('\n\n')

// aigh't here's the plan....
// for each group, split into people, then questions
// add each answer to a set
// return the count in the set

const part1 = groups.map(group => {
    const answers = group.split('\n').join('').split('')
    const unique = new Set()
    answers.forEach(question => unique.add(question))
    return unique.size
}).reduce((res, current) => res + current, 0)


console.log('part 1:', part1)

const part2 = groups.map(group => {
    const people = group.trim().split('\n')
    // maybe map of answer => person
    // add up the answers which have a map entry of the right size?
    const answerCount = new Map()
    people.forEach(person => {
        const answers = person.split('')
        answers.forEach(answer => {
            const newCount = (answerCount.get(answer) || 0) + 1
            answerCount.set(answer, newCount)
        })
    })
    let count = 0
    answerCount.forEach((num) => {if (num === people.length) count++})
    console.log(group, count, '\n')
    return count
}).reduce((res, curr) => res + curr, 0)

console.log('part 2', part2)
