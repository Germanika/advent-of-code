import fs from 'fs'

const getFileData = () => {
    try {
        let data = fs.readFileSync('input.txt', 'utf8');
        return data.toString();
    } catch (e) {
        console.error(e.message)
    }
}

// question, what is the highest ID on a boarding pass:
// that would be the highest ID * 8 + highest row.

const input = getFileData()
const lines = input.split('\n')

const ids = []
lines.forEach(line => {
    const row = line
        .slice(0,7)
        .replaceAll("F", "0")
        .replaceAll("B", 1)
    const col = line
        .slice(7)
        .replaceAll("R", "1")
        .replaceAll("L", "0")
    const id = parseInt(row, 2) * 8 + parseInt(col,2)
    ids.push(id)
})
ids.sort((a, b) => a - b)
console.log('largest id', ids[ids.length - 1])

let current = ids[0];
ids.find((id,index) => {
    if (id === current) {
        current++
        return false
    } else {
        return true
    }
})
console.log('missing', current)