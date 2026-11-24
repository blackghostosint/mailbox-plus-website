import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const ALLOWED_WORKSPACE_MANIFEST_KEYS = new Set([
  'name',
  'version',
  'private',
  'description',
  'type',
  'sideEffects',
  'main',
  'module',
  'types',
  'exports',
]);

const WORKSPACE_DIR_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const WORKSPACE_NAME_PATTERN = /^@mailbox-plus\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEMVER_PATTERN = /^\d+\.\d+\.\d+$/;

function isSafeRelativeExportTarget(value) {
  if (typeof value === 'string') {
    return (
      value.startsWith('./') &&
      !value.includes('..') &&
      !value.includes('node_modules') &&
      /\.(?:ts|js|mjs|cjs)$/.test(value)
    );
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const entries = Object.entries(value);
    return entries.length > 0 && entries.every(([, target]) => isSafeRelativeExportTarget(target));
  }
  return false;
}

function resolveMergeBase(repoRoot, baseRef) {
  const candidates = [];
  if (baseRef) {
    candidates.push(baseRef);
    const bare = baseRef.replace(/^origin\//, '');
    if (bare && bare !== baseRef) {
      candidates.push(bare);
    }
  }
  for (const ref of candidates) {
    try {
      const sha = execFileSync('git', ['merge-base', 'HEAD', ref], {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
      if (/^[0-9a-f]{7,40}$/i.test(sha)) {
        return sha;
      }
    } catch {
      // Try next candidate
    }
  }
  if (process.env.GITHUB_BASE_SHA && /^[0-9a-f]{7,40}$/i.test(process.env.GITHUB_BASE_SHA.trim())) {
    return process.env.GITHUB_BASE_SHA.trim();
  }
  if (process.env.GITHUB_EVENT_PATH && fs.existsSync(process.env.GITHUB_EVENT_PATH)) {
    try {
      const payload = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
      const prBaseSha = payload?.pull_request?.base?.sha;
      if (typeof prBaseSha === 'string' && /^[0-9a-f]{7,40}$/i.test(prBaseSha.trim())) {
        return prBaseSha.trim();
      }
    } catch {
      // Ignore invalid event payload
    }
  }
  throw new Error('empty merge-base');
}

function readGitBaseManifests(repoRoot, baseRef) {
  const mergeBase = resolveMergeBase(repoRoot, baseRef);
  const packageJson = execFileSync('git', ['show', `${mergeBase}:package.json`], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  const packageLockJson = execFileSync('git', ['show', `${mergeBase}:package-lock.json`], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });

  const existingFiles = new Set();
  const treeOut = execFileSync('git', ['ls-tree', '-r', '--name-only', mergeBase], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  for (const line of treeOut.split('\n')) {
    const trimmed = line.trim();
    if (trimmed) existingFiles.add(trimmed);
  }

  return { packageJson, packageLockJson, existingFiles };
}

/**
 * Verifies fail-closed that root manifest modifications ONLY register a new
 * zero-dependency private local workspace package without changing any
 * third-party dependency, version, lockfile entry, script, or override.
 *
 * @param {Object} options
 * @param {string[]} options.changedFiles
 * @param {string[]} options.strictTouched
 * @param {string} options.repoRoot
 * @param {string} [options.baseRef]
 * @param {{ packageJson: string, packageLockJson: string, existingFiles?: Iterable<string> }} [options.baseManifests]
 * @returns {{ valid: boolean, reason?: string }}
 */
export function verifyLocalWorkspaceAddition({
  changedFiles = [],
  strictTouched = [],
  repoRoot,
  baseRef = '',
  baseManifests,
}) {
  if (!strictTouched.includes('package.json')) {
    return { valid: false, reason: 'root package.json not present in workspace registration' };
  }

  // Never permit astro/*, netlify/functions/*, or netlify.toml under workspace registration
  for (const file of strictTouched) {
    if (
      file === 'netlify.toml' ||
      file.startsWith('astro/') ||
      file.startsWith('netlify/') ||
      file.endsWith('/package-lock.json')
    ) {
      return { valid: false, reason: `disallowed strict file touched: ${file}` };
    }
  }

  let resolvedBase = baseManifests;
  if (!resolvedBase) {
    if (!baseRef) {
      return { valid: false, reason: 'missing baseRef for workspace manifest comparison' };
    }
    try {
      resolvedBase = readGitBaseManifests(repoRoot, baseRef);
    } catch {
      return { valid: false, reason: `unable to load base manifests from ${baseRef}` };
    }
  }

  const baseExistingFiles = new Set(resolvedBase.existingFiles || []);

  let basePkg;
  let headPkg;
  try {
    basePkg = JSON.parse(resolvedBase.packageJson);
    headPkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  } catch {
    return { valid: false, reason: 'unable to parse base or head root package.json' };
  }

  const baseKeys = Object.keys(basePkg).sort();
  const headKeys = Object.keys(headPkg).sort();
  if (!isDeepStrictEqual(baseKeys, headKeys)) {
    return { valid: false, reason: 'root package.json top-level keys changed' };
  }

  for (const key of headKeys) {
    if (key === 'workspaces') continue;
    if (!isDeepStrictEqual(headPkg[key], basePkg[key])) {
      return { valid: false, reason: `root package.json field "${key}" was modified` };
    }
  }

  if (!Array.isArray(basePkg.workspaces) || !Array.isArray(headPkg.workspaces)) {
    return { valid: false, reason: 'root package.json workspaces must be an array' };
  }
  if (new Set(headPkg.workspaces).size !== headPkg.workspaces.length) {
    return { valid: false, reason: 'duplicate entries in root package.json workspaces' };
  }
  for (const existingWs of basePkg.workspaces) {
    if (!headPkg.workspaces.includes(existingWs)) {
      return { valid: false, reason: `existing workspace "${existingWs}" was removed` };
    }
  }

  const addedWorkspaces = headPkg.workspaces.filter((ws) => !basePkg.workspaces.includes(ws));
  if (addedWorkspaces.length === 0) {
    return { valid: false, reason: 'no new local workspace added in root package.json' };
  }

  const expectedWsManifests = new Set();
  const validatedWorkspaces = new Map();

  for (const ws of addedWorkspaces) {
    if (typeof ws !== 'string' || !WORKSPACE_DIR_PATTERN.test(ws)) {
      return { valid: false, reason: `invalid workspace directory "${String(ws)}"` };
    }
    const relManifest = `${ws}/package.json`;
    if (baseExistingFiles.has(relManifest)) {
      return {
        valid: false,
        reason: `workspace manifest "${relManifest}" already existed in base`,
      };
    }
    if (!changedFiles.includes(relManifest)) {
      return { valid: false, reason: `added workspace "${ws}" missing "${relManifest}" in PR` };
    }
    expectedWsManifests.add(relManifest);

    let wsPkg;
    try {
      wsPkg = JSON.parse(fs.readFileSync(path.join(repoRoot, relManifest), 'utf8'));
    } catch {
      return { valid: false, reason: `unable to read or parse "${relManifest}"` };
    }

    if (!wsPkg || typeof wsPkg !== 'object' || Array.isArray(wsPkg)) {
      return { valid: false, reason: `"${relManifest}" must be a JSON object` };
    }

    for (const key of Object.keys(wsPkg)) {
      if (!ALLOWED_WORKSPACE_MANIFEST_KEYS.has(key)) {
        return { valid: false, reason: `"${relManifest}" contains disallowed field "${key}"` };
      }
    }

    if (wsPkg.private !== true) {
      return { valid: false, reason: `"${relManifest}" must set "private": true` };
    }
    if (typeof wsPkg.name !== 'string' || !WORKSPACE_NAME_PATTERN.test(wsPkg.name)) {
      return { valid: false, reason: `"${relManifest}" must use scoped @mailbox-plus/* name` };
    }
    if (typeof wsPkg.version !== 'string' || !SEMVER_PATTERN.test(wsPkg.version)) {
      return { valid: false, reason: `"${relManifest}" must have exact semver version` };
    }

    for (const entryKey of ['main', 'module', 'types']) {
      if (wsPkg[entryKey] !== undefined && !isSafeRelativeExportTarget(wsPkg[entryKey])) {
        return { valid: false, reason: `"${relManifest}" field "${entryKey}" has unsafe target` };
      }
    }
    if (wsPkg.exports !== undefined && !isSafeRelativeExportTarget(wsPkg.exports)) {
      return { valid: false, reason: `"${relManifest}" exports map contains unsafe target` };
    }

    validatedWorkspaces.set(ws, wsPkg);
  }

  for (const file of strictTouched) {
    if (file === 'package.json' || file === 'package-lock.json') continue;
    if (!expectedWsManifests.has(file)) {
      return { valid: false, reason: `unexpected manifest file touched: ${file}` };
    }
  }

  if (strictTouched.includes('package-lock.json')) {
    let baseLock;
    let headLock;
    try {
      baseLock = JSON.parse(resolvedBase.packageLockJson);
      headLock = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package-lock.json'), 'utf8'));
    } catch {
      return { valid: false, reason: 'unable to parse base or head package-lock.json' };
    }

    const baseLockKeys = Object.keys(baseLock).sort();
    const headLockKeys = Object.keys(headLock).sort();
    if (!isDeepStrictEqual(baseLockKeys, headLockKeys)) {
      return { valid: false, reason: 'package-lock.json top-level keys changed' };
    }
    for (const key of headLockKeys) {
      if (key === 'packages') continue;
      if (!isDeepStrictEqual(headLock[key], baseLock[key])) {
        return { valid: false, reason: `package-lock.json top-level field "${key}" changed` };
      }
    }

    const basePackages = baseLock.packages;
    const headPackages = headLock.packages;
    if (
      !basePackages ||
      typeof basePackages !== 'object' ||
      !headPackages ||
      typeof headPackages !== 'object'
    ) {
      return { valid: false, reason: 'package-lock.json missing packages map' };
    }

    const baseRootEntry = basePackages[''];
    const headRootEntry = headPackages[''];
    if (!baseRootEntry || !headRootEntry) {
      return { valid: false, reason: 'package-lock.json missing root package entry' };
    }

    const baseRootKeys = Object.keys(baseRootEntry).sort();
    const headRootKeys = Object.keys(headRootEntry).sort();
    if (!isDeepStrictEqual(baseRootKeys, headRootKeys)) {
      return { valid: false, reason: 'package-lock.json root entry keys changed' };
    }
    for (const key of headRootKeys) {
      if (key === 'workspaces') continue;
      if (!isDeepStrictEqual(headRootEntry[key], baseRootEntry[key])) {
        return { valid: false, reason: `package-lock.json root field "${key}" changed` };
      }
    }
    if (!isDeepStrictEqual(headRootEntry.workspaces, headPkg.workspaces)) {
      return { valid: false, reason: 'package-lock.json root workspaces mismatch' };
    }

    for (const [pkgKey, baseEntry] of Object.entries(basePackages)) {
      if (pkgKey === '') continue;
      if (!(pkgKey in headPackages)) {
        return { valid: false, reason: `existing lockfile package "${pkgKey}" was removed` };
      }
      if (!isDeepStrictEqual(headPackages[pkgKey], baseEntry)) {
        return { valid: false, reason: `existing lockfile package "${pkgKey}" was modified` };
      }
    }

    const expectedNewLockEntries = new Map();
    for (const [ws, wsPkg] of validatedWorkspaces.entries()) {
      expectedNewLockEntries.set(ws, { name: wsPkg.name, version: wsPkg.version });
      expectedNewLockEntries.set(`node_modules/${wsPkg.name}`, { resolved: ws, link: true });
    }

    const addedLockKeys = Object.keys(headPackages).filter((k) => !(k in basePackages));
    if (addedLockKeys.length !== expectedNewLockEntries.size) {
      return { valid: false, reason: 'unexpected number of added lockfile package entries' };
    }

    for (const addedKey of addedLockKeys) {
      const expectedEntry = expectedNewLockEntries.get(addedKey);
      if (!expectedEntry || !isDeepStrictEqual(headPackages[addedKey], expectedEntry)) {
        return {
          valid: false,
          reason: `added lockfile entry "${addedKey}" does not match expected local workspace link`,
        };
      }
    }
  }

  return { valid: true };
}
