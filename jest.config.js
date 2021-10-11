export default {
    // extensionsToTreatAsEsm: ['.ts'],
    globals: {
        'ts-jest': {
            // tsconfig: '<rootDir>/tsconfig.json',
            useESM: true,
        }
    },
    moduleNameMapper: {
        // '^#(.+)': '<rootDir>/src/$1.ts',
        '^#(.+)': '<rootDir>/dist/$1.mjs',
    },
    preset: 'ts-jest/presets/default-esm',
    // preset: 'ts-jest/presets/js-with-ts-esm',
    testMatch: [
        '<rootDir>/test/**/*.ts',
    ],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
};
