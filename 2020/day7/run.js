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
const rules = input.split('\n')

// -------------------------- part 1 --------------------------------

const getColor = (colorString) => {
    if (colorString.includes('no other bags.')) return null
    
    return colorString
        .replace(/\d/g, '')
        .replace('bags.', '')
        .replace('bags', '')
        .replace('bag.', '')
        .replace('bag', '')
        .trim()
}

// get a map of color -> contains
const bagMap = new Map()
rules.forEach(rule => {
    const [color, contents] = rule.split('contain')
    const containsColors = contents.split(',').map(containedColor => getColor(containedColor))
    if (containsColors.includes(null)) {
        bagMap.set(getColor(color), null)
    } else {
        bagMap.set(getColor(color), new Set(containsColors))
    }
})

const eventuallyGold = (color) => {
    const contents = bagMap.get(color)
    if (contents === null) return

    if (bagMap.get(color).has('shiny gold')) {
        return true
    } else {
        return Array.from(contents).some(containedColor => eventuallyGold(containedColor))
    }
}

const part1 = () => {
    let count = 0
    bagMap.forEach((_, color) => {
        if (eventuallyGold(color)) count++
    })
    console.log('Bags that eventually contain shiny gold:', count)
}

// -------------------------- part 2 --------------------------------

const getNumber = bagString => {
    const num = bagString.match(/\d+/)[0]
    if (Number(num) !== NaN) {
        return Number(num)
    } else {
        console.log('cant get num', bagString)
        return 0
    }
}

// get a map of color -> [[color, count]]
const bagCountMap = new Map()
rules.forEach(rule => {
    const [color, contents] = rule.split('contain')
    const containsColors = contents.split(',').map(bagString => {
        const contained = getColor(bagString)
        if (contained === null) return null
        return [contained, getNumber(bagString)]
    })
    if (containsColors.includes(null)) {
        bagCountMap.set(getColor(color), null)
    } else {
        bagCountMap.set(getColor(color), containsColors)
    }
})

const getCountInColor = (color) => {
    const contents = bagCountMap.get(color)

    if (!bagCountMap.has(color)) {
        console.log('unknown color', color)
        return 0
    }

    if (contents === null) {
        return 0
    } else {
        // count in bags, + count in nested bags.
        let total = 0
        contents.forEach((bag) => {
            total += bag[1] * getCountInColor(bag[0]) + bag[1]
        })
        return total
    }
}

const part2 = () => {
    console.log('Total bags contained in shiny gold (part 2):', getCountInColor('shiny gold'))
}

part1()
part2()
