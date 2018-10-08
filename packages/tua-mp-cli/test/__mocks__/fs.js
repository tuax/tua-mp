const fs = new (require('metro-memory-fs'))({ cwd: process.cwd })

fs.__mockDirMap = {}

fs.mkdir = (dir, cb) => {
    fs.__mockDirMap[dir] = true
    cb()
    fs.mkdirSync(dir)
}
fs.appendFile = (_, __, cb) => cb()

module.exports = fs
