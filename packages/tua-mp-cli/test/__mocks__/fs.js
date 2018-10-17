const fs = new (require('metro-memory-fs'))({ cwd: process.cwd })

fs.__mockDirMap = {}

fs.mkdir = (dir, cb) => {
    fs.__mockDirMap[dir] = true
    cb()
    fs.mkdirSync(dir)
}
fs.appendFile = (src, str, cb) => {
    const content = fs.readFileSync(src).toString() + str
    fs.writeFileSync(src, content)
    cb()
}

module.exports = fs
