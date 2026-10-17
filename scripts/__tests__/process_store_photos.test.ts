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

  it('uses remote IMMICH_KEY_FILE path, curl --fail -S, and proper x-api-key double-quoting in SSH command construction', () => {
    const pyScript = [
      'import sys, shlex',
      'sys.path.insert(0, ".")',
      'import scripts.process_store_photos as psp',
      'assert psp.IMMICH_KEY_FILE == "~/immich-categorize/.api_key", f"Expected remote path, got {psp.IMMICH_KEY_FILE}"',
      'curl_args = ["http://127.0.0.1:2283/api/tags"]',
      'cmd_args = " ".join(shlex.quote(a) for a in curl_args)',
      'key_file = psp.IMMICH_KEY_FILE',
      'key_expr = f\'KEY=$(cat {key_file}) && curl -s --fail -S -H "x-api-key: $KEY" {cmd_args}\'',
      'assert \'x-api-key: $KEY"\' in key_expr, f"Header must use double quotes for variable expansion: {key_expr}"',
      'assert "cat ~/immich-categorize/.api_key" in key_expr, f"Must cat remote key path: {key_expr}"',
      'assert "--fail -S" in key_expr, f"Must include --fail -S flag: {key_expr}"',
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

  it('removes target file on preview download failure', () => {
    const pyScript = [
      'import sys, os, types, subprocess',
      'sys.path.insert(0, ".")',
      'import scripts.process_store_photos as psp',
      'class Args:',
      '    asset_id = "test12345678"',
      '# Mock subprocess.run to simulate SSH failure (e.g. curl --fail on 404)',
      'def mock_run(cmd, stdout=None, stderr=None, timeout=None):',
      '    if stdout:',
      '        stdout.write(b"{\\"statusCode\\": 404, \\"message\\": \\"Asset not found\\"}")',
      '    return subprocess.CompletedProcess(cmd, returncode=22, stderr=b"curl: (22) The requested URL returned error: 404")',
      'subprocess.run = mock_run',
      'out_file = "/tmp/immich_test1234"',
      'if os.path.exists(out_file): os.remove(out_file)',
      'try:',
      '    psp.cmd_preview(Args())',
      'except SystemExit as e:',
      '    assert "download failed" in str(e)',
      '    assert not os.path.exists(out_file), f"Output file {out_file} should have been cleaned up"',
      '    print("CLEANUP_OK")',
    ].join('\n');

    const output = execSync('python3 -', {
      cwd: ROOT,
      encoding: 'utf8',
      input: pyScript,
    });
    expect(output.trim()).toBe('CLEANUP_OK');
  });
});
