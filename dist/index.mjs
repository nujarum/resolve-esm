import{once as t}from"events";import{Worker as e}from"worker_threads";import{URL as r,pathToFileURL as n}from"url";import o from"callsites";const s=Object.freeze(["--experimental-import-meta-resolve"]);const i=/^\w+:\/\//;const a=m(p);async function c(t,e){e??(e=l());const[r]=await f([t],e);return r}async function f(r,n){n??(n=l());const o={parent:n,specifiers:r};const i={execArgv:s,workerData:o};const c=new e(a,i);try{const[e]=await t(c,"message");return e}finally{void c.terminate()}}function m(t){const e=t.toString();const n=e.slice(e.indexOf("{")+1,e.lastIndexOf("}")).trim();return new r(`data:text/javascript,${n}`)}function l(){const t=o();for(let e=t.length,r;r=t[--e];){const t=r.getFileName();if(t&&!t.startsWith("internal/")){if(i.test(t)){return t}const{href:e}=n(t);if(!e.includes("/node_modules/")){return e}}}return undefined}async function p(){const{parentPort:t,workerData:e}=await import("worker_threads");const{parent:r,specifiers:n}=e;const o=await Promise.all(n.map((t=>import.meta.resolve(t,r))));t.postMessage(o)}export{c as importMetaResolve,f as importMetaResolveAll};
//# sourceMappingURL=index.mjs.map
