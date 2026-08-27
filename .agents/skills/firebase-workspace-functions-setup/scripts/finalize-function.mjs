#!/usr/bin/env node

import {
  assertKnownOptions,
  formatCommand,
  getBooleanOption,
  getNpxCommand,
  getStringOption,
  parseOptions,
  resolveProjectId,
  runCommand,
} from './shared.mjs';

const HELP = `
Finalize a deployed Firebase function for a Workspace-managed project.

Usage:
  node finalize-function.mjs --function <name> --region <region> [options]

Options:
  --project <project-id>    Override projects.default from .firebaserc.
  --function <name>         Deployed Firebase function / Cloud Run service name.
  --region <region>         Deployment region, for example europe-west1.
  --cleanup-days <days>     Artifact retention in whole days (default: 1).
  --public-http             Explicitly make an intended public HTTP function callable.
  --health-path <path>      Check both public URLs; requires --public-http.
  --expected-status <code>  Expected health response status (default: 200).
  --dry-run                 Print planned mutations without executing them.
  --help                    Show this help.
`;

const wait = (milliseconds) =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

function validateResourceName(value, label) {
  if (!/^[a-z][a-z0-9-]{0,62}$/.test(value)) {
    throw new Error(`${label} has an invalid Google Cloud resource name.`);
  }
  return value;
}

function parseIntegerOption(value, label, fallback, minimum, maximum) {
  if (value === undefined) return fallback;
  if (!/^\d+$/.test(value)) {
    throw new Error(`${label} must be a whole number.`);
  }
  const number = Number(value);
  if (number < minimum || number > maximum) {
    throw new Error(`${label} must be between ${minimum} and ${maximum}.`);
  }
  return number;
}

function normalizeHealthPath(value) {
  if (value === undefined) return undefined;
  if (!value.startsWith('/') || value.startsWith('//')) {
    throw new Error('--health-path must start with exactly one slash.');
  }
  if (/[\s?#]/.test(value)) {
    throw new Error(
      '--health-path must not contain whitespace, a query, or a fragment.',
    );
  }
  return value;
}

async function verifyStatus(url, expectedStatus) {
  let lastStatus;
  let lastError;

  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'manual',
        signal: AbortSignal.timeout(15_000),
      });
      lastStatus = response.status;
      await response.body?.cancel();
      console.log(`HTTP ${response.status} — ${url}`);
      if (response.status === expectedStatus) return;
    } catch (error) {
      lastError = error;
      console.log(`Request attempt ${attempt} failed — ${url}`);
    }

    if (attempt < 6) await wait(2_000);
  }

  const detail = lastStatus
    ? `last status was ${lastStatus}`
    : `last request error was ${lastError?.message ?? 'unknown'}`;
  throw new Error(`Health check failed for ${url}; ${detail}.`);
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  assertKnownOptions(options, [
    'project',
    'function',
    'region',
    'cleanup-days',
    'public-http',
    'health-path',
    'expected-status',
    'dry-run',
    'help',
  ]);

  if (getBooleanOption(options, 'help')) {
    console.log(HELP.trim());
    return;
  }

  const projectId = await resolveProjectId(getStringOption(options, 'project'));
  const functionName = validateResourceName(
    getStringOption(options, 'function', { required: true }),
    'Function name',
  );
  const region = validateResourceName(
    getStringOption(options, 'region', { required: true }),
    'Region',
  );
  const cleanupDays = parseIntegerOption(
    getStringOption(options, 'cleanup-days'),
    '--cleanup-days',
    1,
    1,
    3650,
  );
  const publicHttp = getBooleanOption(options, 'public-http');
  const healthPath = normalizeHealthPath(
    getStringOption(options, 'health-path'),
  );
  const expectedStatus = parseIntegerOption(
    getStringOption(options, 'expected-status'),
    '--expected-status',
    200,
    100,
    599,
  );
  const dryRun = getBooleanOption(options, 'dry-run');

  if (healthPath && !publicHttp) {
    throw new Error('--health-path requires the explicit --public-http flag.');
  }

  const npxCommand = getNpxCommand();
  const cleanupArgs = [
    '--no-install',
    'firebase',
    `--project=${projectId}`,
    'functions:artifacts:setpolicy',
    `--location=${region}`,
    `--days=${cleanupDays}`,
    '--force',
  ];
  const publicArgs = [
    'run',
    'services',
    'update',
    functionName,
    `--region=${region}`,
    `--project=${projectId}`,
    '--no-invoker-iam-check',
    '--quiet',
    '--format=none',
  ];

  console.log(`Project: ${projectId}`);
  console.log(`Function: ${functionName}`);
  console.log(`Region: ${region}`);

  if (dryRun) {
    console.log('\nDry run — no cloud changes or HTTP requests will be made.');
    console.log(`> ${formatCommand(npxCommand, cleanupArgs)}`);
    if (publicHttp) console.log(`> ${formatCommand('gcloud', publicArgs)}`);
    return;
  }

  console.log('\nConfiguring Artifact Registry cleanup...');
  runCommand(npxCommand, cleanupArgs);

  if (!publicHttp) {
    console.log('\nCleanup configured. Public invocation was not changed.');
    return;
  }

  console.log('\nEnabling public invocation for the selected HTTP service...');
  runCommand('gcloud', publicArgs);

  const serviceUrl = runCommand(
    'gcloud',
    [
      'run',
      'services',
      'describe',
      functionName,
      `--region=${region}`,
      `--project=${projectId}`,
      '--format=value(status.url)',
    ],
    { capture: true },
  );
  if (!/^https:\/\//.test(serviceUrl)) {
    throw new Error('Cloud Run did not return a valid HTTPS service URL.');
  }

  console.log('\nPublic invocation configured.');
  console.log(`Cloud Run URL: ${serviceUrl}`);

  if (!healthPath) {
    console.log('No health path supplied; HTTP status checks were skipped.');
    return;
  }

  const runHealthUrl = new URL(healthPath, `${serviceUrl}/`).toString();
  const functionsHealthUrl =
    `https://${region}-${projectId}.cloudfunctions.net/` +
    `${functionName}${healthPath}`;

  console.log('\nChecking public endpoints without reading response bodies...');
  await verifyStatus(runHealthUrl, expectedStatus);
  await verifyStatus(functionsHealthUrl, expectedStatus);
  console.log('\nFunction finalization complete.');
}

main().catch((error) => {
  console.error(`\nFinalization failed: ${error.message}`);
  process.exitCode = 1;
});
