import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { checkSupplyChainActor, PROTECTED } from '../check-supply-chain-actor.mjs';
import { verifyLocalWorkspaceAddition } from '../workspace-manifest-validator.mjs';

function makeTempFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ws-manifest-test-'));
  const basePkg = {
    name: 'mailbox-plus-website',
    private: true,
    version: '0.0.0',
    type: 'module',
    workspaces: ['astro', 'netlify/functions'],
    scripts: { test: 'vitest run' },
    dependencies: { zod: '^4.6.5' },
    devDependencies: { typescript: '^5.5.3' },
    overrides: { argparse: '^2.0.1' },
  };
  const baseLock = {
    name: 'mailbox-plus-website',
    version: '0.0.0',
    lockfileVersion: 3,
    requires: true,
    packages: {
      '': {
        name: 'mailbox-plus-website',
        version: '0.0.0',
        workspaces: ['astro', 'netlify/functions'],
        dependencies: { zod: '^4.6.5' },
        devDependencies: { typescript: '^5.5.3' },
      },
      astro: { name: 'mailbox-plus-astro', version: '0.1.0' },
      'node_modules/zod': {
        version: '4.6.5',
        resolved: 'https://registry.npmjs.org/zod/-/zod-4.6.5.tgz',
        integrity: 'sha512-abc==',
      },
    },
  };

  const headPkg = {
    ...basePkg,
    workspaces: ['astro', 'netlify/functions', 'shared'],
  };
  const sharedPkg = {
    name: '@mailbox-plus/shared',
    version: '0.1.0',
    private: true,
    type: 'module',
    sideEffects: false,
    main: './index.cjs',
    module: './index.ts',
    types: './index.ts',
    exports: {
      '.': {
        types: './index.ts',
        import: './index.ts',
        require: './index.cjs',
        default: './index.ts',
      },
    },
  };
  const headLock = {
    ...baseLock,
    packages: {
      ...baseLock.packages,
      '': {
        ...baseLock.packages[''],
        workspaces: ['astro', 'netlify/functions', 'shared'],
      },
      shared: {
        name: '@mailbox-plus/shared',
        version: '0.1.0',
      },
      'node_modules/@mailbox-plus/shared': {
        resolved: 'shared',
        link: true,
      },
    },
  };

  fs.mkdirSync(path.join(dir, 'shared'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(headPkg, null, 2));
  fs.writeFileSync(path.join(dir, 'package-lock.json'), JSON.stringify(headLock, null, 2));
  fs.writeFileSync(path.join(dir, 'shared/package.json'), JSON.stringify(sharedPkg, null, 2));

  return {
    dir,
    baseManifests: {
      packageJson: JSON.stringify(basePkg, null, 2),
      packageLockJson: JSON.stringify(baseLock, null, 2),
      existingFiles: ['package.json', 'package-lock.json', 'astro/package.json'],
    },
    headPkg,
    headLock,
    sharedPkg,
  };
}

