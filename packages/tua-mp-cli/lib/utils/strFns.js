// 首字母大写
const upperFirst = (str) => {
    if (!str) return str

    return str.slice(0, 1).toUpperCase() + str.slice(1)
}

// 连字符转成小驼峰
const hyphenCaseToCamelCase = (str) => {
    if (!str) return str

    const arr = str.split('-').filter(x => x)
    const firstWord = arr.shift()
    const lastWords = arr.reduce((acc, cur) => acc + upperFirst(cur), '')

    return firstWord + lastWords
}

// 连字符转成大驼峰
const hyphenCaseToUpperCamelCase = (str) => str
    .split('-')
    .reduce((acc, cur) => acc + upperFirst(cur), '')

// 驼峰转连字符
const camelCaseToHyphenCase = str => str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-*/g, '')

module.exports = {
    upperFirst,
    camelCaseToHyphenCase,
    hyphenCaseToCamelCase,
    hyphenCaseToUpperCamelCase,
}
