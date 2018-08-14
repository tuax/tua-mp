const fs = require('fs')
const path = require('path')
const { expectPrompts } = require('inquirer')

const addComp = require('../lib/addComp')

jest.mock('fs')
jest.mock('inquirer')

describe('add:comp', () => {
    const dir = '/test-comp-dir'
    const src = '/test-comp-src'
    const dist = '/test-comp-dist'
    const srcIdx = path.join(src, 'index.js')
    const srcComp = path.join(src, 'Comp.vue')
    const distIdx = path.join(dist, 'index.js')

    beforeEach(() => {
        process.env.TUA_CLI_TEST_DIR = dir
        process.env.TUA_CLI_TEST_SRC = src
        process.env.TUA_CLI_TEST_DIST = dist

        fs.reset()
        fs.mkdirSync(src)
        fs.mkdirSync(dir)
        fs.mkdirSync(dist)
    })

    test('no name or src/comps/', () => {
        process.env.TUA_CLI_TEST_DIR = null
        process.env.TUA_CLI_TEST_SRC = null
        process.env.TUA_CLI_TEST_DIST = null

        expect(addComp('', { global: true })).rejects.toThrow()
        expect(addComp('no src/pages', { global: true })).rejects.toThrow()
        expect(addComp('no src/app/app.json', { global: true })).rejects.toThrow()
    })

    test('catchAndThrow', () => {
        process.env.TUA_CLI_TEST_DIST = null

        return expect(addComp('catchAndThrow', { global: true })).rejects.toThrow()
    })

    test('global wx', async () => {
        const name = 'test-wx'
        const uccName = 'TestWx'
        const content = '{{ name }}'
        const distComp = path.join(dist, `${uccName}.vue`)

        fs.writeFileSync(srcIdx, content)
        fs.writeFileSync(srcComp, name)

        expectPrompts([{
            message: 'Target directory exists. Continue?',
            confirm: true,
        }])

        const [ idx, page ] = await addComp(name, { global: true })
            .then(() => [ distIdx, distComp ]
                .map(fs.readFileSync)
                .map(buffer => buffer.toString())
            )

        expect(idx).toEqual(uccName)
        expect(page).toEqual(name)
    })

    test('local wx', async () => {
        const dist = '/test-comp-local-dist'
        const name = 'test-wx'
        const uccName = 'TestWx'
        const content = '{{ name }}'
        const distIdx = path.join(dist, 'index.js')
        const distComp = path.join(dist, `${uccName}.vue`)

        process.env.TUA_CLI_TEST_DIST = dist

        // fs.mkdirSync(dist)
        fs.writeFileSync(srcIdx, content)
        fs.writeFileSync(srcComp, name)

        expectPrompts([{
            message: 'Select a target directory for your component:',
            fuzzyPath: dist,
        }])

        const addCompPromise = addComp(name, { global: false })

        expectPrompts([{
            message: 'Target directory exists. Continue?',
            confirm: true,
        }])

        const [ idx, page ] = await addCompPromise
            .then(() => [ distIdx, distComp ]
                .map(fs.readFileSync)
                .map(buffer => buffer.toString())
            )

        expect(idx).toEqual(uccName)
        expect(page).toEqual(name)
    })

    test('cancel ', async () => {
        const name = 'test-cancel'
        const uccName = 'TestCancel'
        const content = '{{ name }}'
        const distComp = path.join(dist, `${uccName}.vue`)

        fs.writeFileSync(srcIdx, content)
        fs.writeFileSync(srcComp, name)
        fs.writeFileSync(distIdx, content)
        fs.writeFileSync(distComp, name)

        expectPrompts([{
            message: 'Target directory exists. Continue?',
            confirm: false,
        }])

        const [ idx, page ] = await addComp(name, { global: true })
            .then(() => [ distIdx, distComp ]
                .map(fs.readFileSync)
                .map(buffer => buffer.toString())
            )

        expect(idx).toEqual(content)
        expect(page).toEqual(name)
    })
})
