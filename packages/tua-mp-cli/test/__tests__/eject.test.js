const fse = require('fs-extra')
const path = require('path')
const { expectPrompts } = require('inquirer')

const eject = require('../../lib/eject')

jest.mock('inquirer')

describe('eject', () => {
    // TODO: use memory fs
    const root = path.join('.temp/src', 'tua-mp-cli')
    const srcDir = path.join(root, 'eject-src')
    const distDir = path.join(root, 'eject-dist')
    const srcMd = path.join(srcDir, 'README.md')
    const distMd = path.join(distDir, 'README.md')

    const readMd = () => fse.readFile(distMd, 'utf-8')
    const existsMd = () => fse.pathExists(distMd)

    beforeEach(async () => {
        process.env.TUA_CLI_TEST_SRC = srcDir
        process.env.TUA_CLI_TEST_DIST = distDir

        await fse.emptyDir(srcDir)
        await fse.emptyDir(distDir)
        await fse.outputFile(distMd, '')
    })

    test('copy', async () => {
        await fse.outputFile(srcMd, '')
        await fse.remove(distDir)
        expect(await existsMd()).toBe(false)

        await eject()
        expect(await existsMd()).toBe(true)
    })

    test('cover', async () => {
        const content = 'test cover'

        await fse.outputFile(srcMd, content)
        expectPrompts([{
            message: 'Target directory exists. Continue?',
            confirm: true,
        }])
        expect(await readMd()).toBe('')

        await eject()

        expect(await readMd()).toBe(content)
    })

    test('cancel', async () => {
        const content = 'test cancel'

        await fse.outputFile(srcMd, content)
        expectPrompts([{
            message: 'Target directory exists. Continue?',
            confirm: false,
        }])
        expect(await readMd()).toBe('')

        await eject()

        expect(await readMd()).toBe('')
    })
})
