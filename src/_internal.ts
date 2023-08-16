import { pathToFileURL } from 'node:url';
import callsites from 'callsites';

const isUrl = /^\w+:\/\/.+/;

export const execArgv = Object.freeze([
    ...new Set(process.execArgv)
        .add('--experimental-import-meta-resolve')
        .add('--no-warnings')
]);

export function getCallerUrl(thisUrl: string): string | undefined;
export function getCallerUrl(thisUrl: string): string | void {
    for (const callSite of callsites()) {
        const uri = callSite.getFileName();
        if (!uri) continue;
        const url = isUrl.test(uri) ? uri : pathToFileURL(uri).href;
        if (url !== thisUrl) return url;
    }
}
