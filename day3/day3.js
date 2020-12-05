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
const treeMap = input.split('\n')
    .map(line => line.trim().split(''))

const slide = (right, down) => {
    let count = 0
    for (let i = 0; i < treeMap.length; i++) {
        const x = (i * right) % treeMap[0].length
        const y = down * i
        if (y <= treeMap.length && treeMap[y][x] === '#') {
            count++
        }
    }
    return count
}

const result = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2]
].reduce((res, currentSlope) => {
    const thing = res * slide(currentSlope[0], currentSlope[1])
    console.log(thing)
    return thing
}, 1)

console.log(result)
