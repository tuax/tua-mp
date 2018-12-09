module.exports = {
    env: {
        test: {
            presets: [
                [
                    '@babel/preset-env',
                    { targets: { 'node': 'current' } },
                ],
            ],
            plugins: [
                [
                    '@babel/plugin-proposal-decorators',
                    { legacy: true },
                ],
            ],
        },
        prod: {
            presets: [
                [
                    '@babel/preset-env',
                    { modules: false },
                ],
            ],
            plugins: [
                [
                    '@babel/plugin-proposal-decorators',
                    { legacy: true },
                ],
                '@babel/plugin-proposal-object-rest-spread',
            ],
        },
    },
}
