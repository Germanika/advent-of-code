const input = [9,6,0,10,18,2,1]

const day15 = (start, turns) => {
    const memory = new Map()

    start.forEach((num, index) => {
        memory.set(num, [index + 1])
    })

    let turn = start.length + 1
    let last = start[start.length - 1]
    while (turn <= turns) {
        if (memory.has(last)) {
            const lastTurn = memory.get(last)
            memory.set(last, turn - 1)
            last = turn - 1 - lastTurn
        } else {
            memory.set(last, [turn-1])
            last = 0
        }
        turn++
    }
    return last
}

console.log('Part 1:', day15(input, 2020))
console.log('Part 2:', day15(input, 30000000))
