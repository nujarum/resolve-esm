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

const { buffer, parent, specifiers } = workerData as WorkerData;
const destination = new Uint8Array(buffer, $.INT32_BYTES);
const int32Array = new Int32Array(buffer);
const textEncoder = new TextEncoder();

let value: number | undefined;
try {
    const results = await Promise.all(specifiers.map(specifier => import.meta.resolve!(specifier, parent)));
    const text = results.join('\0');
    value = encode(text, destination) || NaN;
} catch (e) {
    const text = JSON.stringify(e, ['cause', 'message', 'name', 'stack'] satisfies (keyof Error)[]);
    value = -encode(text, destination);
} finally {
    Atomics.store(int32Array, $.INDEX, value!);
    Atomics.notify(int32Array, $.INDEX);
}

function encode(text: string, destination: Uint8Array) {
    const { read, written } = textEncoder.encodeInto(text, destination);
    if (read === text.length) {
        return written;
    } else {
        throw new RangeError('Too long text');
    }
}
