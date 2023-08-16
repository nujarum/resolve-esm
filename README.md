<h1>resolve-esm</h1>

[_Experimental_]:           https://nodejs.org/docs/latest/api/documentation.html#stability-index
[_Stable_]:                 https://nodejs.org/docs/latest/api/documentation.html#stability-index
[ES Modules]:               https://nodejs.org/docs/latest/api/esm.html#modules-ecmascript-modules
[`import.meta.resolve`]:    https://nodejs.org/docs/latest/api/esm.html#importmetaresolvespecifier-parent
[`import.meta.url`]:        https://nodejs.org/docs/latest/api/esm.html#importmetaurl
[specification]:            https://nodejs.org/docs/latest/api/esm.html#resolution-algorithm

Shim for [`import.meta.resolve`].

[![npm](https://badgen.net/npm/v/resolve-esm)](https://www.npmjs.com/package/resolve-esm)
[![downloads](https://badgen.net/npm/dt/resolve-esm)](https://www.npmjs.com/package/resolve-esm)
[![install size](https://packagephobia.com/badge?p=resolve-esm)](https://packagephobia.com/result?p=resolve-esm)
[![license](https://badgen.net/npm/license/resolve-esm)](https://github.com/nujarum/resolve-esm/blob/main/LICENSE)
[![node](https://badgen.net/npm/node/resolve-esm)](https://nodejs.org/)
[![types](https://badgen.net/npm/types/resolve-esm)](https://github.com/nujarum/resolve-esm/blob/main/types/index.d.ts)
[![vulnerabilities](https://snyk.io/test/github/nujarum/resolve-esm/badge.svg?targetFile=package.json)](https://github.com/nujarum/resolve-esm/network/dependencies)
[![CodeQL](https://github.com/nujarum/resolve-esm/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/nujarum/resolve-esm/actions/workflows/codeql-analysis.yml)

[`import.meta.resolve`] is currently [_Experimental_], and is only available with the `--experimental-import-meta-resolve` command flag enabled.<br/>
This module provides functions equivalent to [`import.meta.resolve`] without the experimental flag.

- [⚠️ BREAKING CHANGES at v2.0.0](#️-breaking-changes-at-v200)
    - [Change return types from asynchronous to synchronous](#change-return-types-from-asynchronous-to-synchronous)
    - [Change supported Node.js versions](#change-supported-nodejs-versions)
- [Differences from similar modules](#differences-from-similar-modules)
- [Usage](#usage)
    - [Sync API](#sync-api)
    - [Async API](#async-api)
- [APIs](#apis)
    - [`importMetaResolve`](#importmetaresolve)
        - [Parameters](#parameters)
    - [`importMetaResolveAll`](#importmetaresolveall)
        - [Parameters](#parameters-1)
        - [What is this function for?](#what-is-this-function-for)

# ⚠️ BREAKING CHANGES at v2.0.0

## Change return types from asynchronous to synchronous
Following [the change at Node.js v20](https://nodejs.org/en/blog/announcements/v20-release-announce#custom-esm-loader-hooks-nearing-stable) that [`import.meta.resolve`] now returns synchronously, the functions in this module have also been changed to synchronous functions.

However, asynchronous functions equivalent to v1.x can also be imported from `resolve-esm/async`, so users can still use asynchronous functions in situations such as when blocking is undesirable.

## Change supported Node.js versions
Node.js v14 ([already EOL](https://github.com/nodejs/release#release-schedule)) is no longer supported and requires Node.js v16 or higher.

# Differences from similar modules
This module is just a lightweight _wrapper_ that internally calls the original [`import.meta.resolve`] and has no resolution logic of its own.<br/>
Therefore, it will be easy to follow if the original [specification] changes, and easy to migrate when the original becomes [_Stable_] in the future.

# Usage

> **Warning**
> This module only works in Node.js (v16+) [ES Modules].

```console
$ npm i resolve-esm
```

## Sync API

```js
import { importMetaResolve } from 'resolve-esm'; // or 'resolve-esm/sync'
```

<p><details open>
<summary>Examples</summary>

```js
importMetaResolve('./other.js');
// => "file://path/to/__dirname/other.js"

importMetaResolve('./other.js', 'file://different/path/base.js');
// => "file://different/path/other.js"

importMetaResolve('dependency');
// => "file://path/to/node_modules/dependency/main.js"

importMetaResolve('dependency', 'file://different/path/base.js');
// => "file://different/path/node_modules/dependency/main.js"

importMetaResolve('fs');
// => "node:fs"
```

</details></p>

## Async API

```js
import { importMetaResolve } from 'resolve-esm/async';
```

<p><details>
<summary>Examples</summary>

```js
await importMetaResolve('./other.js');
// => "file://path/to/__dirname/other.js"

await importMetaResolve('./other.js', 'file://different/path/base.js');
// => "file://different/path/other.js"

await importMetaResolve('dependency');
// => "file://path/to/node_modules/dependency/main.js"

await importMetaResolve('dependency', 'file://different/path/base.js');
// => "file://different/path/node_modules/dependency/main.js"

await importMetaResolve('fs');
// => "node:fs"
```

</details></p>

# APIs

## `importMetaResolve`

Resolve a (single) module specifier.

<p><details open>
<summary>Sync API</summary>

```ts
function importMetaResolve(specifier: string, parent?: string | URL): string;
```

</details></p>

<p><details>
<summary>Async API</summary>

```ts
function importMetaResolve(specifier: string, parent?: string | URL): Promise<string>;
```

</details></p>

### Parameters
* `specifier` (Type: `string`)
    * The module specifier to resolve relative to `parent`.
* `parent` (Type: `string | URL | undefined`)
    * The absolute parent module URL to resolve from.
    * If none is specified, the value of [`import.meta.url`] is used as the default.

## `importMetaResolveAll`

Resolve multiple module specifiers with the same `parent`.

<p><details open>
<summary>Sync API</summary>

```ts
function importMetaResolveAll(iterable: Readonly<Iterable<string>>, parent?: string | URL): string[];
```

</details></p>

<p><details>
<summary>Async API</summary>

```ts
function importMetaResolveAll(iterable: Readonly<Iterable<string>>, parent?: string | URL): Promise<string[]>;
```

</details></p>

### Parameters
* `iterable` (Type: `Iterable<string>`)
    * An iterable (such as an array) of module specifiers to resolve relative to `parent`.
* `parent` (Type: `string | URL | undefined`)
    * The absolute parent module URL to resolve from.
    * If none is specified, the value of [`import.meta.url`] is used as the default.

### What is this function for?
For internal implementation reasons, it is more efficient than calling `importMetaResolve` multiple times on your own.
* works, but inefficient
    ```js
    const results = [
        importMetaResolve('specifier1'),
        importMetaResolve('specifier2'),
        importMetaResolve('specifier3'),
    ];
    ```
* better
    ```js
    const results = importMetaResolveAll([
        'specifier1',
        'specifier2',
        'specifier3',
    ]);
    ```
