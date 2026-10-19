import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

describe('vault-sync sync.sh remote path execution', () => {
  it('passes raw quoted VAULT_REMOTE_PATH to scp without backslash escaping', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vault-sync-test-'));
    try {
      const repoRoot = path.resolve(__dirname, '../..');
      const syncScript = path.join(repoRoot, 'scripts/vault-sync/sync.sh');

      // Create a mock scp binary that logs arguments to a file
      const mockBinDir = path.join(tmpDir, 'bin');
      fs.mkdirSync(mockBinDir, { recursive: true });
      const mockScpLog = path.join(tmpDir, 'scp_args.txt');

      const mockScpScript = `#!/usr/bin/env bash
echo "$@" >> "${mockScpLog}"
exit 0
`;
      const mockScpPath = path.join(mockBinDir, 'scp');
      fs.writeFileSync(mockScpPath, mockScpScript, { mode: 0o755 });

      // Run sync.sh with a custom PATH including our mock scp, and mock VAULT_REMOTE_PATH
      // DRY_RUN is 0 so it reaches the scp branch
      const testRemotePath = '/mnt/storage1/Obsidian/MainVault/Mailbox Plus/Knowledge/';
      const testHost = 'user@test-server';

      execFileSync('bash', [syncScript], {
        cwd: repoRoot,
        env: {
          ...process.env,
          PATH: `${mockBinDir}:${process.env.PATH}`,
          DRY_RUN: '0',
          DEST_DIR: '',
          SSH_HOST: testHost,
          VAULT_REMOTE_PATH: testRemotePath,
        },
        encoding: 'utf8',
      });

      expect(fs.existsSync(mockScpLog)).toBe(true);
      const logContent = fs.readFileSync(mockScpLog, 'utf8');
      // Verify scp was called with raw quoted path user@test-server:/mnt/storage1/Obsidian/MainVault/Mailbox Plus/Knowledge/
      expect(logContent).toContain(
        'user@test-server:/mnt/storage1/Obsidian/MainVault/Mailbox Plus/Knowledge/'
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }, 30000);

  it('handles paths with multiple trailing slashes and special characters without backslash escaping', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vault-sync-test-'));
    try {
      const repoRoot = path.resolve(__dirname, '../..');
      const syncScript = path.join(repoRoot, 'scripts/vault-sync/sync.sh');

      const mockBinDir = path.join(tmpDir, 'bin');
      fs.mkdirSync(mockBinDir, { recursive: true });
      const mockScpLog = path.join(tmpDir, 'scp_args.txt');

      const mockScpScript = `#!/usr/bin/env bash
echo "$@" >> "${mockScpLog}"
exit 0
`;
      const mockScpPath = path.join(mockBinDir, 'scp');
      fs.writeFileSync(mockScpPath, mockScpScript, { mode: 0o755 });

      const testRemotePath = '/mnt/storage1/Vault\'s "Special" Path ($1)///';
      const testHost = 'user@host';

      execFileSync('bash', [syncScript], {
        cwd: repoRoot,
        env: {
          ...process.env,
          PATH: `${mockBinDir}:${process.env.PATH}`,
          DRY_RUN: '0',
          DEST_DIR: '',
          SSH_HOST: testHost,
          VAULT_REMOTE_PATH: testRemotePath,
        },
        encoding: 'utf8',
      });

      expect(fs.existsSync(mockScpLog)).toBe(true);
      const logContent = fs.readFileSync(mockScpLog, 'utf8');
      expect(logContent).toContain('user@host:/mnt/storage1/Vault\'s "Special" Path ($1)/');
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }, 30000);

  it('completes dry-run execution when DRY_RUN=1 without invoking scp', () => {
    const repoRoot = path.resolve(__dirname, '../..');
    const syncScript = path.join(repoRoot, 'scripts/vault-sync/sync.sh');

    const output = execFileSync('bash', [syncScript], {
      cwd: repoRoot,
      env: {
        ...process.env,
        DRY_RUN: '1',
      },
      encoding: 'utf8',
    });

    expect(output).toContain(
      'DRY_RUN mode enabled. Dry run completed successfully without upload.'
    );
  });

  it('copies notes to local destination when DEST_DIR is specified', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vault-sync-dest-test-'));
    try {
      const repoRoot = path.resolve(__dirname, '../..');
      const syncScript = path.join(repoRoot, 'scripts/vault-sync/sync.sh');
      const destDir = path.join(tmpDir, 'destination folder');

      const output = execFileSync('bash', [syncScript], {
        cwd: repoRoot,
        env: {
          ...process.env,
          DRY_RUN: '0',
          DEST_DIR: destDir,
        },
        encoding: 'utf8',
      });

      expect(output).toContain(`Copying synced notes to local destination: ${destDir}`);
      expect(fs.existsSync(destDir)).toBe(true);
      const files = fs.readdirSync(destDir);
      expect(files.length).toBeGreaterThan(0);
      expect(files.some((f) => f.endsWith('.md'))).toBe(true);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
