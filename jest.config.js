export default {
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
        'ts-jest': {
            // tsconfig: '<rootDir>/tsconfig.json',
            useESM: true,
        }
    },
    preset: 'ts-jest/presets/default-esm',
    // preset: 'ts-jest/presets/js-with-ts-esm',
    resolver: '<rootDir>/jest.resolver.cjs',
    testMatch: [
        '<rootDir>/test/**/*.ts',
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
