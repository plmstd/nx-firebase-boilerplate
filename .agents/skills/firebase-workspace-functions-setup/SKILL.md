---
name: firebase-workspace-functions-setup
description: Prepare and verify the first Firebase Functions deployment when a Google Workspace organization causes missing Cloud Build IAM grants or blocks unauthenticated HTTP invocation. Use only when explicitly requested for this optional first-deployment setup, not for routine deployments that already work.
---

# Firebase Workspace Functions Setup

Use this workflow only for a Firebase project governed by Google Workspace or
Google Cloud organization policies. Keep every change scoped to the selected
project, region, and function.

## Non-negotiable safety rules

- Never open, read, print, copy, validate, or transform secret values.
- Never inspect `.env*`, `.secret.local`, service-account key files, Secret
  Manager versions, function environment variables, or the process environment.
- Never run a command that accesses a secret version or dumps an entire Cloud
  Run or Cloud Functions configuration.
- Project IDs, project numbers, regions, function names, account IDs, and
  organization IDs are runtime inputs or CLI discoveries. Never hardcode them.
- Do not weaken or replace an organization policy. Do not grant broad roles such
  as Owner or Editor.
- Only disable the Cloud Run invoker IAM check after confirming that the target
  is intentionally a public HTTP function. Never do this for private or
  event-driven functions.

## Preconditions

1. Confirm that the user authorized the project-level IAM and service changes.
2. Work from the repository root after its normal setup script has populated
   `.firebaserc`.
3. Confirm that `gcloud`, Node.js, and the repository's Firebase CLI are
   available and already authenticated. Authentication is the user's job; do
   not inspect credential files.
4. Resolve the intended function name, region, and a harmless health path from
   non-secret project files. Ask if public accessibility is ambiguous.

Use `--help` on either script for its complete, current interface.

## Workflow

### 1. Prepare the Google Cloud project

Run:

```bash
node .agents/skills/firebase-workspace-functions-setup/scripts/prepare-project.mjs
```

Pass `--project <project-id>` when `.firebaserc` has no `projects.default`.
The script enables the required service APIs and grants only
`roles/cloudbuild.builds.builder` to the project's default Compute Engine
service account. Both operations are safe to repeat.

### 2. Run the repository's normal deployment

For this boilerplate:

```bash
npm run deploy:functions
```

Inspect the exact result. Do not ignore an arbitrary deployment failure. If the
function was created but Firebase reports only that no Artifact Registry cleanup
policy exists, continue to the next step. For any other failure, consult
`references/troubleshooting.md` and stop if the cause is outside this workflow.

### 3. Finalize the deployed function

For an intentionally public HTTP function, run:

```bash
node .agents/skills/firebase-workspace-functions-setup/scripts/finalize-function.mjs \
  --function <function-name> \
  --region <region> \
  --public-http \
  --health-path <path>
```

Omit `--public-http` and `--health-path` for a private or event-driven function;
the script then configures only Artifact Registry cleanup. Pass
`--project <project-id>` only when `.firebaserc` cannot supply it.

The finalizer sets Firebase's regional artifact cleanup policy. With explicit
`--public-http`, it also applies Cloud Run's service-specific
`--no-invoker-iam-check`. When a health path is provided, it checks both the
Cloud Run service URL and the canonical Cloud Functions URL without printing
their response bodies.

### 4. Verify idempotency

If the first deployment returned non-zero only because the cleanup policy was
missing, rerun `npm run deploy:functions` after finalization. It must now finish
successfully. Run the finalizer once more after that deployment to verify that
the public invocation setting and health checks still pass.

If the first deployment already succeeded, one finalizer run is sufficient.

## Completion report

Report:

- the selected project, project number, region, and function name;
- which service APIs were enabled;
- the exact narrow IAM role granted and its service account;
- whether artifact cleanup was configured;
- whether public HTTP invocation was explicitly enabled;
- deployment exit status and HTTP status checks.

Never include secret values, environment dumps, credential material, or HTTP
response bodies in the report.
