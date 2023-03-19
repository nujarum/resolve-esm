import { esbuildOptions } from './rollup.config.js';

const esbuildJestOptions = Object.freeze({
    ...esbuildOptions,
    target: 'node18',
});

/** @type {import('jest').Config} */
export default {
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^#(.+)$': '<rootDir>/dist/$1.js',
    },
    reporters: ['default', 'github-actions'],
    resolver: 'ts-jest-resolver',
    roots: [
        '<rootDir>/src',
        '<rootDir>/test',
    ],
    testMatch: [
        '**/*.spec.ts',
    ],
    transform: {
        '^.+\\.ts$': ['esbuild-jest', esbuildJestOptions],
    },
};
