const fs = require('fs')
const path = require('path')
const { expectPrompts } = require('inquirer')

const addApi = require('../../lib/addApi')

jest.mock('fs')
jest.mock('inquirer')

describe('add api', () => {
    const src = '/test-api-src'
    const dir = '/test-api-dir'
    const dist = '/test-api-dist'
    const srcApi = path.join(src, 'api.js')
    const srcIdx = path.join(src, 'index.js')
    const distIdx = path.join(dir, 'index.js')

    const getResult = () => [
        fs.readFileSync(dist),
        fs.readFileSync(distIdx),
    ].map(b => b.toString())

    beforeEach(() => {
        process.env.TUA_CLI_TEST_DIR = dir
        process.env.TUA_CLI_TEST_SRC = src
        process.env.TUA_CLI_TEST_DIST = dist

        fs.reset()
        fs.mkdirSync(src)
        fs.mkdirSync(dir)
        fs.writeFileSync(srcIdx, '')
    })

    test('no name or src/apis/', () => {
        process.env.TUA_CLI_TEST_DIR = null
        process.env.TUA_CLI_TEST_SRC = null
        process.env.TUA_CLI_TEST_DIST = null

        expect(addApi()).rejects.toThrow()
        expect(addApi({ name: '' })).rejects.toThrow()
        expect(addApi({ name: 'no src/apis/' })).rejects.toThrow()
    })

    test('catchAndThrow', () => {
        process.env.TUA_CLI_TEST_SRC = null

        return expect(addApi({ name: 'catchAndThrow' })).rejects.toThrow()
    })

    test('new', async () => {
        const name = 'test-new'
        const ccName = 'testNew'
        const content = '{{ name }}'

        fs.writeFileSync(srcApi, content)
        fs.writeFileSync(srcIdx, content)

        await addApi({ name })
        const result = getResult()

        expect(result[0]).toEqual(name)
        expect(result[1]).toEqual(
            `${content}` +
            `export const ${ccName}Api = tuaApi.getApi(require('./${name}').default)\n`
        )
    })

    test('cover', async () => {
        const name = 'test-cover'
        const content = '{{ name }}'

        fs.writeFileSync(dist, '')
        fs.writeFileSync(distIdx, '')
        fs.writeFileSync(srcIdx, content)
        fs.writeFileSync(srcApi, content)

        expectPrompts([{
            message: 'Target file exists. Continue?',
            confirm: true,
        }])

        await addApi({ name })
        const result = getResult()

        expect(result[0]).toEqual(name)
        expect(result[1]).toEqual('')
    })

    test('cancel', async () => {
        const name = 'test-cancel'
        const content = '{{ name }}'

        fs.writeFileSync(dist, '')
        fs.writeFileSync(distIdx, '')
        fs.writeFileSync(srcIdx, content)
        fs.writeFileSync(srcApi, content)

        expectPrompts([{
            message: 'Target file exists. Continue?',
            confirm: false,
        }])

        await addApi({ name })
        const result = getResult()

        expect(result[0]).toEqual('')
        expect(result[1]).toEqual('')
    })
})
