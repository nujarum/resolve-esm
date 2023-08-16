import type { WorkerOptions } from 'node:worker_threads';
import type { WorkerData } from './worker';

import { once } from 'node:events';
import { createRequire } from 'node:module';
import { Worker } from 'node:worker_threads';
import { execArgv, getCallerUrl } from '#_internal';

const baseUrl = import.meta.url;
const require = createRequire(baseUrl);
const workerPath = require.resolve('#worker/async');

/**
 * Resolve a (single) module specifier.
 * @see [`import.meta.resolve`](https://nodejs.org/docs/latest-v18.x/api/esm.html#importmetaresolvespecifier-parent)
 * @param specifier The module specifier to resolve relative to `parent`.
 * @param parent    The absolute parent module URL to resolve from. (@defaultValue [`import.meta.url`](https://nodejs.org/docs/latest-v18.x/api/esm.html#importmetaurl))
 * @returns         A `Promise` that resolves to a module URL string.
 */
export async function importMetaResolve(specifier: string, parent?: string | URL): Promise<string> {
    const [result] = await importMetaResolveAll([specifier], parent);
    return result!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
}

/**
 * Resolve multiple module specifiers with the same `parent`.
 * @param iterable  An iterable (such as an array) of module specifiers to resolve relative to `parent`.
 * @param parent    The absolute parent module URL to resolve from. (@defaultValue [`import.meta.url`](https://nodejs.org/docs/latest-v18.x/api/esm.html#importmetaurl))
 * @returns         A `Promise` that resolves to an array of module URL strings.
 */
export async function importMetaResolveAll(iterable: Readonly<Iterable<string>>, parent?: string | URL): Promise<string[]> {
    const specifiers = Array.isArray(iterable) ? iterable : [...iterable];
    if (specifiers.length < 1) {
        return [];
    }
    parent ??= getCallerUrl(baseUrl);
    const worker = new Worker(workerPath, {
        execArgv,
        workerData: { parent, specifiers } satisfies WorkerData,
    } as WorkerOptions);
    try {
        const [results] = await once(worker, 'message') as [string[]];
        return results;
    } catch (e) {
        const { message, name, stack } = Object(e) as Error;
        throw Object.assign(new Error(), { message, name, stack });
    } finally {
        void worker.terminate();
    }
}
