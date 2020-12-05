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
const lines = input.split('\n\n')

const passports = lines.map(line => {
    let passport = {}
    const fields = line.split('\n').join(' ').split(' ');
    fields.forEach(field => {
        const [key, value] = field.trim().split(':')
        passport[key] = value
    })
    return passport
});

// cid is the other valid field, which we ignore
const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid']

const validateNumber = (number, min, max) => Number(number) !== NaN && number >= min && number <= max

const validators = {
    byr: value => validateNumber(value, 1920, 2002),
    iyr: value => validateNumber(value, 2010, 2020),
    eyr: value => validateNumber(value, 2020, 2030),
    hgt: value => value.endsWith('cm')
        ? validateNumber(value.slice(0, -2), 150, 193)
        : value.endsWith('in') && validateNumber(value.slice(0, -2), 59, 76),
    hcl: value => value.length == 7 && value.match(/#[0-9a-f]{6}/g) != null,
    ecl: value => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value),
    pid: value => value.length == 9 && value.match(/[0-9]{9}/g) != null
}

const isValidPassport = (passport) => {
    return requiredFields.every(field => {
        const value = passport[field]
        const isValid = !!value && validators[field](value)
        return isValid
    })
}

const number = passports.reduce((count, passport) => {
    return isValidPassport(passport) ? count + 1 : count
}, 0)

console.log(number)
