import { describe, it, expect, vi } from 'vitest';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isMainModule, parseScriptArgs } from '../../lib/cli-utils.ts';

describe('cli-utils', () => {
  describe('isMainModule', () => {
    it('returns true when module URL matches process.argv[1] path', () => {
      const scriptPath = path.resolve('/app/scripts/test-script.mjs');
      const scriptUrl = pathToFileURL(scriptPath).href;

      expect(isMainModule(scriptUrl, scriptPath)).toBe(true);
      expect(isMainModule({ url: scriptUrl }, scriptPath)).toBe(true);
    });

    it('returns true when relative process.argv[1] resolves to module URL', () => {
      const currentFile = fileURLToPath(import.meta.url);
      const relativePath = path.relative(process.cwd(), currentFile);

      expect(isMainModule(import.meta.url, relativePath)).toBe(true);
    });

    it('returns false when process.argv[1] points to a different script or test runner', () => {
      const scriptUrl = pathToFileURL(path.resolve('/app/scripts/other.mjs')).href;
      const runnerPath = path.resolve('/app/node_modules/vitest/vitest.mjs');

      expect(isMainModule(scriptUrl, runnerPath)).toBe(false);
    });

    it('returns false when importMetaUrl or processArgv1 is null or undefined', () => {
      expect(isMainModule(null, '/some/path')).toBe(false);
      expect(isMainModule(import.meta.url, undefined)).toBe(false);
    });

    it('handles CJS __filename path strings', () => {
      const filePath = path.resolve('/app/scripts/micro.cjs');
      expect(isMainModule(filePath, filePath)).toBe(true);
    });
  });

  describe('parseScriptArgs', () => {
    it('parses boolean flags and string options with default process.argv slice', () => {
      const args = ['--offline', '--base-url', 'https://example.com', 'positional1'];
      const result = parseScriptArgs(
        {
          options: {
            offline: { type: 'boolean', default: false },
            'base-url': { type: 'string' },
          },
        },
        args
      );

      expect(result.values.offline).toBe(true);
      expect(result.values['base-url']).toBe('https://example.com');
      expect(result.positionals).toEqual(['positional1']);
    });

    it('parses short option aliases correctly (e.g. -h)', () => {
      const resultShort = parseScriptArgs(
        {
          options: {
            help: { type: 'boolean', short: 'h', default: false },
          },
        },
        ['-h']
      );

      const resultLong = parseScriptArgs(
        {
          options: {
            help: { type: 'boolean', short: 'h', default: false },
          },
        },
        ['--help']
      );

      expect(resultShort.values.help).toBe(true);
      expect(resultLong.values.help).toBe(true);
    });

    it('slices node/script binary args if full argv is passed', () => {
      const fullArgv = ['/usr/bin/node', '/app/script.js', '--flag', 'arg1'];
      const result = parseScriptArgs(
        {
          options: {
            flag: { type: 'boolean', default: false },
          },
        },
        fullArgv
      );

      expect(result.values.flag).toBe(true);
      expect(result.positionals).toEqual(['arg1']);
    });

    it('formats error and handles strict mode', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        parseScriptArgs(
          {
            strict: true,
            autoExit: false,
            options: {
              known: { type: 'boolean' },
            },
          },
          ['--unknown-flag']
        );
      }).toThrow();

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
