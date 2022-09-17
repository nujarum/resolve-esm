const tsJestOptions = Object.freeze({
    useESM: true,
});

/** @see [ts-jest » Docs » ESM Support](https://kulshekhar.github.io/ts-jest/docs/guides/esm-support) */
export default {
    extensionsToTreatAsEsm: ['.ts'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    // preset: 'ts-jest/presets/default-esm',
    reporters: ['default', 'github-actions'],
    resolver: '<rootDir>/jest.resolver.cjs',
    roots: [
        '<rootDir>/src',
        '<rootDir>/test',
    ],
    testMatch: [
        '**/*.spec.ts',
    ],
    transform: {
        '^.+\\.ts$': ['ts-jest', tsJestOptions],
    },
};
