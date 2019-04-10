const fs = require('fs')
const path = require('path')
const { expectPrompts } = require('inquirer')

const declare = require('../../lib/declare')

jest.mock('fs')
jest.mock('inquirer')

describe('declare', () => {
    const dir = '/test-declare-dir'
    const getSrc = file => path.join(dir, `${file}.js`)
    const getDist = file => path.join(dir, `${file}.d.ts`)

    const src = getSrc('index')
    const dist = getDist('index')

    const getResult = (file = dist) => fs.readFileSync(file).toString()
    const mockApis = () => ({
        api1: {
            a: {},
            b: { params: {} },
            c: { params: [] },
            d: { params: ['q', 'w'] },
        },
        api2: {
            a: {
                params: {
                    q: { required: true },
                    w: '123',
                },
            },
            b: {
                params: {
                    q: { isRequired: true },
                    w: '123',
                },
            },
        },
    })

    beforeEach(() => {
        process.env.TUA_CLI_TEST_SRC = src
        process.env.TUA_CLI_TEST_DIST = dist

        fs.reset()
        fs.mkdirSync(dir)
        fs.writeFileSync(src, '')
        jest.doMock(src, mockApis, { virtual: true })
    })

    test('generate', async () => {
        await declare()

        expect(getResult()).toMatchSnapshot()
    })

    test('cover', async () => {
        const file = 'apis'
        const src = getSrc(file)
        const dist = getDist(file)
        const content = 'test cover'

        process.env.TUA_CLI_TEST_SRC = src
        process.env.TUA_CLI_TEST_DIST = dist

        fs.writeFileSync(src, '')
        fs.writeFileSync(dist, content)
        jest.doMock(src, mockApis, { virtual: true })
        expectPrompts([{
            message: 'Target file exists. Continue?',
            confirm: true,
        }])
        expect(getResult(dist)).toBe(content)

        await declare({ apisPath: src })

        expect(getResult(dist)).toMatchSnapshot()
    })

    test('cancel', async () => {
        const content = 'test cancel'

        fs.writeFileSync(dist, content)
        expectPrompts([{
            message: 'Target file exists. Continue?',
            confirm: false,
        }])
        expect(getResult(dist)).toBe(content)

        await declare()

        expect(getResult(dist)).toMatchSnapshot()
    })

    test('error', () => {
        process.env.TUA_CLI_TEST_SRC = '/whatever/path.js'

        expect(declare()).rejects.toThrow()
    })

    test('directory', async () => {
        process.env.TUA_CLI_TEST_SRC = dir
        jest.doMock(dir, mockApis, { virtual: true })

        await declare()

        expect(getResult(dist)).toMatchSnapshot()
    })
})
