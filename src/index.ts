import type { WorkerOptions } from 'worker_threads';
import type { CallSite } from 'callsites';

import { once } from 'events';
import { Worker } from 'worker_threads';
import { URL, pathToFileURL } from 'url';
import callsites from 'callsites';

interface WorkerData {
    readonly parent?: string | URL | undefined;
    readonly specifiers: readonly string[];
}

const execArgv = Object.freeze([
    '--experimental-import-meta-resolve',
]) as string[];
const regexpUrl = /^\w+:\/\//;
const workerUrl = createWorkerURL(workerContext);

/**
 * Resolve a (single) module specifier.
 * @see [import.meta.resolve](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#esm_import_meta_resolve_specifier_parent)
 * @param specifier The module specifier to resolve relative to `parent`.
 * @param parent    The absolute parent module URL to resolve from. (@default [`import.meta.url`](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#esm_import_meta_url))
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
 * @param parent        The absolute parent module URL to resolve from. (@default [`import.meta.url`](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#esm_import_meta_url))
 * @returns             A `Promise` that resolves to an array of module URL strings.
 */
export async function importMetaResolveAll(specifiers: readonly string[], parent?: string | URL) {
    parent ??= getCallerUrl();
    const workerData: WorkerData = { parent, specifiers };
    const workerOptions: WorkerOptions = { execArgv, workerData };
    const worker = new Worker(workerUrl, workerOptions);
    try {
        const [results] = await once(worker, 'message') as [string[]];
        return results;
    } finally {
        void worker.terminate();
    }
}

function createWorkerURL(workerContextFunction: () => void | Promise<void>) {
    const fText = workerContextFunction.toString();
    const fBody = fText.slice(fText.indexOf('{') + 1, fText.lastIndexOf('}')).trim();
    return new URL(`data:text/javascript,${fBody}`);
}

function getCallerUrl() {
    const callSites = callsites();
    for (let i = callSites.length, callSite: CallSite | undefined; callSite = callSites[--i];) { // eslint-disable-line no-cond-assign
        const uri = callSite.getFileName();
        if (uri && !uri.startsWith('internal/')) {
            if (regexpUrl.test(uri)) {
                return uri;
            }
            const { href } = pathToFileURL(uri);
            if (!href.includes('/node_modules/')) {
                return href;
            }
        }
    }
    return undefined;
}

async function workerContext() {
    const { parentPort, workerData } = await import('worker_threads'); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    const { parent, specifiers } = workerData as WorkerData;
    const results = await Promise.all(specifiers.map(specifier => import.meta.resolve!(specifier, parent)));
    parentPort!.postMessage(results);
}
