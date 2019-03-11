const fs = require('fs')
const path = require('path')
const { expectPrompts } = require('inquirer')

const addComp = require('../../lib/addComp')

jest.mock('fs')
jest.mock('inquirer')

describe('add comp', () => {
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

    describe('global', () => {
        const global = true

        test('no name or src/comps/', () => {
            process.env.TUA_CLI_TEST_DIR = null

            expect(addComp()).rejects.toThrow()
            expect(addComp({ name: '', global })).rejects.toThrow()
            expect(addComp({ name: 'no src/pages', global })).rejects.toThrow()
        })

        test('catchAndThrow', () => {
            process.env.TUA_CLI_TEST_DIST = null

            return expect(addComp({ name: 'catchAndThrow', global })).rejects.toThrow()
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

            await addComp({ name, global })
            const [ idx, page ] = [ distIdx, distComp ]
                .map(fs.readFileSync)
                .map(buffer => buffer.toString())

            expect(idx).toEqual(uccName)
            expect(page).toEqual(name)
        })
    })

    test('local wx', async () => {
        const dist = '/test-comp-local-dist'
        const name = 'test-wx'
        const uccName = 'TestWx'
        const content = '{{ name }}'
        const distIdx = path.join(dist, 'index.js')
        const distComp = path.join(dist, `${uccName}.vue`)

        process.env.TUA_CLI_TEST_DIST = dist

        fs.writeFileSync(srcIdx, content)
        fs.writeFileSync(srcComp, name)

        expectPrompts([{
            message: 'Select a target directory for your component:',
            fuzzyPath: dist,
        }])

        const addCompPromise = addComp({ name })

        expectPrompts([{
            message: 'Target directory exists. Continue?',
            confirm: true,
        }])

        await addCompPromise
        const [ idx, page ] = [ distIdx, distComp ]
            .map(fs.readFileSync)
            .map(buffer => buffer.toString())

        expect(idx).toEqual(uccName)
        expect(page).toEqual(name)
    })

    test('cancel', async () => {
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

        await addComp({ name, global: true })
        const [ idx, page ] = [ distIdx, distComp ]
            .map(fs.readFileSync)
            .map(buffer => buffer.toString())

        expect(idx).toEqual(content)
        expect(page).toEqual(name)
    })
})
