import { execFile } from 'node:child_process';
import { URL } from 'node:url';
import { promisify } from 'node:util';
import { beforeAll, expect, test } from '@jest/globals';
import { importMetaResolve } from '#index';

const pkgDir = new URL('./dummy/pkg/', import.meta.url);

beforeAll(() => npmInstall(pkgDir));

test('resolve user condition', async () => {
    process.execArgv.push('--conditions=development');
    const libDir = new URL('./dummy/lib/', import.meta.url);
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
