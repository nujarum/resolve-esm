import{once as t}from"node:events";import{URL as e,pathToFileURL as n}from"node:url";import{Worker as r}from"node:worker_threads";import o from"callsites";const s=Object.freeze([...new Set(process.execArgv).add("--experimental-import-meta-resolve").add("--no-warnings")]);const a=/^\w+:\/\/.+/;const c=import.meta.url;const i=p(l);async function m(t,e){const[n]=await f([t],e);return n}async function f(e,n){const o=Array.isArray(e)?e:[...e];if(o.length<1){return[]}n??(n=d());const a={parent:n,specifiers:o};const c={execArgv:s,workerData:a};const m=new r(i,c);try{const[e]=await t(m,"message");return e}catch(t){const{message:e,name:n}=Object(t);throw Object.assign(new Error(e),{name:n})}finally{void m.terminate()}}function p(t){const n=t.toString();const r=n.slice(n.indexOf("{")+1,n.lastIndexOf("}")).trim();return new e(`data:text/javascript,${encodeURIComponent(r)}`)}function d(){for(const t of o()){const e=t.getFileName();if(e){const t=a.test(e)?e:n(e).href;if(t!==c){return t}}}return undefined}async function l(){const{parentPort:t,workerData:e}=await import("node:worker_threads");const{parent:n,specifiers:r}=e;const o=await Promise.all(r.map((t=>import.meta.resolve(t,n))));t.postMessage(o)}export{m as importMetaResolve,f as importMetaResolveAll};
//# sourceMappingURL=index.js.map
