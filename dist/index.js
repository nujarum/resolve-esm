import{once as t}from"node:events";import{URL as e,pathToFileURL as n}from"node:url";import{Worker as r}from"node:worker_threads";import o from"callsites";const s=Object.freeze(["--experimental-import-meta-resolve"]);const a=/^\w+:\/\/.+/;const c=import.meta.url;const i=p(u);async function m(t,e){e??(e=l());const[n]=await f([t],e);return n}async function f(e,n){n??(n=l());const o={parent:n,specifiers:e};const a={execArgv:s,workerData:o};const c=new r(i,a);try{const[e]=await t(c,"message");return e}catch(t){const{message:e,name:n}=Object(t);throw Object.assign(new Error(e),{name:n})}finally{void c.terminate()}}function p(t){const n=t.toString();const r=n.slice(n.indexOf("{")+1,n.lastIndexOf("}")).trim();return new e(`data:text/javascript,${encodeURIComponent(r)}`)}function l(){for(const t of o()){const e=t.getFileName();if(e){const t=a.test(e)?e:n(e).href;if(t!==c){return t}}}return undefined}async function u(){const{parentPort:t,workerData:e}=await import("worker_threads");const{parent:n,specifiers:r}=e;const o=await Promise.all(r.map((t=>import.meta.resolve(t,n))));t.postMessage(o)}export{m as importMetaResolve,f as importMetaResolveAll};
//# sourceMappingURL=index.js.map
