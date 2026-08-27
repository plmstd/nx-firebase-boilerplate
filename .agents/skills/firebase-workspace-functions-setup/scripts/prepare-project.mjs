#!/usr/bin/env node

import {
  assertKnownOptions,
  formatCommand,
  getBooleanOption,
  getStringOption,
  parseOptions,
  resolveProjectId,
  runCommand,
} from './shared.mjs';

const REQUIRED_APIS = [
  'artifactregistry.googleapis.com',
  'cloudbuild.googleapis.com',
  'cloudfunctions.googleapis.com',
  'eventarc.googleapis.com',
  'firebaseextensions.googleapis.com',
  'pubsub.googleapis.com',
  'run.googleapis.com',
  'storage.googleapis.com',
];

const HELP = `
Prepare a Google Workspace-managed project for its first Firebase Functions deploy.

Usage:
  node prepare-project.mjs [--project <project-id>] [--dry-run]

Options:
  --project <project-id>  Override projects.default from .firebaserc.
  --dry-run               Print planned mutations without executing gcloud.
  --help                  Show this help.
`;

async function main() {
  const options = parseOptions(process.argv.slice(2));
  assertKnownOptions(options, ['project', 'dry-run', 'help']);

  if (getBooleanOption(options, 'help')) {
    console.log(HELP.trim());
    return;
  }

  const projectId = await resolveProjectId(getStringOption(options, 'project'));
  const dryRun = getBooleanOption(options, 'dry-run');
  const enableArgs = [
    'services',
    'enable',
    ...REQUIRED_APIS,
    `--project=${projectId}`,
    '--quiet',
  ];

  console.log(`Project: ${projectId}`);

  if (dryRun) {
    console.log('\nDry run — no cloud changes will be made.');
    console.log(`> ${formatCommand('gcloud', enableArgs)}`);
    console.log(
      `> ${formatCommand('gcloud', [
        'projects',
        'describe',
        projectId,
        '--format=value(projectNumber)',
      ])}`,
    );
    console.log(
      `> ${formatCommand('gcloud', [
        'projects',
        'add-iam-policy-binding',
        projectId,
        '--member=serviceAccount:<project-number>-compute@developer.gserviceaccount.com',
        '--role=roles/cloudbuild.builds.builder',
        '--condition=None',
        '--quiet',
        '--format=none',
      ])}`,
    );
    return;
  }

  console.log('\nEnabling required service APIs...');
  runCommand('gcloud', enableArgs);

  const projectNumber = runCommand(
    'gcloud',
    ['projects', 'describe', projectId, '--format=value(projectNumber)'],
    { capture: true },
  );
  if (!/^\d+$/.test(projectNumber)) {
    throw new Error('gcloud did not return a valid numeric project number.');
  }

  const buildServiceAccount = `${projectNumber}-compute@developer.gserviceaccount.com`;

  console.log('\nGranting the narrow Cloud Build role...');
  runCommand('gcloud', [
    'projects',
    'add-iam-policy-binding',
    projectId,
    `--member=serviceAccount:${buildServiceAccount}`,
    '--role=roles/cloudbuild.builds.builder',
    '--condition=None',
    '--quiet',
    '--format=none',
  ]);

  console.log('\nProject preparation complete.');
  console.log(`Project number: ${projectNumber}`);
  console.log(`Build service account: ${buildServiceAccount}`);
  console.log("Next: run the repository's normal Functions deployment.");
}

main().catch((error) => {
  console.error(`\nPreparation failed: ${error.message}`);
  process.exitCode = 1;
});
