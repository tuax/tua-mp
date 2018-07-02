import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint'
import replace from 'rollup-plugin-replace'

export default {
    input: 'src/index.js',
    output: {
        file: 'examples/basic/utils/tua-mp.js',
        name: 'TuaMp',
        format: 'es',
        exports: 'named',
    },
    plugins: [
        eslint(),
        json(),
        babel(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ]
}
