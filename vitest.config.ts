import { defineConfig } from 'vitest/config';
import { esbuildOptions, external } from './rollup.config';

export default defineConfig({
    esbuild: { ...esbuildOptions, minify: undefined as never },
    resolve: {
        alias: [
            { find: /^#worker\/(.+)$/, replacement: './src/$1/worker' },
            { find: /^#(.+)$/, replacement: './src/$1' },
        ],
    },
    test: {
        coverage: {
            reporter: [
                ['text', { file: 'report.txt' }],
                'text',
            ],
        },
        globalSetup: [
            './test/setup.ts',
        ],
        server: {
            deps: {
                external: [...external],
            },
        },
        sequence: {
            concurrent: true,
        },
        testTimeout: 10000,
    },
});
