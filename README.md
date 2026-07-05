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
  styles/        Shared Tailwind CSS styles
  stores/        Shared Zustand stores and store helpers
  ui/            Shared UI component library
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
| `packages/ui`        | Reusable UI components (Button, Modal, Table, etc.) |
| `packages/styles`    | Shared Tailwind CSS theme and global styles         |
| `packages/stores`    | Shared Zustand stores and store helpers             |
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

## Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable the services you need (Auth, Firestore, etc.)
3. Copy your web app config from Project Settings
4. Run `node setup.mjs` and provide the config values, or manually update:
   - `packages/utils/src/lib/firebase-config.js` — Firebase SDK config
   - `packages/constants/src/lib/urls.js` — API URLs
   - `apps/firebase/project.json` — Firebase CLI project reference
   - `.firebaserc` — Firebase project alias

Check out [@simondotm/nx-firebase](https://github.com/simondotm/nx-firebase) for more info on the Firebase implementation. It's an awesome package! Thanks, [simondotm](https://github.com/simondotm).

## License

MIT
