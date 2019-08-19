import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import { eslint } from 'rollup-plugin-eslint'

import * as pkg from './package.json'

const input = `src/index.js`
const banner = `/* ${pkg.name} version ${pkg.version} */`

export default {
    input,
    output: [{
        file: pkg.module,
        banner,
        format: 'esm',
    }, {
        file: pkg.main,
        banner,
        format: 'cjs',
    }],
    plugins: [
        eslint(),
        json(),
        babel(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ]
}
