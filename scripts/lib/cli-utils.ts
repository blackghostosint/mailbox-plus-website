import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseArgs, type ParseArgsConfig } from 'node:util';

/**
 * Safely determines whether a module is the main entrypoint executed directly from the command line.
 * Handles file:// URLs, plain paths, CJS/ESM contexts, and tsx/wrapper paths.
 */
export function isMainModule(
  importMetaUrlOrFilename: string | { url?: string } | undefined | null,
  processArgv1: string | undefined = process.argv[1]
): boolean {
  if (!importMetaUrlOrFilename || !processArgv1) {
    return false;
  }

  let rawModulePath =
    typeof importMetaUrlOrFilename === 'object'
      ? importMetaUrlOrFilename.url || ''
      : importMetaUrlOrFilename;

  if (typeof rawModulePath !== 'string' || !rawModulePath) {
    return false;
  }

  if (rawModulePath.startsWith('file://')) {
    try {
      rawModulePath = fileURLToPath(rawModulePath);
    } catch {
      rawModulePath = rawModulePath.replace(/^file:\/\//, '');
    }
  }

  let argv1Path = processArgv1;
  if (argv1Path.startsWith('file://')) {
    try {
      argv1Path = fileURLToPath(argv1Path);
    } catch {
      argv1Path = argv1Path.replace(/^file:\/\//, '');
    }
  }

  const resolvedModule = path.resolve(rawModulePath);
  const resolvedArgv1 = path.resolve(argv1Path);

  if (resolvedModule === resolvedArgv1) {
    return true;
  }

  // Check if processArgv1 is a tsx/ts-node runner wrapper where process.argv[2] is the target script
  if ((resolvedArgv1.includes('tsx') || resolvedArgv1.includes('ts-node')) && process.argv[2]) {
    let argv2Path = process.argv[2];
    if (argv2Path.startsWith('file://')) {
      try {
        argv2Path = fileURLToPath(argv2Path);
      } catch {
        argv2Path = argv2Path.replace(/^file:\/\//, '');
      }
    }
    if (resolvedModule === path.resolve(argv2Path)) {
      return true;
    }
  }

  return false;
}

export interface ParseScriptArgsConfig extends Partial<ParseArgsConfig> {
  args?: string[];
  options?: ParseArgsConfig['options'];
  allowPositionals?: boolean;
  strict?: boolean;
  errorPrefix?: string;
  autoExit?: boolean;
}

/**
 * Standard helper wrapping Node.js native util.parseArgs for CLI scripts.
 * Supports boolean flags, string options, default values, and positional arguments.
 */
export function parseScriptArgs<T extends ParseScriptArgsConfig>(
  config: T = {} as T,
  argv: string[] = process.argv
): {
  values: Record<string, any>;
  positionals: string[];
} {
  let rawArgs = config.args;
  if (!rawArgs) {
    if (argv === process.argv) {
      rawArgs = process.argv.slice(2);
    } else if (Array.isArray(argv)) {
      if (
        argv.length >= 2 &&
        (argv[0].endsWith('node') ||
          argv[0].endsWith('node.exe') ||
          argv[0].endsWith('tsx') ||
          argv[0].endsWith('tsx.cmd') ||
          argv[0].includes('node_modules'))
      ) {
        rawArgs = argv.slice(2);
      } else {
        rawArgs = argv;
      }
    } else {
      rawArgs = [];
    }
  }

  const parseConfig: ParseArgsConfig = {
    args: rawArgs,
    options: config.options,
    allowPositionals: config.allowPositionals ?? true,
    strict: config.strict ?? false,
  };

  try {
    const parsed = parseArgs(parseConfig);
    return {
      values: parsed.values || {},
      positionals: parsed.positionals || [],
    };
  } catch (err: any) {
    const prefix = config.errorPrefix ? `${config.errorPrefix}: ` : 'CLI Error: ';
    console.error(`${prefix}${err.message}`);
    if (config.autoExit !== false) {
      process.exit(1);
    }
    throw err;
  }
}
