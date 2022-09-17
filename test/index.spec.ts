import { URL } from 'node:url';
import { expect, test } from '@jest/globals';
import { importMetaResolve, importMetaResolveAll } from '#index';

test('importMetaResolve', async () => {
    expect(typeof importMetaResolve).toBe('function');
    const actual = await importMetaResolve('tslib');
    const expected = new URL('../node_modules/tslib/modules/index.js', import.meta.url).href;
    expect(actual).toBe(expected);
});

test('importMetaResolveAll', async () => {
    expect(typeof importMetaResolveAll).toBe('function');
    const current = import.meta.url;
    const actual = await importMetaResolveAll([
        '@rollup/plugin-node-resolve',
        '@rollup/pluginutils',
        'rollup',
    ]);
    const expected = [
        new URL('../node_modules/@rollup/plugin-node-resolve/dist/es/index.js', current).href,
        new URL('../node_modules/@rollup/pluginutils/dist/es/index.js', current).href,
        new URL('../node_modules/rollup/dist/es/rollup.js', current).href,
    ];
    expect(actual).toEqual(expected);
});
