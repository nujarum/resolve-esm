import { builtinModules } from 'node:module';
import nodeResolve from '@rollup/plugin-node-resolve';
import esbuild from 'rollup-plugin-esbuild';

export const esbuildOptions = Object.freeze({
    format: 'esm',
    minify: true,
    sourcemap: true,
    target: 'node16',
    treeShaking: true,
});

export const external = Object.freeze([
    ...builtinModules,
    /([/\\])node_modules\1/,
    /^@.+\//,
    /^#.+/,
]);

const outputOptions = Object.freeze({
    format: 'es',
    generatedCode: Object.freeze({
        constBindings: true,
        objectShorthand: true,
        symbols: true,
    }),
    sourcemap: true,
});

const plugins = Object.freeze([
    nodeResolve(),
    esbuild(esbuildOptions),
]);

const sources = Object.freeze([
    '_internal',
    'async/index',
    'async/worker',
    'sync/index',
    'sync/worker',
]);

export default sources.map(name => {
    return {
        input: `./src/${name}.ts`,
        external,
        output: {
            ...outputOptions,
            file: `./dist/${name}.mjs`,
        },
        plugins,
    };
});
