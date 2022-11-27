<h1>resolve-esm</h1>

["Experimental"]:           https://nodejs.org/docs/latest-v18.x/api/documentation.html#stability-index
["Stable"]:                 https://nodejs.org/docs/latest-v18.x/api/documentation.html#stability-index
[Node.js ES Modules]:       https://nodejs.org/docs/latest-v18.x/api/esm.html#modules-ecmascript-modules
[`import.meta.resolve`]:    https://nodejs.org/docs/latest-v18.x/api/esm.html#importmetaresolvespecifier-parent
[`import.meta.url`]:        https://nodejs.org/docs/latest-v18.x/api/esm.html#importmetaurl
[specification]:            https://nodejs.org/docs/latest-v18.x/api/esm.html#resolution-algorithm

Shim for [`import.meta.resolve`].

[![npm](https://badgen.net/npm/v/resolve-esm)](https://www.npmjs.com/package/resolve-esm)
[![downloads](https://badgen.net/npm/dt/resolve-esm)](https://www.npmjs.com/package/resolve-esm)
[![install size](https://packagephobia.com/badge?p=resolve-esm)](https://packagephobia.com/result?p=resolve-esm)
[![license](https://badgen.net/npm/license/resolve-esm)](https://github.com/nujarum/resolve-esm/blob/main/LICENSE)
[![node](https://badgen.net/npm/node/resolve-esm)](https://nodejs.org/)
[![types](https://badgen.net/npm/types/resolve-esm)](https://github.com/nujarum/resolve-esm/blob/main/types/index.d.ts)
[![vulnerabilities](https://snyk.io/test/github/nujarum/resolve-esm/badge.svg?targetFile=package.json)](https://github.com/nujarum/resolve-esm/network/dependencies)
[![CodeQL](https://github.com/nujarum/resolve-esm/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/nujarum/resolve-esm/actions/workflows/codeql-analysis.yml)

[`import.meta.resolve`] is currently ["Experimental"], and is only available with the `--experimental-import-meta-resolve` command flag enabled.<br/>
This module provides functions equivalent to [`import.meta.resolve`] without the experimental flag.

- [Differences from similar modules](#differences-from-similar-modules)
- [Usage](#usage)
- [API](#api)
    - [`importMetaResolve`](#importmetaresolve)
        - [Parameters](#parameters)
        - [Returns](#returns)
    - [`importMetaResolveAll`](#importmetaresolveall)
        - [Parameters](#parameters-1)
        - [Returns](#returns-1)
        - [What is this function for?](#what-is-this-function-for)

# Differences from similar modules

This module is just a "wrapper" that internally calls the original [`import.meta.resolve`] and has no resolve logic of its own.<br/>
Therefore, it will be easy to follow if the original [specification] changes, and easy to migrate when the original becomes ["Stable"] in the future.

# Usage

```console
$ npm i resolve-esm
```

```js
import { importMetaResolve } from 'resolve-esm';
```

> **Note** : This module works only in [Node.js ES Modules].

```js
await importMetaResolve('./other.js');
// => "file:///path/to/__dirname/other.js"

await importMetaResolve('./other.js', 'file:///different/path/base.js');
// => "file:///different/path/other.js"

await importMetaResolve('dependency');
// => "file:///path/to/node_modules/dependency/main.js"

await importMetaResolve('dependency', 'file:///different/path/base.js');
// => "file:///different/path/node_modules/dependency/main.js"

await importMetaResolve('fs');
// => "node:fs"
```

# API

## `importMetaResolve`

Resolve a (single) module specifier.

```ts
function importMetaResolve(specifier: string, parent?: string | URL): Promise<string>;
```

### Parameters
* `specifier` (Type: `string`)
  * The module specifier to resolve relative to `parent`.
* `parent` (Type: `string | URL | undefined`)
  * The absolute parent module URL to resolve from.
  * If none is specified, the value of [`import.meta.url`] is used as the default.

### Returns
A `Promise` that resolves to a module URL string.

## `importMetaResolveAll`

Resolve multiple module specifiers with same `parent`.

```ts
function importMetaResolveAll(iterable: Readonly<Iterable<string>>, parent?: string | URL): Promise<string[]>;
```

### Parameters
* `iterable` (Type: `Iterable<string>`)
  * An iterable (such as an array) of module specifiers to resolve relative to `parent`.
* `parent` (Type: `string | URL | undefined`)
  * The absolute parent module URL to resolve from.
  * If none is specified, the value of [`import.meta.url`] is used as the default.

### Returns
A `Promise` that resolves to an array of module URL strings.

### What is this function for?
For internal processing reasons, it is more efficient than calling `Promise.all()` on your own.
* works, but inefficient
  ```js
  const results = await Promise.all([
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
