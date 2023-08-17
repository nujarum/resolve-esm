import { parentPort, workerData } from 'node:worker_threads';

export interface WorkerData {
    readonly names: readonly string[];
    readonly parent?: string | URL | undefined;
}

const { names, parent } = workerData as WorkerData;
const results = await Promise.all(names.map(name => import.meta.resolve!(name, parent)));
parentPort!.postMessage(results);
