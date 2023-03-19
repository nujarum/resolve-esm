import { builtinModules } from 'node:module';
import nodeResolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';

const external = Object.freeze([
    ...builtinModules,
    /([/\\])node_modules\1/,
]);

export const esbuildOptions = Object.freeze({
    format: 'esm',
    minify: true,
    sourcemap: true,
    target: 'node14',
    treeShaking: true,
});

export default {
    input: 'src/index.ts',
    external,
    output: {
        file: 'dist/index.js',
        format: 'es',
        generatedCode: Object.freeze({
            constBindings: true,
            objectShorthand: true,
            symbols: true,
        }),
        sourcemap: true,
    },
    plugins: [
        nodeResolve(),
        esbuild(esbuildOptions),
    ],
};
