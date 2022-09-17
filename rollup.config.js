import { builtinModules } from 'node:module';
import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-ts';

const external = Object.freeze([
    ...builtinModules,
    /([/\\])node_modules\1/,
]);
const terserOptions = Object.freeze({
    compress: false,
    // format: { beautify: true },  // for debug
    ecma: 2022,
});

export default {
    input: 'src/index.ts',
    external,
    output: {
        file: 'dist/index.js',
        format: 'es',
        preferConst: true,
        sourcemap: true,
    },
    plugins: [
        nodeResolve(),
        typescript(),
        terser(terserOptions),
    ],
};
