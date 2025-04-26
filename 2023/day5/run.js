import fs from 'fs'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'

const input = fs.readFileSync(inputFile, 'utf8').toString();
const [seedInput, ...mapsInput] = input.split('\n\n')

const seeds = seedInput
  .replace('seeds: ', '')
  .split(' ')
  .map(Number)

const maps = mapsInput
  .map(map => map
    .split('\n')
    .filter((s,i) => i !== 0)
    .map(s => s.split(' ').map(Number))
    .map(([d, s, range]) => ({
      source: s,
      dest: d,
      range
    }))
    .sort((a, b) => a.source - b.source))

const part1 = () => {
  const getNext = (point, maps) => {
    let res
    maps.some(({source, dest, range}) => {
      if (point >= source && point < source + range) {
        res = dest + (point - source)
        return true
      }
    })
    return res ?? point
  }

  let locations = seeds.map(seed => {
    let point = seed
    maps.forEach(map => {
      point = getNext(point, map)
    })
    return point
  })
  return Math.min(...locations)
}



const part2 = () => {
  let ranges = []
  let prev
  seeds.forEach((seed, i) => {
    if (i % 2 === 0) {
      prev = seed
    } else {
      ranges.push([prev, seed])
    }
  })
  ranges = ranges.sort((a,b) => a[0] - b[0])
  const seedMaps = [...maps].reverse()

  const getNext = (point, maps) => {
    let res
    // reverse map from dest to source
    maps.some(({source: dst, dest: src, range}) => {
      if (point >= src && point < src + range) {
        res = dst + (point - src)
        return true
      }
    })
    return res ?? point
  }
  
  const getSeedFromLocation = (location) => {
    let curr = location
    seedMaps.forEach(m => curr = getNext(curr, m))
    return curr
  }

  const seedExists = seed => 
    ranges.some(([start, range]) => 
      seed >= start && seed <= start + range
    )

  let l = 0
  // if we can't brute force the seeds... brute force the reverse locations
  while (true) {
    const seed = getSeedFromLocation(l)
    if (seedExists(seed)) return l
    l++
  }

  // const getOverlap = ([x1, l1], [x2, l2]) => {
  //   const y1 = x1 + l1
  //   const y2 = x2 + l2
  //   if (x1 <= y2 && y1 >= x2) {
  //     let x = Math.max(x1, x2)
  //     let y = Math.min(y1, y2)
  //     return [x, y - x]
  //   }
  // }

  // const getRemainder = ([x1, y1], [x2, y2]) => {
  //   const remain = []

  //   if (x1 < x2) {
  //     remain.push([x1, Math.min(y1, x2) - x1])
  //   }
  //   if (y1 > y2) {
  //     let s = Math.max(x1, y2) + 1
  //     remain.push([s, y1 - s])
  //   }
  //   return remain
  // }

  // const getNext = (ranges, maps) => {
  //   let res = []
  //   ranges.forEach(([start, len]) => {
  //     let mapsStart = Infinity, mapsEnd = 0
  // ///////// made an assumption here that ranges all overlap
  // //////// which wasn't true in the real input

  //     maps.forEach(({source, dest, range}) => {
  //       mapsStart = Math.min(mapsStart, source)
  //       mapsEnd = Math.max(mapsEnd, source + range)
  //       const overlap = getOverlap([start, len], [source, range])
  //       if (overlap) {
  //         const offset = dest - source
  //         res.push([overlap[0] + offset, overlap[1]])
  //       }
  //     })
  //     // preserve anything that isn't covered by the maps
  //     const remaining = getRemainder([start, start + len], [mapsStart, mapsEnd])
  //     res.push(...remaining)
  //   })
  //   return res
  // }

  // const queue = [...maps]
  // while (queue.length) {
  //   const nextMaps = queue.shift()
  //   ranges = getNext(ranges, nextMaps)
  // }
  // console.log(ranges.sort((a,b) => a[0] - b[0]))
  // console.log(ranges.length, seeds.length)

  // return Math.min(...ranges.map(([x, _]) => x))
}

console.log('Part 1:', part1())
console.log('Part 2:', part2())
