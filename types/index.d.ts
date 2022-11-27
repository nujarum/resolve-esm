/// <reference types="node" />
import { URL } from 'node:url';
/**
 * Resolve a (single) module specifier.
 * @see [`import.meta.resolve`](https://nodejs.org/docs/latest-v18.x/api/esm.html#importmetaresolvespecifier-parent)
 * @param specifier The module specifier to resolve relative to `parent`.
 * @param parent    The absolute parent module URL to resolve from. (@defaultValue [`import.meta.url`](https://nodejs.org/docs/latest-v18.x/api/esm.html#importmetaurl))
 * @returns         A `Promise` that resolves to a module URL string.
*/
declare function importMetaResolve(specifier: string, parent?: string | URL): Promise<string>;
/**
 * Resolve multiple module specifiers with same `parent`.
 * @param iterable  An iterable (such as an array) of module specifiers to resolve relative to `parent`.
 * @param parent    The absolute parent module URL to resolve from. (@defaultValue [`import.meta.url`](https://nodejs.org/docs/latest-v18.x/api/esm.html#importmetaurl))
 * @returns         A `Promise` that resolves to an array of module URL strings.
 */
declare function importMetaResolveAll(iterable: Readonly<Iterable<string>>, parent?: string | URL): Promise<string[]>;
export { importMetaResolve, importMetaResolveAll };
//# sourceMappingURL=index.d.ts.map