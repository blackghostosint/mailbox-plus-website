import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeFileSync, unlinkSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import {
  readFilesList,
  readPRBody,
  resolveAuthor,
  parsePRCliArgs,
  getPRContext,
} from '../pr-utils.mjs';

describe('pr-utils.mjs', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = join(tmpdir(), `pr-utils-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    try {
      rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  describe('readFilesList', () => {
    it('returns empty array for empty inputs', () => {
      expect(readFilesList()).toEqual([]);
      expect(readFilesList('')).toEqual([]);
      expect(readFilesList(null as any)).toEqual([]);
    });

    it('returns formatted array when given an array', () => {
      expect(readFilesList([' file1.js ', 'file2.js\n', ''])).toEqual(['file1.js', 'file2.js']);
    });

    it('reads files list from a file path', () => {
      const filePath = join(tempDir, 'files.txt');
      writeFileSync(filePath, 'file1.ts\nnetlify/functions/api.ts\n\nfile2.ts');
      expect(readFilesList(filePath)).toEqual(['file1.ts', 'netlify/functions/api.ts', 'file2.ts']);
    });

    it('parses multiline text string when file does not exist', () => {
      const rawText = 'content/articles/a1.md\ncontent/articles/a2.md';
      expect(readFilesList(rawText)).toEqual(['content/articles/a1.md', 'content/articles/a2.md']);
    });
  });

  describe('readPRBody', () => {
    it('returns body from direct string input', () => {
      expect(readPRBody('Direct PR body content')).toBe('Direct PR body content');
    });

    it('reads PR body from file path', () => {
      const bodyPath = join(tempDir, 'body.txt');
      writeFileSync(bodyPath, '## Endpoint Authentication Models\nSome details');
      expect(readPRBody(bodyPath)).toBe('## Endpoint Authentication Models\nSome details');
    });

    it('reads PR body from PR_BODY_FILE environment variable', () => {
      const bodyPath = join(tempDir, 'env-body.txt');
      writeFileSync(bodyPath, 'Body from env file');
      expect(readPRBody(undefined, { PR_BODY_FILE: bodyPath })).toBe('Body from env file');
    });

    it('reads PR body from GITHUB_EVENT_PATH payload', () => {
      const eventPath = join(tempDir, 'event.json');
      writeFileSync(
        eventPath,
        JSON.stringify({ pull_request: { body: 'Body from event payload' } })
      );
      expect(readPRBody(undefined, { GITHUB_EVENT_PATH: eventPath })).toBe(
        'Body from event payload'
      );
    });
  });

  describe('resolveAuthor', () => {
    it('prioritizes CLI author argument', () => {
      expect(resolveAuthor('cli-user', { PR_AUTHOR: 'env-user' })).toBe('cli-user');
    });

    it('uses PR_AUTHOR environment variable if CLI author absent', () => {
      expect(resolveAuthor('', { PR_AUTHOR: 'env-user' })).toBe('env-user');
    });

    it('falls back to GITHUB_EVENT_PATH payload', () => {
      const eventPath = join(tempDir, 'event.json');
      writeFileSync(
        eventPath,
        JSON.stringify({ pull_request: { user: { login: 'event-author' } } })
      );
      expect(resolveAuthor('', { GITHUB_EVENT_PATH: eventPath })).toBe('event-author');
    });

    it('returns empty string if no author source found', () => {
      expect(resolveAuthor('', {})).toBe('');
    });
  });

  describe('parsePRCliArgs', () => {
    it('parses --author=val and positional args', () => {
      const args = ['node', 'script.js', 'body.txt', 'files.txt', '--author=jules', '--local'];
      const parsed = parsePRCliArgs(args);
      expect(parsed.author).toBe('jules');
      expect(parsed.isLocalBypass).toBe(true);
      expect(parsed.positional).toEqual(['body.txt', 'files.txt']);
    });

    it('parses --author val flag', () => {
      const args = ['node', 'script.js', '--author', 'hermes', 'body.txt'];
      const parsed = parsePRCliArgs(args);
      expect(parsed.author).toBe('hermes');
      expect(parsed.positional).toEqual(['body.txt']);
    });
  });

  describe('getPRContext', () => {
    it('returns unified PR context', () => {
      const bodyPath = join(tempDir, 'body.txt');
      writeFileSync(bodyPath, 'PR body content');
      const filesPath = join(tempDir, 'files.txt');
      writeFileSync(filesPath, 'file1.ts\nfile2.ts');

      const ctx = getPRContext({
        args: ['node', 'script.mjs', bodyPath, filesPath, '--author=jules'],
        env: {},
      });

      expect(ctx.body).toBe('PR body content');
      expect(ctx.changedFiles).toEqual(['file1.ts', 'file2.ts']);
      expect(ctx.author).toBe('jules');
      expect(ctx.isLocal).toBe(false);
    });
  });
});
