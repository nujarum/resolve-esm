<h1>resolve-esm</h1>

[`import.meta.resolve`]:https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#esm_import_meta_resolve_specifier_parent
[`import.meta.url`]:    https://nodejs.org/dist/latest-v16.x/docs/api/esm.html#esm_import_meta_url
[`Stability 1`]:        https://nodejs.org/dist/latest-v16.x/docs/api/documentation.html#documentation_stability_index
["Stable"]:             https://nodejs.org/dist/latest-v16.x/docs/api/documentation.html#documentation_stability_index

Shim for [`import.meta.resolve`].

[![npm](https://img.shields.io/npm/v/@nujarum/resolve-esm)](https://www.npmjs.com/package/@nujarum/resolve-esm)
[![code size](https://img.shields.io/github/languages/code-size/nujarum/resolve-esm)](https://github.com/nujarum/resolve-esm/)
[![license](https://img.shields.io/github/license/nujarum/resolve-esm)](https://github.com/nujarum/resolve-esm/blob/main/LICENSE)
[![node](https://img.shields.io/node/v/@nujarum/resolve-esm)](https://nodejs.org/)
[![vulnerabilities](https://snyk.io/test/github/nujarum/resolve-esm/badge.svg?targetFile=package.json)](https://github.com/nujarum/resolve-esm/network/dependencies)
[![CodeQL](https://github.com/nujarum/resolve-esm/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/nujarum/resolve-esm/actions/workflows/codeql-analysis.yml)
[![Open in VSCode](https://open.vscode.dev/badges/open-in-vscode.svg)](https://open.vscode.dev/nujarum/resolve-esm)

[`import.meta.resolve`] is currently experimental feature ([`Stability 1`]), and is only available with the `--experimental-import-meta-resolve` command flag enabled.

This module provides functions equivalent to [`import.meta.resolve`] without the experimental flag.

- [Usage](#usage)
- [API](#api)
  - [`importMetaResolve`](#importmetaresolve)
    - [Parameters](#parameters)
    - [Returns](#returns)
  - [`importMetaResolveAll`](#importmetaresolveall)
    - [Parameters](#parameters-1)
    - [Returns](#returns-1)
    - [What is this function for?](#what-is-this-function-for)
- [Differences from similar modules](#differences-from-similar-modules)


# Usage

```shell-session
npm i @nujarum/resolve-esm
```

> **Note:**<br>
> This module is only available in ES Module.

```js
import { importMetaResolve } from '@nujarum/resolve-esm';
```
```js
await importMetaResolve('./other.mjs');
// => file:///path/to/__dirname/other.mjs

await importMetaResolve('./other.mjs', 'file:///different/path/parent.mjs');
// => file:///different/path/other.mjs

await importMetaResolve('dependency');
// => file:///path/to/node_modules/dependency/main.mjs

await importMetaResolve('dependency', 'file:///different/path/parent.mjs');
// => file:///different/path/node_modules/dependency/main.mjs

await importMetaResolve('fs');
// => node:fs
```

# API

## `importMetaResolve`

```ts
declare function importMetaResolve(specifier: string, parent?: string | URL): Promise<string>;
```

> **Note:**<br>
> The I/F of this function is the same as the original [`import.meta.resolve`].

### Parameters
* `specifier` (`string`)
  * The module specifier to resolve relative to `parent`.
* `parent` (`string` | `URL` | `undefined`)
  * The absolute parent module URL to resolve from.
  * If none is specified, the value of [`import.meta.url`] is used as the default.

### Returns
A `Promise` that resolves to a module URL string.

## `importMetaResolveAll`

```ts
declare function importMetaResolveAll(specifiers: readonly string[], parent?: string | URL): Promise<string[]>;
```

> **Note:**<br>
> This function receives an array of multiple specifiers as its first parameter.<br>

### Parameters
* `specifiers` (`string[]`)
  * The array of module specifiers to resolve relative to `parent`.
* `parent` (`string` | `URL` | `undefined`)
  * The absolute parent module URL to resolve from.
  * If none is specified, the value of [`import.meta.url`] is used as the default.

### Returns
A `Promise` that resolves to an array of module URL strings.

### What is this function for?
For internal processing reasons, it is more efficient than calling `Promise.all()` on your own.
* works, but inefficient
  ```js
  const result = await Promise.all([
      importMetaResolve('specifier1'),
      importMetaResolve('specifier2'),
      importMetaResolve('specifier3'),
  ]);
  ```
* better
  ```js
  const results = await importMetaResolveAll([
      'specifier1',
      'specifier2',
      'specifier3',
  ]);
  ```

# Differences from similar modules

This module is just a "wrapper" that internally calls the original `import.meta.resolve` and has no resolve logic of its own.

Therefore, if the specification of the original `import.meta.url` changes, it will be easy to follow, and if the original becomes ["Stable"] in the future, it will be easy to migrate.
