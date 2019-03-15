const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const { expectPrompts } = require('inquirer')
const {
    rMkdir,
    upperFirst,
    getTemplateDir,
    readConfigFile,
    fsExistsFallback,
    compileTmplToTarget,
    camelCaseToHyphenCase,
    hyphenCaseToCamelCase,
    hyphenCaseToUpperCamelCase,
} = require('../../lib/utils')

jest.mock('fs')
jest.mock('inquirer')

describe('fs', () => {
    test('rMkdir', async () => {
        const dir = '/a/b/c/d/'
        expect(fs.__mockDirMap[dir]).toBeFalsy()
        await rMkdir(dir)
        expect(fs.__mockDirMap[dir]).toBeTruthy()
    })

    test('fsExistsFallback', () => {
        const file = '/a.js'
        fs.writeFileSync(file, '')
        const result1 = fsExistsFallback([
            'foo',
            'foobar',
            'whatever',
            file,
        ])
        const result2 = fsExistsFallback([
            'foo',
            file,
            'whatever',
        ])

        expect(result1).toBe(file)
        expect(result2).toBe(file)
        expect(fsExistsFallback()).toBeUndefined()
    })

    test('getTemplateDir', async () => {
        expect(getTemplateDir()).toBeUndefined()

        const prefix = 'test'

        // default path
        const defaultPath = path.resolve(__dirname, '../../templates', prefix)
        expect(getTemplateDir('', prefix)).toBeUndefined()
        await rMkdir(defaultPath)
        expect(getTemplateDir('', prefix)).toBe(defaultPath)

        // absolute path
        const customDir = '/foo/bar/a/b/c/'
        expect(getTemplateDir(customDir, prefix)).toBe(defaultPath)
        await rMkdir(customDir + prefix)
        expect(getTemplateDir(customDir, prefix)).toBe(customDir + prefix)
    })

    test('readConfigFile', () => {
        expect(readConfigFile()).toEqual({})

        const tuaMpConfig = `/tua-mp.config.js`
        fs.writeFileSync(tuaMpConfig, ``)
        jest.doMock(tuaMpConfig, () => ({ mp: 1 }), { virtual: true })
        expect(readConfigFile('/')).toEqual({ mp: 1 })

        const tuaConfig = `/tua.config.js`
        fs.writeFileSync(tuaConfig, ``)
        jest.doMock(tuaConfig, () => ({ tua: 1 }), { virtual: true })

        expect(readConfigFile('/')).toEqual({ tua: 1 })
    })
})

describe('simple utils', () => {
    test('upperFirst', () => {
        expect(upperFirst('')).toBe('')
        expect(upperFirst('aaa')).toBe('Aaa')
    })

    test('camelCaseToHyphenCase', () => {
        expect(camelCaseToHyphenCase('')).toBe('')
        expect(camelCaseToHyphenCase('aBC')).toBe('a-b-c')
        expect(camelCaseToHyphenCase('aBcDe')).toBe('a-bc-de')
        expect(camelCaseToHyphenCase('ABcDe')).toBe('a-bc-de')
    })

    test('hyphenCaseToCamelCase', () => {
        expect(hyphenCaseToCamelCase('')).toBe('')
        expect(hyphenCaseToCamelCase('a-b-c')).toBe('aBC')
        expect(hyphenCaseToCamelCase('a-bc-de')).toBe('aBcDe')
    })

    test('hyphenCaseToUpperCamelCase', () => {
        expect(hyphenCaseToUpperCamelCase('')).toBe('')
        expect(hyphenCaseToUpperCamelCase('a-b-c')).toBe('ABC')
        expect(hyphenCaseToUpperCamelCase('a-bc-de')).toBe('ABcDe')
    })
})

describe('compileTmplToTarget', () => {
    beforeEach(fs.reset)

    const src = '/testSrc'
    const dist = '/testDist'
    const name = 'steve'
    const content = '{{ name }}'

    test('common', () => {
        fs.writeFileSync(src, content)

        return compileTmplToTarget({ src, dist })
            .then(() => promisify(fs.readFile)(dist))
            .then(c => c.toString())
            .then((n) => {
                expect(n).toBe('')
            })
    })

    test('Handlebars', () => {
        fs.writeFileSync(src, content)
        fs.writeFileSync(dist, '')

        return compileTmplToTarget({ src, dist, meta: { name }, isCover: true })
            .then(() => promisify(fs.readFile)(dist))
            .then(c => c.toString())
            .then((n) => {
                expect(n).toBe(name)
            })
    })

    test('inquirer cover', () => {
        fs.writeFileSync(src, content)
        fs.writeFileSync(dist, '')

        expectPrompts([{
            message: 'Target file exists. Continue?',
            confirm: true,
        }])

        return compileTmplToTarget({ src, dist, meta: { name } })
            .then(() => promisify(fs.readFile)(dist))
            .then(c => c.toString())
            .then((n) => {
                expect(n).toBe(name)
            })
    })

    test('inquirer cancel', () => {
        fs.writeFileSync(src, content)
        fs.writeFileSync(dist, '')

        expectPrompts([{
            message: 'Target file exists. Continue?',
            confirm: false,
        }])

        return compileTmplToTarget({ src, dist, meta: { name } })
            .then(() => promisify(fs.readFile)(dist))
            .then(c => c.toString())
            .then((n) => {
                expect(n).toBe('')
            })
    })
})
