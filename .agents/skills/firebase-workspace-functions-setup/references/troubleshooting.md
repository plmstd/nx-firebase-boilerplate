# Troubleshooting the first Workspace-managed deployment

Open this reference only after the normal workflow fails. Match the exact error
before changing cloud configuration. None of the checks below require secret
values.

## Scope of the automated changes

| Change                                                                   | Scope                   | Script phase                          |
| ------------------------------------------------------------------------ | ----------------------- | ------------------------------------- |
| Required Google service APIs                                             | Project                 | `prepare-project.mjs`                 |
| `roles/cloudbuild.builds.builder` on the default Compute service account | Project                 | `prepare-project.mjs`                 |
| Functions image cleanup policy                                           | Project and region      | `finalize-function.mjs`               |
| Disabled invoker IAM check                                               | One public HTTP service | `finalize-function.mjs --public-http` |

The preparation and finalization commands are idempotent. They do not modify an
organization policy and do not grant Owner or Editor.

## Cloud Build reports a permission error

Typical first deployments fail because the project's default Compute Engine
service account lacks the Cloud Build builder role. Run the preparation script,
then retry the normal deployment.

The script discovers the numeric project number with a narrowly formatted
`gcloud projects describe` call and grants only
`roles/cloudbuild.builds.builder` to:

```text
<project-number>-compute@developer.gserviceaccount.com
```

If that service account does not exist or the role grant is denied, stop. The
active user needs permission to enable services and update project IAM. Do not
substitute Owner, Editor, or an organization-wide policy change.

## Deployment created the function but exited non-zero

Firebase can finish creating the function and still return a failure because no
Artifact Registry cleanup policy exists. Continue only when the deployment
output clearly identifies cleanup policy configuration as the remaining issue.

Run the finalizer for the same region. It calls Firebase's supported
`functions:artifacts:setpolicy` command, then rerun the normal deployment. A
different build, source, quota, runtime, or permission error is not safe to
ignore.

## Public HTTP function returns 403

Google Workspace Domain Restricted Sharing can prevent an `allUsers` IAM
binding even after the function deploys. Do not relax
`constraints/iam.allowedPolicyMemberDomains` and do not repeatedly try to bind
`allUsers`.

For a function that is deliberately public, the finalizer's explicit
`--public-http` option applies this service-specific Cloud Run setting:

```text
--no-invoker-iam-check
```

This bypasses the invoker IAM check for only the selected service while leaving
the organization policy intact. If the function is private or event-driven, do
not pass `--public-http`.

## HTTP verification still fails

The finalizer retries both public URLs briefly because IAM propagation can lag.
It prints status codes only and deliberately discards response bodies.

Check these non-secret facts:

1. The project ID, function name, region, health path, and expected status are
   correct.
2. The function is an HTTP function and is intended to be publicly callable.
3. The Cloud Run service exists under the same name and region.
4. The deployed application actually exposes the selected health path.

Use only narrow output formats when diagnosing. Never dump a full service or
function description because it can include environment configuration.

## Unsupported gcloud flag

If `gcloud run services update --help` does not list
`--no-invoker-iam-check`, update the Google Cloud CLI through its normal package
manager and retry. Do not replace the command with an organization-policy
exception.

## Secret boundary

Never troubleshoot this workflow by reading environment files, listing the
process environment, accessing Secret Manager versions, printing deployed
environment variables, downloading service-account keys, or calling an HTTP
endpoint that returns sensitive data. Secret provisioning is a separate manual
workflow and is outside this skill.
