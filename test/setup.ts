import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

export async function setup() {
    const pkgDir = new URL('./dummy/pkg/', import.meta.url);
    await npmInstall(pkgDir);
}

function npmInstall(pkgDir: string | URL) {
    const exec = promisify(execFile);
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    return exec(npm, ['install'], { cwd: pkgDir });
}
