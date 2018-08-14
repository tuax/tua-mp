const fs = require('fs')
const { expectPrompts } = require('inquirer')

const addApi = require('../lib/addApi')

jest.mock('fs')
jest.mock('inquirer')

describe('add:api', () => {
    const src = '/test-api-src'
    const dir = '/test-api-error'
    const dist = '/test-api-dist'

    beforeEach(() => {
        process.env.TUA_CLI_TEST_DIR = dir
        process.env.TUA_CLI_TEST_SRC = src
        process.env.TUA_CLI_TEST_DIST = dist

        fs.reset()
        fs.mkdirSync(dir)
    })

    test('no name or src/apis/', () => {
        process.env.TUA_CLI_TEST_DIR = null
        process.env.TUA_CLI_TEST_SRC = null
        process.env.TUA_CLI_TEST_DIST = null

        expect(addApi('', {})).rejects.toThrow()
        expect(addApi('no src/apis/', {})).rejects.toThrow()
    })

    test('catchAndThrow', () => {
        process.env.TUA_CLI_TEST_SRC = null

        return expect(addApi('catchAndThrow', {})).rejects.toThrow()
    })

    test('new', async () => {
        const name = 'test-new'
        const content = '{{ name }}'

        fs.writeFileSync(src, content)

        const result = await addApi(name)
            .then(() => fs.readFileSync(dist))
            .then(buffer => buffer.toString())

        expect(result).toEqual(name)
    })

    test('cover', async () => {
        const name = 'test-cover'
        const content = '{{ name }}'

        fs.writeFileSync(src, content)
        fs.writeFileSync(dist, '')

        expectPrompts([{
            message: 'Target file exists. Continue?',
            confirm: true,
        }])

        const result = await addApi(name)
            .then(() => fs.readFileSync(dist))
            .then(buffer => buffer.toString())

        expect(result).toEqual(name)
    })

    test('cancel', async () => {
        const name = 'test-cancel'
        const content = '{{ name }}'

        fs.writeFileSync(src, content)
        fs.writeFileSync(dist, '')

        expectPrompts([{
            message: 'Target file exists. Continue?',
            confirm: false,
        }])

        const result = await addApi(name, {})
            .then(() => fs.readFileSync(dist))
            .then(buffer => buffer.toString())

        expect(result).toEqual('')
    })
})
