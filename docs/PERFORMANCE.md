# Performance and memory in the starter

Checked on 21 September 2026 against `0a1dda6`. The changes preserve the
existing design, component API, Firebase features and deployment targets.
No dependency upgrades or new dependencies were needed.

## What changed

1. **UI helpers have a Firebase-free entry point.** Import `cn` from
   `@myapp/utils/cn`. The old root barrel initialized Firebase even when a
   component only needed class merging. All included UI consumers now use the
   narrow entry point; Auth/API consumers explicitly use `@myapp/utils/firebase`.
   The old root exports remain available for compatibility.
2. **Icons use only the required source modules.** The 20 semantic icons keep
   their original SVGs, renderer, props, accessibility wrapper and `IconContext`.
   `tools/icons/` generates their source from the installed React Icons version.
   The checked-in modules work in fresh clones without a generation step during
   installation or deployment. See [icon maintenance](../packages/icons/README.md).
3. **Logging no longer imports Admin services.** The sample HTTP function imports
   `@myapp/backend/logger`. Previously the shared root barrel also included
   unnecessary Firebase Admin modules. Admin helpers, secrets and logger behavior
   are unchanged; applications can still import Admin helpers when needed.

Firestore was **not removed**: `useAuthStore` uses it for the authenticated user's
realtime profile document, including document creation on signup. The provider,
subscription cleanup, Auth methods and configuration are unchanged.

## Measured results

macOS, 64 GiB RAM; Node 22.17.1, Next 16.0.11, Nx 22.3.3, React 19.2.4,
React Icons 5.7.0. Next already used Turbopack. Two fresh-cache runs per endpoint
variant; the UI-only intermediate change was measured once to separate causes.
Individual results are in [performance-2026-09-21.json](performance-2026-09-21.json).

| Measurement | Before | After | Change |
| --- | ---: | ---: | ---: |
| Next dev process-tree peak RSS, mean | 1,378 MiB | 1,142 MiB | −236 MiB / −17.1% |
| Requested development JS/CSS, both pages | 8.84 MB | 6.14 MB | −30.5% |
| Standalone `cn` probe, minified JS | 477,641 bytes | 28,603 bytes | −94.0% |
| Standalone UI library probe, minified JS | 559,459 bytes | 110,297 bytes | −80.3% |
| Functions bundle from the actual Nx build | 10,678,239 bytes | 4,074,177 bytes | −61.8% |
| Local Functions worker RSS after `/test`, mean | 110.17 MiB | 73.26 MiB | −33.5% |
| Local Functions module import, mean | 125 ms | 49.5 ms | −60.4% |

The isolated UI probe previously included 17 Firebase modules and now includes
none. This does **not** mean the complete website drops Firebase: its Auth
provider legitimately still needs Auth and Firestore. Development asset bytes
are not a production bundle size, and the Functions worker measurement excludes
Firebase CLI/emulator overhead. Real cloud cold starts and larger projects will
have different costs.

The Next comparison summed RSS for the spawned Next process and descendants
every 300 ms using `ps`. Each run had a fresh `.next`, requested `/`, `/ui-kit`
and `/api/hello`, fetched the discovered JS/CSS, paused 2 seconds, repeated the
three routes three times, then settled for 3 seconds. The browser checks were
separate, so browser memory is not included. Disk/OS caches were not globally
purged; the first baseline request includes additional initial startup costs.
Warm route timings remained in the same range (roughly 15–20 ms for the demo
and 47–55 ms for the gallery); these runs do not establish a navigation speedup.

The `cn` change alone measured 1,333 MiB Next peak RSS. The additional icon change
reduced the two final runs to 1,138/1,147 MiB. No heap-limit increase was used.

## Validation

- `npm run test:performance`: seven tests passed, including all 20 SVGs with
  multiple props/context combinations, class-merging behavior, Firebase-free UI
  and logger graphs, and retention of Auth/Firestore in the Auth store.
- Full Nx production build of `@myapp/web`, including its two dependency tasks,
  passed. Full Nx Functions build passed after the logger change.
- The built HTTP function's `/test` returned `200 Hello World` locally. Existing
  404 behavior was also checked. No cloud resources were deployed or modified.
- Demo and `/ui-kit` checked in the real browser. Gallery text and all 14 rendered
  SVGs matched exactly. Generated development CSS matched byte-for-byte.
- Form inputs, city selection, confirmation modal and success toast worked.
  HMR applied and reverted a temporary heading change while retaining all inputs.
- The template still contains placeholder Firebase web configuration. The same
  pre-existing Analytics invalid-key messages occur before and after. A real
  Firebase login, signup, profile subscription and deployment need the new
  project's configuration and must be checked after setup. No secrets were read.

For the full Nx checks, the command environment used `NX_DAEMON=false`,
`NX_CACHE_PROJECT_GRAPH=true`, `NX_TASKS_RUNNER_DYNAMIC_OUTPUT=false`, with
`--outputStyle=stream --skipNxCache --skipRemoteCache --skipSync --parallel=1 --verbose`.
The graph cache is available to executors; build results are not reused.

## Checklist when extending a cloned project

These are hypotheses to verify, not automatic instructions to rewrite an app:

1. Measure a few real routes, cold and warm, before changing code. Repeat under
   equivalent conditions and distinguish browser, compiler and emulator memory.
2. Use `@myapp/utils/cn` in UI code and `@myapp/backend/logger` for logging alone.
   Keep service initialization out of general helpers. Check transitive imports,
   not just the spelling of the direct import.
3. Add semantic icons and regenerate their individual source modules. Do not
   replace them with complete React Icons family imports in new components.
4. Before removing a Firebase SDK, check every consumer. Auth, profile listeners,
   database access and API token acquisition are distinct requirements.
5. Check heavy editors, spreadsheets, analytics, broad CSS scans and duplicate
   dev processes only when they appear in measurements. No blanket lazy loading,
   `sideEffects: false`, bundler switches or larger heap limits.
6. Run `npm run test:performance`, the actual Nx production builds, real browser
   interactions and HMR. Use a fresh checkout/build when changing package exports.
   Keep only changes with a clear benefit and preserve visual/functional behavior.

The current Tailwind sources, font assets and frontend package boundaries need
no further speculative rewrite. The starter has no large editor or data-heavy
application yet. Reassess once the cloned project develops its own workload.

Background: [Next.js development performance](https://nextjs.org/docs/app/guides/local-development),
[Firebase module bundling](https://firebase.google.com/docs/web/module-bundling).
