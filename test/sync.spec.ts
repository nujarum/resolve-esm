import { describe, expect, test, vi } from 'vitest';
import { importMetaResolve, importMetaResolveAll } from '#sync/index';
import { urlMap } from './fixture';

describe('importMetaResolve', () => {

    test('should be function', () => {
        expect(typeof importMetaResolve).toBe('function');
    });

    test('should resolve', () => {
        const actual = importMetaResolve('tslib');
        const expected = urlMap.tslib;
        expect(actual).toBe(expected);
    });

    test('should throw `Error`', () => {
        try {
            importMetaResolve('unknown-package');
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            const { message, name, stack } = e as Error;
            expect(message).toBeTruthy();
            expect(name).toBeTruthy();
            expect(stack).toBeTruthy();
        }
    });

});

describe('importMetaResolveAll', () => {

    test('should be function', () => {
        expect(typeof importMetaResolveAll).toBe('function');
    });

    test('should resolve all', () => {
        const actual = importMetaResolveAll(Object.keys(urlMap));
        const expected = Object.values(urlMap);
        expect(actual).toEqual(expected);
    });

    test('should resolve empty', () => {
        const actual = importMetaResolveAll([]);
        const expected: string[] = [];
        expect(actual).toEqual(expected);
    });

    test('should throw `Error`', () => {
        try {
            importMetaResolveAll(['tslib', 'unknown-package']);
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
            const { message, name, stack } = e as Error;
            expect(message).toBeTruthy();
            expect(name).toBeTruthy();
            expect(stack).toBeTruthy();
        }
    });

});

describe('with user conditions', () => {

    vi.stubEnv('NODE_OPTIONS', '--conditions=development');

    const thisUrl = import.meta.url;
    const pkgDir = new URL('./dummy/pkg/', thisUrl);
    const libDir = new URL('./dummy/lib/', thisUrl);

    test('resolve @dummy/lib from @dummy/pkg', () => {
        const parent = new URL('./package.json', pkgDir).href;
        const actual = importMetaResolve('@dummy/lib', parent);
        const expected = new URL('development.js', libDir).href;
        expect(actual).toBe(expected);
    });

});
