'use strict';
module.exports = {
    env: {
        'es2021': true,
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
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
            ],
            files: [
                'src/**/*.ts',
                'test/**/*.ts',
            ],
            parserOptions: {
                project: 'tsconfig.json',
            },
            rules: {
                'semi': ['error', 'always'],
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
    root: true,
};
