'use strict';
const { createRequire } = require('node:module');

module.exports = function (module, options) {
    const { basedir, defaultResolver } = options;
    try {
        return defaultResolver(module, options);
    } catch {
        return createRequire(basedir).resolve(module);
    }
};
