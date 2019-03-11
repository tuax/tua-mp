const fs = require('fs')
const path = require('path')
const { expectPrompts } = require('inquirer')

const addPage = require('../../lib/addPage')

jest.mock('fs')
jest.mock('inquirer')

describe('add:page', () => {
    const app = '/test-page-app'
    const dir = '/test-page-dir'
    const src = '/test-page-src'
    const dist = '/test-page-dist'
    const srcIdx = path.join(src, 'index.js')
    const srcPage = path.join(src, 'Page.vue')
    const distIdx = path.join(dist, 'index.js')

    beforeEach(() => {
        process.env.TUA_CLI_TEST_APP = app
        process.env.TUA_CLI_TEST_DIR = dir
        process.env.TUA_CLI_TEST_SRC = src
        process.env.TUA_CLI_TEST_DIST = dist

        fs.reset()
        fs.mkdirSync(src)
        fs.mkdirSync(dir)
        fs.mkdirSync(dist)
        fs.writeFileSync(app, '')

        jest.resetModules()
        jest.doMock(app, () => ({
            pages: [
                'pages/index/index',
                'pages/test-new/test-new',
                'pages/test-cancel/test-cancel',
            ],
        }), { virtual: true })
    })

    test('no name or src/app/app.json or src/pages/', () => {
        expect(addPage()).rejects.toThrow()
        expect(addPage({ name: '' })).rejects.toThrow()

        process.env.TUA_CLI_TEST_APP = null

        expect(addPage({ name: 'no src/app/app.json' })).rejects.toThrow()

        process.env.TUA_CLI_TEST_APP = app
        process.env.TUA_CLI_TEST_DIR = null

        expect(addPage({ name: 'no src/pages' })).rejects.toThrow()
    })

    test('catchAndThrow', () => {
        process.env.TUA_CLI_TEST_DIST = null
        jest.doMock(app, () => ({}), { virtual: true })

        expect(addPage({ name: 'catchAndThrow' })).rejects.toThrow()
    })

    test('new', async () => {
        const name = 'test-new'
        const uccName = 'TestNew'
        const content = '{{ name }}'

        const dist = '/test-page-new-dist'
        const distIdx = path.join(dist, 'index.js')
        const distPage = path.join(dist, `${uccName}.vue`)
        process.env.TUA_CLI_TEST_DIST = dist

        fs.writeFileSync(srcIdx, content)
        fs.writeFileSync(srcPage, name)

        await addPage({ name })
        const [ idx, page ] = [ distIdx, distPage ]
            .map(fs.readFileSync)
            .map(buffer => buffer.toString())

        expect(idx).toEqual(uccName)
        expect(page).toEqual(name)
    })

    test('cover', async () => {
        const name = 'test-cover'
        const uccName = 'TestCover'
        const content = '{{ name }}'
        const distPage = path.join(dist, `${uccName}.vue`)

        fs.writeFileSync(srcIdx, content)
        fs.writeFileSync(srcPage, name)

        expectPrompts([{
            message: 'Target directory exists. Continue?',
            confirm: true,
        }])

        await addPage({ name })
        const [ idx, page ] = [ distIdx, distPage ]
            .map(fs.readFileSync)
            .map(buffer => buffer.toString())

        expect(idx).toEqual(uccName)
        expect(page).toEqual(name)
    })

    test('cancel ', async () => {
        const name = 'test-cancel'
        const uccName = 'TestCancel'
        const content = '{{ name }}'
        const distPage = path.join(dist, `${uccName}.vue`)

        fs.writeFileSync(srcIdx, content)
        fs.writeFileSync(srcPage, name)
        fs.writeFileSync(distIdx, content)
        fs.writeFileSync(distPage, name)

        expectPrompts([{
            message: 'Target directory exists. Continue?',
            confirm: false,
        }])

        await addPage({ name })
        const [ idx, page ] = [ distIdx, distPage ]
            .map(fs.readFileSync)
            .map(buffer => buffer.toString())

        expect(idx).toEqual(content)
        expect(page).toEqual(name)
    })
})
