import type { WorkerOptions } from 'node:worker_threads';

import { once } from 'node:events';
import { URL, pathToFileURL } from 'node:url';
import { Worker } from 'node:worker_threads';
import callsites from 'callsites';

interface WorkerData {
    readonly parent?: string | URL | undefined;
    readonly specifiers: readonly string[];
}

const isUrl = /^\w+:\/\/.+/;
const thisUrl = import.meta.url;
const workerURL = createWorkerURL(workerContext);

/**
 * Resolve a (single) module specifier.
 * @see [`import.meta.resolve`](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#importmetaresolvespecifier-parent)
 * @param specifier The module specifier to resolve relative to `parent`.
 * @param parent    The absolute parent module URL to resolve from. (@defaultValue [`import.meta.url`](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#importmetaurl))
 * @returns         A `Promise` that resolves to a module URL string.
*/
export async function importMetaResolve(specifier: string, parent?: string | URL) {
    parent ??= getCallerUrl();
    const [result] = await importMetaResolveAll([specifier], parent);
    return result!;
}

/**
 * Resolve multiple module specifiers with same `parent`.
 * @param specifiers    The array of module specifiers to resolve relative to `parent`.
 * @param parent        The absolute parent module URL to resolve from. (@defaultValue [`import.meta.url`](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#importmetaurl))
 * @returns             A `Promise` that resolves to an array of module URL strings.
 */
export async function importMetaResolveAll(specifiers: readonly string[], parent?: string | URL) {
    parent ??= getCallerUrl();
    const execArgv = Object.freeze([
        ...new Set(process.execArgv)
            .add('--experimental-import-meta-resolve')
            .add('--no-warnings')
    ]);
    const workerData: WorkerData = { parent, specifiers };
    const workerOptions = { execArgv, workerData } as WorkerOptions;
    const worker = new Worker(workerURL, workerOptions);
    try {
        const [results] = await once(worker, 'message') as [string[]];
        return results;
    } catch (e) {
        const { message, name } = Object(e) as Error;
        throw Object.assign(new Error(message), { name });
    } finally {
        void worker.terminate();
    }
}

function createWorkerURL(workerContextFunction: () => void | Promise<void>) {
    const fText = workerContextFunction.toString();
    const fBody = fText.slice(fText.indexOf('{') + 1, fText.lastIndexOf('}')).trim();
    return new URL(`data:text/javascript,${encodeURIComponent(fBody)}`);
}

function getCallerUrl() {
    for (const callSite of callsites()) {
        const uri = callSite.getFileName();
        if (uri) {
            const url = isUrl.test(uri) ? uri : pathToFileURL(uri).href;
            if (url !== thisUrl) {
                return url;
            }
        }
    }
    return undefined;
}

async function workerContext() {
    const { parentPort, workerData } = await import('node:worker_threads'); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const { parent, specifiers } = workerData as WorkerData;
    const results = await Promise.all(specifiers.map(specifier => import.meta.resolve!(specifier, parent)));
    parentPort!.postMessage(results);
}
