import{parentPort as r,workerData as t}from"node:worker_threads";const{parent:a,specifiers:o}=t,s=await Promise.all(o.map(e=>import.meta.resolve(e,a)));r.postMessage(s);
//# sourceMappingURL=worker.mjs.map
