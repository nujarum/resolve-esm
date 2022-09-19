import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { beforeAll, describe, expect, test } from '@jest/globals';

process.execArgv.push('--conditions=development');
const { importMetaResolve, importMetaResolveAll } = await import('#index');
const thisUrl = import.meta.url;

describe('general use case', () => {

    test('importMetaResolve', async () => {
        expect(typeof importMetaResolve).toBe('function');
        const actual = await importMetaResolve('tslib');
        const expected = new URL('../node_modules/tslib/modules/index.js', thisUrl).href;
        expect(actual).toBe(expected);
    });

    test('importMetaResolveAll', async () => {
        expect(typeof importMetaResolveAll).toBe('function');
        const actual = await importMetaResolveAll([
            '@rollup/plugin-node-resolve',
            '@rollup/pluginutils',
            'rollup',
        ]);
        const expected = [
            new URL('../node_modules/@rollup/plugin-node-resolve/dist/es/index.js', thisUrl).href,
            new URL('../node_modules/@rollup/pluginutils/dist/es/index.js', thisUrl).href,
            new URL('../node_modules/rollup/dist/es/rollup.js', thisUrl).href,
        ];
        expect(actual).toEqual(expected);
    });

});

describe('with user conditions', () => {

    const pkgDir = new URL('./dummy/pkg/', thisUrl);
    const libDir = new URL('./dummy/lib/', thisUrl);

    beforeAll(() => npmInstall(pkgDir));

    test('resolve @dummy/lib from @dummy/pkg', async () => {
        const parent = new URL('./package.json', pkgDir).href;
        const actual = await importMetaResolve('@dummy/lib', parent);
        const expected = new URL('development.js', libDir).href;
        expect(actual).toBe(expected);
    });

    function npmInstall(pkgDir: string | URL) {
        const exec = promisify(execFile);
        const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        return exec(npm, ['install'], { cwd: pkgDir });
    }

});
