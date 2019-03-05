module.exports = {
    env: {
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    { targets: { 'node': 'current' } },
                ],
            ],
        },
        production: {
            presets: [
                [
                    '@babel/preset-env',
                    { modules: false },
                ],
            ],
            plugins: [
                '@babel/plugin-proposal-object-rest-spread',
            ],
        },
    },
}
