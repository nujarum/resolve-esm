'use strict';
module.exports = {
    env: {
        'es2022': true,
        'node': true,
    },
    ignorePatterns: [
        '**/*.js',
        '**/*.cjs',
        '**/*.mjs',
    ],
    overrides: [
        {
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/strict-type-checked',
                'plugin:@typescript-eslint/stylistic-type-checked',
            ],
            files: [
                'src/**/*.ts',
                'test/**/*.ts',
            ],
            parserOptions: {
                project: 'tsconfig.json',
            },
            plugins: [
                'unicorn',
            ],
            rules: {
                'semi': ['error', 'always'],
                '@typescript-eslint/no-invalid-void-type': 'off',
                '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/prefer-reduce-type-parameter': 'off',
                'unicorn/prefer-node-protocol': 'error',
            },
        },
    ],
    root: true,
};