describe('workspace-manifest-validator', () => {
  const tempDirs: string[] = [];

  afterEach(() => {
    for (const d of tempDirs.splice(0)) {
      fs.rmSync(d, { recursive: true, force: true });
    }
  });

  it('protects shared and functions package manifests in PROTECTED', () => {
    expect(PROTECTED.some((rx) => rx.test('shared/package.json'))).toBe(true);
    expect(PROTECTED.some((rx) => rx.test('netlify/functions/package.json'))).toBe(true);
  });

  it('allows authorized bot when registering a pure local private workspace with zero dep changes', () => {
    const fixture = makeTempFixture();
    tempDirs.push(fixture.dir);

    const result = checkSupplyChainActor({
      changedFiles: ['package.json', 'package-lock.json', 'shared/package.json', 'shared/index.ts'],
      author: 'google-labs-stitch[bot]',
      repoRoot: fixture.dir,
      baseManifests: fixture.baseManifests,
    });

    expect(result.success).toBe(true);
  });

  it('still blocks external contributors even for structurally valid local workspace additions', () => {
    const fixture = makeTempFixture();
    tempDirs.push(fixture.dir);

    const result = checkSupplyChainActor({
      changedFiles: ['package.json', 'package-lock.json', 'shared/package.json'],
      author: 'external-contributor',
      repoRoot: fixture.dir,
      baseManifests: fixture.baseManifests,
    });

    expect(result.success).toBe(false);
  });

  it('rejects if any root dependency, override, or script changes', () => {
    const fixture = makeTempFixture();
    tempDirs.push(fixture.dir);

    fs.writeFileSync(
      path.join(fixture.dir, 'package.json'),
      JSON.stringify(
        {
          ...fixture.headPkg,
          dependencies: { zod: '^4.6.6' },
        },
        null,
        2
      )
    );

    const check = verifyLocalWorkspaceAddition({
      changedFiles: ['package.json', 'package-lock.json', 'shared/package.json'],
      strictTouched: ['package.json', 'package-lock.json', 'shared/package.json'],
      repoRoot: fixture.dir,
      baseManifests: fixture.baseManifests,
    });
    expect(check.valid).toBe(false);
    expect(check.reason).toContain('dependencies');
  });

  it('rejects if an existing workspace is removed from root workspaces', () => {
    const fixture = makeTempFixture();
    tempDirs.push(fixture.dir);

    fs.writeFileSync(
      path.join(fixture.dir, 'package.json'),
      JSON.stringify(
        {
          ...fixture.headPkg,
          workspaces: ['astro', 'shared'],
        },
        null,
        2
      )
    );

    const check = verifyLocalWorkspaceAddition({
      changedFiles: ['package.json', 'package-lock.json', 'shared/package.json'],
      strictTouched: ['package.json', 'package-lock.json', 'shared/package.json'],
      repoRoot: fixture.dir,
      baseManifests: fixture.baseManifests,
    });
    expect(check.valid).toBe(false);
    expect(check.reason).toContain('removed');
  });

  it('rejects if workspace package.json declares dependencies, scripts, or private !== true', () => {
    const fixture = makeTempFixture();
    tempDirs.push(fixture.dir);

    fs.writeFileSync(
      path.join(fixture.dir, 'shared/package.json'),
      JSON.stringify(
        {
          ...fixture.sharedPkg,
          scripts: { postinstall: 'node setup.js' },
        },
        null,
        2
      )
    );

    const scriptsCheck = verifyLocalWorkspaceAddition({
      changedFiles: ['package.json', 'package-lock.json', 'shared/package.json'],
      strictTouched: ['package.json', 'package-lock.json', 'shared/package.json'],
      repoRoot: fixture.dir,
      baseManifests: fixture.baseManifests,
    });
    expect(scriptsCheck.valid).toBe(false);
    expect(scriptsCheck.reason).toContain('disallowed field "scripts"');

    fs.writeFileSync(
      path.join(fixture.dir, 'shared/package.json'),
      JSON.stringify(
        {
          ...fixture.sharedPkg,
          dependencies: { lodash: '^4.17.21' },
        },
        null,
        2
      )
    );

    const depsCheck = verifyLocalWorkspaceAddition({
      changedFiles: ['package.json', 'package-lock.json', 'shared/package.json'],
      strictTouched: ['package.json', 'package-lock.json', 'shared/package.json'],
      repoRoot: fixture.dir,
      baseManifests: fixture.baseManifests,
    });
    expect(depsCheck.valid).toBe(false);
    expect(depsCheck.reason).toContain('disallowed field "dependencies"');
  });

  it('rejects if any existing package-lock.json entry is modified or unexpected entry is added', () => {
    const fixture = makeTempFixture();
    tempDirs.push(fixture.dir);

    const mutatedLock = structuredClone(fixture.headLock);
    mutatedLock.packages['node_modules/zod'].resolved =
      'https://registry.npmjs.org/@other/zod/-/zod-4.6.5.tgz';
    fs.writeFileSync(path.join(fixture.dir, 'package-lock.json'), JSON.stringify(mutatedLock));

    const mutatedCheck = verifyLocalWorkspaceAddition({
      changedFiles: ['package.json', 'package-lock.json', 'shared/package.json'],
      strictTouched: ['package.json', 'package-lock.json', 'shared/package.json'],
      repoRoot: fixture.dir,
      baseManifests: fixture.baseManifests,
    });
    expect(mutatedCheck.valid).toBe(false);
    expect(mutatedCheck.reason).toContain('existing lockfile package "node_modules/zod"');
  });

  it('rejects if workspace manifest already existed in base commit', () => {
    const fixture = makeTempFixture();
    tempDirs.push(fixture.dir);

    const existingCheck = verifyLocalWorkspaceAddition({
      changedFiles: ['package.json', 'package-lock.json', 'shared/package.json'],
      strictTouched: ['package.json', 'package-lock.json', 'shared/package.json'],
      repoRoot: fixture.dir,
      baseManifests: {
        ...fixture.baseManifests,
        existingFiles: ['package.json', 'package-lock.json', 'shared/package.json'],
      },
    });
    expect(existingCheck.valid).toBe(false);
    expect(existingCheck.reason).toContain('already existed in base');
  });
});
