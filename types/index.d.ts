/// <reference types="node" />
import { URL } from 'url';
/**
 * Resolve a (single) module specifier.
 * @see [`import.meta.resolve`](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#esm_import_meta_resolve_specifier_parent)
 * @param specifier The module specifier to resolve relative to `parent`.
 * @param parent    The absolute parent module URL to resolve from. (@default [`import.meta.url`](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#esm_import_meta_url))
 * @returns         A `Promise` that resolves to a module URL string.
*/
declare function importMetaResolve(specifier: string, parent?: string | URL): Promise<string>;
/**
 * Resolve multiple module specifiers with same `parent`.
 * @param specifiers    The array of module specifiers to resolve relative to `parent`.
 * @param parent        The absolute parent module URL to resolve from. (@default [`import.meta.url`](https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#esm_import_meta_url))
 * @returns             A `Promise` that resolves to an array of module URL strings.
 */
declare function importMetaResolveAll(specifiers: readonly string[], parent?: string | URL): Promise<string[]>;
export { importMetaResolve, importMetaResolveAll };
//# sourceMappingURL=index.d.ts.map