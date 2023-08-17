import{parentPort as t,workerData as e}from"node:worker_threads";const{names:o,parent:r}=e,m=await Promise.all(o.map(a=>import.meta.resolve(a,r)));t.postMessage(m);
//# sourceMappingURL=worker.mjs.map
