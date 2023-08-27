import type { WorkerOptions } from 'node:worker_threads';
import type { WorkerData } from './worker';

import { Worker } from 'node:worker_threads';
import { createRequire } from 'node:module';
import { execArgv, getCallerUrl } from '#_internal';

const enum $ {
    INDEX           = 0,
    INT32_BYTES     = 4,
    LEFT_SHIFT      = 10,
    TIMEOUT_MSEC    = 1000,
    WAIT_VALUE      = 0,    // eslint-disable-line @typescript-eslint/no-duplicate-enum-values
}

const baseUrl = import.meta.url;
const require = createRequire(baseUrl);
const textDecoder = new TextDecoder();
const workerPath = require.resolve('#worker/sync');

/**
 * Resolve a (single) module specifier.
 * @see [`import.meta.resolve`](https://nodejs.org/docs/latest/api/esm.html#importmetaresolvespecifier-parent)
 * @param specifier The module specifier to resolve relative to `parent`.
 * @param parent    The absolute parent module URL to resolve from. (@defaultValue [`import.meta.url`](https://nodejs.org/docs/latest/api/esm.html#importmetaurl))
 * @returns         A module URL string.
 */
export function importMetaResolve(specifier: string, parent?: string | URL): string {
    const [result] = importMetaResolveAll([specifier], parent);
    return result!;
}

/**
 * Resolve multiple module specifiers with the same `parent`.
 * @param iterable  An iterable (such as an array) of module specifiers to resolve relative to `parent`.
 * @param parent    The absolute parent module URL to resolve from. (@defaultValue [`import.meta.url`](https://nodejs.org/docs/latest/api/esm.html#importmetaurl))
 * @returns         An array of module URL strings.
 */
export function importMetaResolveAll(iterable: Readonly<Iterable<string>>, parent?: string | URL): string[] {
    const sources = Array.isArray(iterable) ? iterable as string[] : [...iterable];
    if (sources.length < 1) {
        return [];
    }
    const names = [...new Set(sources)]; // dedupe
    parent ??= getCallerUrl(baseUrl);
    let worker: Worker | undefined;
    try {
        const buffer = new SharedArrayBuffer((names.length + 1) << $.LEFT_SHIFT);
        const int32Array = new Int32Array(buffer);
        let unknownError: Error | undefined;
        worker = new Worker(workerPath, {
            execArgv,
            workerData: { buffer, names, parent } satisfies WorkerData,
        } as WorkerOptions).once('error', e => unknownError = e);
        Atomics.wait(int32Array, $.INDEX, $.WAIT_VALUE, $.TIMEOUT_MSEC);
        if (unknownError) {
            throw unknownError;
        }
        const byteLength = int32Array[0]!;
        const data = new Uint8Array(buffer, $.INT32_BYTES, Math.abs(byteLength));
        const text = textDecoder.decode(data);
        if (!(0 < byteLength)) {
            throw Object.assign(new Error(), JSON.parse(text || 'null'));
        }
        const results = text.split('\0');
        const urlMap = names.reduce((obj, name, i) => {
            obj[name] = results[i]!;
            return obj;
        }, Object.create(null) as Record<string, string>);
        return sources.map(name => urlMap[name]!);
    } finally {
        void worker?.terminate();
    }
}
