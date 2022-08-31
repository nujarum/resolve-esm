'use strict';
const isWIP = /^(?:WIP|\[WIP\]):?/;
module.exports = {
    extends: [
        '@commitlint/config-conventional',
    ],
    ignores: [
        message => isWIP.test(message),
    ],
};
