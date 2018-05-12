import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import eslint from 'rollup-plugin-eslint'
import uglify from 'rollup-plugin-uglify'

export default {
    input: 'src/index.js',
    output: {
        file: 'examples/basic/utils/tua-mp.js',
        name: 'TuaWx',
        format: 'umd',
        exports: 'named',
    },
    plugins: [
        eslint(),
        json(),
        babel(),
        uglify(),
    ]
}
