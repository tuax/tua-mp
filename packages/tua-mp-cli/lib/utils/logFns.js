const chalk = require('chalk')
const logSymbols = require('log-symbols')

const logByType = (type) => (out, err) => {
    /* istanbul ignore else */
    if (process.env.NODE_ENV === 'test') return

    /* istanbul ignore next */
    err ? console[type](out, err) : console[type](out)
}

const log = out => logByType('log')(logSymbols.success + ' ' + chalk.green(out))
const info = out => logByType('log')(logSymbols.info + ' ' + chalk.blue(out))
const warn = out => logByType('warn')(logSymbols.warning + ' ' + chalk.yellow(out))
const error = out => logByType('error')(logSymbols.error + ' ' + chalk.red(out))

const catchAndThrow = (err) => {
    err instanceof Error ? logByType('error')(logSymbols.error, err) : error(err)

    return process.env.NODE_ENV === 'test' && Promise.reject(Error())
}

module.exports = {
    log,
    info,
    warn,
    error,
    catchAndThrow,
}
