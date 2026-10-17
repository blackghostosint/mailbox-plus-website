import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');

describe('process_store_photos.py', () => {
  it('exits 0 and displays help output for --help', () => {
    const output = execSync('python3 scripts/process_store_photos.py --help', {
      cwd: ROOT,
      encoding: 'utf8',
    });
    expect(output).toContain('Store Photo Library processor');
    expect(output).toContain('scan');
    expect(output).toContain('preview');
    expect(output).toContain('publish');
  });

  it('uses remote IMMICH_KEY_FILE path and proper x-api-key double-quoting in SSH command construction', () => {
    const pyScript = [
      'import sys, shlex',
      'sys.path.insert(0, ".")',
      'import scripts.process_store_photos as psp',
      'assert psp.IMMICH_KEY_FILE == "~/immich-categorize/.api_key", f"Expected remote path, got {psp.IMMICH_KEY_FILE}"',
      'curl_args = ["http://127.0.0.1:2283/api/tags"]',
      'cmd_args = " ".join(shlex.quote(a) for a in curl_args)',
      'key_file = psp.IMMICH_KEY_FILE',
      'key_expr = f\'KEY=$(cat {key_file}) && curl -s -H "x-api-key: $KEY" {cmd_args}\'',
      'assert \'x-api-key: $KEY"\' in key_expr, f"Header must use double quotes for variable expansion: {key_expr}"',
      'assert "cat ~/immich-categorize/.api_key" in key_expr, f"Must cat remote key path: {key_expr}"',
      'assert key_expr.count(\'"\') % 2 == 0, f"Unterminated quote detected in key_expr: {key_expr}"',
      'print("OK")',
    ].join('\n');

    const output = execSync('python3 -', {
      cwd: ROOT,
      encoding: 'utf8',
      input: pyScript,
    });
    expect(output.trim()).toBe('OK');
  });
});
