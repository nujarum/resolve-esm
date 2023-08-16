const thisUrl = import.meta.url;

export const urlMap = {
    '@rollup/plugin-node-resolve'   : new URL('../node_modules/@rollup/plugin-node-resolve/dist/es/index.js', thisUrl).href,
    '@rollup/pluginutils'           : new URL('../node_modules/@rollup/pluginutils/dist/es/index.js', thisUrl).href,
    'rollup'                        : new URL('../node_modules/rollup/dist/es/rollup.js', thisUrl).href,
    'tslib'                         : new URL('../node_modules/tslib/modules/index.js', thisUrl).href,
    'fs'                            : 'node:fs',
} as const;
Object.freeze(urlMap);
