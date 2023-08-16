/// <reference types="node" />
export interface WorkerData {
    readonly buffer: SharedArrayBuffer;
    readonly parent?: string | URL | undefined;
    readonly specifiers: readonly string[];
}
//# sourceMappingURL=worker.d.ts.map