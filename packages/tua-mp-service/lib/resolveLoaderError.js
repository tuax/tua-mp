// copy from https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-service/lib/util/resolveLoaderError.js

const rules = [
    {
        type: 'cant-resolve-loader',
        re: /Can't resolve '(.*loader)'/,
        msg: (e, match) => (
            `Failed to resolve loader: ${match[1]}\n` +
            `You may need to install it.`
        )
    },
]

const transformer = (error) => {
    if (error.webpackError) {
        const message = typeof error.webpackError === 'string'
            ? error.webpackError
            : error.webpackError.message || ''
        for (const { re, msg, type } of rules) {
            const match = message.match(re)

            if (match) {
                return Object.assign({}, error, {
                // type is necessary to avoid being printed as defualt error
                // by friendly-error-webpack-plugin
                type,
                shortMessage: msg(error, match)
                })
            }
        }
        // no match, unknown webpack error withotu a message.
        // friendly-error-webpack-plugin fails to handle this.
        if (!error.message) {
            return Object.assign({}, error, {
                type: 'unknown-webpack-error',
                shortMessage: message
            })
        }
    }
    return error
}

const formatter = (errors) => {
    errors = errors.filter(e => e.shortMessage)

    if (errors.length) {
        return errors.map(e => e.shortMessage)
    }
}

module.exports = {
    formatter,
    transformer,
}
