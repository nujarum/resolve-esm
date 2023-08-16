/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { parentPort, workerData } from 'node:worker_threads';

export interface WorkerData {
    readonly parent?: string | URL | undefined;
    readonly specifiers: readonly string[];
}

const { parent, specifiers } = workerData as WorkerData;
const results = await Promise.all(specifiers.map(specifier => import.meta.resolve!(specifier, parent)));
parentPort!.postMessage(results);
