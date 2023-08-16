/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { workerData } from 'node:worker_threads';

export interface WorkerData {
    readonly buffer: SharedArrayBuffer;
    readonly parent?: string | URL | undefined;
    readonly specifiers: readonly string[];
}

const enum $ {
    INDEX       = 0,
    INT32_BYTES = 4,
}

const encoder = new TextEncoder();
const errorPropertyNames = Object.freeze([
    'cause',
    'message',
    'name',
    'stack',
] as const satisfies readonly (keyof Error)[]);

const { buffer, parent, specifiers } = workerData as WorkerData;
const destination = new Uint8Array(buffer, $.INT32_BYTES);
const int32Array = new Int32Array(buffer);
try {
    const results = await Promise.all(specifiers.map(specifier => import.meta.resolve!(specifier, parent)));
    const text = results.join(',');
    const written = encode(text, destination);
    Atomics.store(int32Array, $.INDEX, written || NaN);
    Atomics.notify(int32Array, $.INDEX);
} catch (e) {
    const text = JSON.stringify(e, errorPropertyNames as unknown as string[]);
    const written = encode(text, destination);
    Atomics.store(int32Array, $.INDEX, -written);
    Atomics.notify(int32Array, $.INDEX);
}

function encode(text: string, destination: Uint8Array) {
    const { read, written } = encoder.encodeInto(text, destination);
    if (read === text.length) {
        return written;
    } else {
        throw new RangeError('Too long text');
    }
}
