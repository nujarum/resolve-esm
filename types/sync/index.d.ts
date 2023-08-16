/// <reference types="node" />
/**
 * Resolve a (single) module specifier.
 * @see [`import.meta.resolve`](https://nodejs.org/docs/latest/api/esm.html#importmetaresolvespecifier-parent)
 * @param specifier The module specifier to resolve relative to `parent`.
 * @param parent    The absolute parent module URL to resolve from. (@defaultValue [`import.meta.url`](https://nodejs.org/docs/latest/api/esm.html#importmetaurl))
 * @returns         A module URL string.
 */
export declare function importMetaResolve(specifier: string, parent?: string | URL): string;
/**
 * Resolve multiple module specifiers with the same `parent`.
 * @param iterable  An iterable (such as an array) of module specifiers to resolve relative to `parent`.
 * @param parent    The absolute parent module URL to resolve from. (@defaultValue [`import.meta.url`](https://nodejs.org/docs/latest/api/esm.html#importmetaurl))
 * @returns         An array of module URL strings.
 */
export declare function importMetaResolveAll(iterable: Readonly<Iterable<string>>, parent?: string | URL): string[];
//# sourceMappingURL=index.d.ts.map