# nx-firebase-boilerplate

An Nx monorepo boilerplate with **Next.js**, **Firebase** (Functions, Firestore, Auth, Hosting using [@simondotm/nx-firebase](https://github.com/simondotm/nx-firebase)), shared packages, and a shared **Tailwind CSS** design system.

## What's Included

```
apps/
  web/           Next.js 16 web application
  functions/     Firebase Cloud Functions (Node 20, esbuild)
  firebase/      Firebase project config, rules, and emulator setup

packages/
  api/           API client
  backend/       Shared backend utilities
  constants/     Shared constants (URLs, config values)
  icons/         Shared project icon set
  modules/       Shared app-level UI modules
  styles/        Semantic design tokens and shared Tailwind CSS styles
  stores/        Shared Zustand stores, including Firebase Auth
  ui/            Shared UI primitives, typography, feedback, and overlays
  utils/         Shared utilities (Firebase config, helpers)
```

## Quick Start

### 1. Clone and set up

```bash
git clone https://github.com/plmstd/nx-firebase-boilerplate.git my-project
cd my-project
node setup.mjs
```

The setup script will interactively ask for:

- **npm scope** — your package namespace (e.g. `@mycompany`)
- **Firebase project ID** — from your Firebase Console
- **Display name** — your app's name
- **Firebase config** — API key, sender ID, app ID, measurement ID
- **Production API URL** — your deployed Cloud Functions URL
- **Git remote URL** — your new repository's remote

It then renames everything, installs dependencies, reinitializes git, and creates an initial commit.

### 2. Develop

```bash
# Start the Next.js dev server
npm run dev:web

# Start Firebase emulators (functions, firestore, auth, etc.)
npm run dev:functions
```

Ensure you add the `FB_ADMIN_SERVICE` environment variable to `apps/firebase/environment/.secret.local`. Refer to the instructions below to retrieve it.

### 3. Deploy

**Firebase Functions**  
Ensure you add the Firebase Admin SDK environment variable to Google Cloud Secret Manager as `FB_ADMIN_SERVICE` in the form of a flat string:

```bash
firebase functions:secrets:set FB_ADMIN_SERVICE
```

To get it, navigate to your Firebase project -> Project Settings -> Service Account -> Firebase Admin SDK -> Generate a New Private Key.  
You can easily convert the JSON into a flat string using [this tool](https://www.tinylabz.com/tool/json-to-string).

```bash
# Deploy Firebase Functions
npm run deploy:functions
```

A Next.js website can be deployed any way you like. The easiest way is using Vercel.

## Project Structure

| Path                 | Description                                         |
| -------------------- | --------------------------------------------------- |
| `apps/web`           | Next.js frontend — pages, layouts, styles           |
| `apps/functions`     | Firebase Cloud Functions — API routes, triggers     |
| `apps/firebase`      | Firebase config — rules, indexes, emulator data     |
| `packages/icons`     | Project-owned React icon components                 |
| `packages/modules`   | Shared app-level UI modules                         |
| `packages/ui`        | Shared UI primitives, forms, feedback, and overlays |
| `packages/styles`    | Semantic design tokens and global styles            |
| `packages/stores`    | Shared Zustand stores, including Firebase Auth      |
| `packages/api`       | API client for calling backend endpoints            |
| `packages/backend`   | Shared backend logic used by Cloud Functions        |
| `packages/constants` | Shared constants (API URLs, config)                 |
| `packages/utils`     | Utilities (Firebase init, `cn` helper, etc.)        |

## Available Scripts

| Script                     | Description                            |
| -------------------------- | -------------------------------------- |
| `npm run dev:web`          | Start Next.js dev server               |
| `npm run dev:functions`    | Start Firebase emulators               |
| `npm run deploy:functions` | Deploy Cloud Functions to Firebase     |
| `npx nx build web`         | Build the Next.js app                  |
| `npx nx build functions`   | Build Cloud Functions                  |
| `npx nx lint <project>`    | Lint a project                         |
| `npx nx test <project>`    | Run tests for a project                |
| `npx nx graph`             | Visualize the project dependency graph |

## Tech Stack

- **Nx** 22 — monorepo tooling, caching, task orchestration
- **Next.js** 16 — React framework with App Router
- **Firebase** — Auth, Firestore, Cloud Functions, Hosting, Storage
- **Tailwind CSS** 4 — utility-first CSS framework
- **esbuild** — fast bundling for Cloud Functions
- **Vite** — build tooling for shared packages

## Design-System Starter

The boilerplate includes a neutral design-system foundation intended to be
customized after cloning:

- semantic tokens for surfaces, content, actions, status, typography, shape,
  and elevation
- reusable typography, action, form, feedback, modal, and toast primitives
- consistent focus, disabled, loading, press, and reduced-motion behavior
- a living component gallery at `/ui-kit`

Start by changing the concrete values in
`packages/styles/src/variables.css`. Components use stable semantic roles such
as `bg-surface` and `text-error-strong`, so a cloned project can establish its
visual identity without restyling each component.

Keep domain-neutral primitives in `packages/ui` and product-aware compositions
in `packages/modules`. The full extension and override conventions are
documented in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

## Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable the services you need (Auth, Firestore, etc.)
   - Enable Email/Password sign-in if you want to use the included auth store.
3. Copy your web app config from Project Settings
4. Run `node setup.mjs` and provide the config values, or manually update:
   - `packages/utils/src/lib/firebase-config.js` — Firebase SDK config
   - `packages/constants/src/lib/urls.js` — API URLs
   - `apps/firebase/project.json` — Firebase CLI project reference
   - `.firebaserc` — Firebase project alias

The boilerplate includes `useAuthStore` in `packages/stores`. It tracks Firebase
Auth state, exposes Email/Password sign-in, sign-up, and sign-out actions, and
subscribes to the authenticated user's Firestore document at `users/{uid}`.
`apps/web/src/app/layout.jsx` mounts `AuthStateProvider` so the listener is
active for the web app. Firestore rules allow authenticated users to read and
write their own user document and deny all other documents by default.

Check out [@simondotm/nx-firebase](https://github.com/simondotm/nx-firebase) for more info on the Firebase implementation. It's an awesome package! Thanks, [simondotm](https://github.com/simondotm).

## License

MIT
