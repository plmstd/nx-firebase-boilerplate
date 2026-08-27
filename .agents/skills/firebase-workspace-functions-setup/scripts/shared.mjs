import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));

export const REPOSITORY_ROOT = resolve(SCRIPT_DIRECTORY, '../../../..');

/**
 * Parses long CLI options without involving a shell.
 *
 * Options may use `--name value` or `--name=value`. A standalone option is
 * treated as a boolean flag.
 *
 * @param {string[]} argv Raw CLI arguments.
 * @returns {Map<string, string | boolean>} Parsed options.
 */
export function parseOptions(argv) {
  const options = new Map();

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith('--') || argument === '--') {
      throw new Error(`Unexpected positional argument: ${argument}`);
    }

    const option = argument.slice(2);
    const separatorIndex = option.indexOf('=');
    const name =
      separatorIndex === -1 ? option : option.slice(0, separatorIndex);
    let value =
      separatorIndex === -1 ? undefined : option.slice(separatorIndex + 1);

    if (!name) {
      throw new Error('Option names must not be empty.');
    }
    if (options.has(name)) {
      throw new Error(`Option --${name} was provided more than once.`);
    }

    if (value === undefined) {
      const nextArgument = argv[index + 1];
      if (nextArgument && !nextArgument.startsWith('--')) {
        value = nextArgument;
        index += 1;
      } else {
        value = true;
      }
    }

    options.set(name, value);
  }

  return options;
}

/**
 * Rejects misspelled or unsupported CLI options.
 *
 * @param {Map<string, string | boolean>} options Parsed options.
 * @param {string[]} allowedNames Supported option names.
 */
export function assertKnownOptions(options, allowedNames) {
  const allowed = new Set(allowedNames);
  for (const name of options.keys()) {
    if (!allowed.has(name)) {
      throw new Error(`Unknown option: --${name}`);
    }
  }
}

/**
 * Reads a string option and validates whether it is required.
 *
 * @param {Map<string, string | boolean>} options Parsed options.
 * @param {string} name Option name without leading dashes.
 * @param {{ required?: boolean }} settings Validation settings.
 * @returns {string | undefined} Option value.
 */
export function getStringOption(options, name, { required = false } = {}) {
  const value = options.get(name);
  if (value === undefined) {
    if (required) {
      throw new Error(`Missing required option: --${name}`);
    }
    return undefined;
  }
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Option --${name} requires a value.`);
  }
  return value.trim();
}

/**
 * Reads a boolean CLI flag and rejects accidental values.
 *
 * @param {Map<string, string | boolean>} options Parsed options.
 * @param {string} name Flag name without leading dashes.
 * @returns {boolean} Whether the flag was provided.
 */
export function getBooleanOption(options, name) {
  const value = options.get(name);
  if (value === undefined) return false;
  if (value !== true) {
    throw new Error(`Flag --${name} does not accept a value.`);
  }
  return true;
}

/**
 * Resolves a Firebase project ID from an explicit option or `.firebaserc`.
 * This function reads only the non-secret Firebase project mapping.
 *
 * @param {string | undefined} explicitProject Explicit project ID.
 * @returns {Promise<string>} Resolved project ID.
 */
export async function resolveProjectId(explicitProject) {
  let projectId = explicitProject;

  if (!projectId) {
    const firebaseRcPath = resolve(REPOSITORY_ROOT, '.firebaserc');
    let firebaseRc;
    try {
      firebaseRc = JSON.parse(await readFile(firebaseRcPath, 'utf8'));
    } catch (error) {
      throw new Error(
        `Could not read a project ID from ${firebaseRcPath}. Pass --project explicitly. (${error.message})`,
      );
    }
    projectId = firebaseRc?.projects?.default;
  }

  if (
    typeof projectId !== 'string' ||
    !/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(projectId)
  ) {
    throw new Error(
      'The Firebase project ID is invalid. Use a 6-30 character lowercase Google Cloud project ID.',
    );
  }

  return projectId;
}

/**
 * Formats a subprocess command for human review without using a shell.
 *
 * @param {string} command Executable name.
 * @param {string[]} args Command arguments.
 * @returns {string} Display-safe command string.
 */
export function formatCommand(command, args) {
  const quote = (value) =>
    /^[a-zA-Z0-9_./:@=,-]+$/.test(value)
      ? value
      : `'${value.replaceAll("'", "'\\''")}'`;
  return [command, ...args].map(quote).join(' ');
}

/**
 * Runs a fixed executable directly and throws on failures.
 *
 * No shell is involved and callers must keep command output narrowly formatted.
 *
 * @param {string} command Executable name.
 * @param {string[]} args Command arguments.
 * @param {{ capture?: boolean, cwd?: string }} settings Execution settings.
 * @returns {string} Captured stdout, or an empty string for inherited output.
 */
export function runCommand(
  command,
  args,
  { capture = false, cwd = REPOSITORY_ROOT } = {},
) {
  console.log(`> ${formatCommand(command, args)}`);
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
  });

  if (result.error) {
    throw new Error(`Could not run ${command}: ${result.error.message}`);
  }
  if (result.status !== 0) {
    throw new Error(`${command} exited with status ${result.status}.`);
  }

  return capture ? result.stdout.trim() : '';
}

/**
 * Returns the platform-appropriate executable name for a local npm binary.
 *
 * @returns {string} `npx` or `npx.cmd`.
 */
export function getNpxCommand() {
  return process.platform === 'win32' ? 'npx.cmd' : 'npx';
}
