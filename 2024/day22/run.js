import fs from 'fs'
import {log, time, timeEnd} from 'console'

const args = process.argv.slice(2)
const inputFile = args[0] ?? 'input.txt'
const input = fs.readFileSync(inputFile, 'utf8').toString();
const secrets = input.split('\n').map(line => Number(line))

const XOR = (a, b) => Number(BigInt(a) ^ BigInt(b));
const mix = (secret, val) => XOR(secret, val)
// prune to 24 least sig bits
const prune = (secret) => {
  const d = 16777216
  return ((secret % d) + d) % d
}

const pMix = (secret, val) => prune(mix(secret, val))

const nextSecret = (secret) => {
  let s = secret
  s = pMix(s, s * 64) // XOR(s, s<<6))
  s = pMix(s, Math.trunc(s / 32)) // XOR(s, s>>5)
  return pMix(s, s * 2048) // XOR(s, s<<11))
}

const nthSecret = (secret, n) => {
  let s = secret
  for (let i = 0; i < n; i++) {
    s = nextSecret(s)
  }
  return s
}

const nSecrets = (secret, n) => {
  const secrets = [secret]
  for (let i=1; i < n; i++) {
    secrets.push(
      nextSecret(secrets[i - 1])
    )
  }
  return secrets
}

const part1 = () => {
  return secrets
    .map(secret => nthSecret(secret, 2000))
    .reduce((total, curr) => total + curr, 0)
}

const part2 = () => {
  const priceMaps = []

  secrets.forEach((secret, i) => {
    const prices = nSecrets(secret, 2000).map(s => s % 10)
    const costDiffs = prices.map((price, i) => i === 0 ? null : price - prices[i-1])
    const priceMap = new Map()

    for (let i = 1, j = 4; j < costDiffs.length; i++, j++) {
      const priceWindow = costDiffs.slice(i, j + 1)
      const key = priceWindow.join(',')
      if (!priceMap.has(key)) {
        priceMap.set(key, prices[j])
      }
    }
    priceMaps.push(priceMap)
  })

  const totalPriceMap = new Map()
  priceMaps.forEach(priceMap => {
    priceMap.forEach((price, key) => {
      let curr = totalPriceMap.get(key) ?? 0
      totalPriceMap.set(key, curr + price)
    })
  })

  let seq, max = 0
  totalPriceMap.forEach((price, key) => {
    if (price > max) {
      seq = key
      max = price
    }
  })

  log('Sequence: ', seq)
  return max
}


time('part 1')
log(part1())
timeEnd('part 1')

time('part 2')
log(part2())
timeEnd('part 2')
