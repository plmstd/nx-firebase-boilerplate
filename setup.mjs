#!/usr/bin/env node

import { readdir, readFile, writeFile, rm } from 'fs/promises';
import { join, extname } from 'path';
import { createInterface } from 'readline';
import { execSync } from 'child_process';
import { randomInt } from 'crypto';
import { createServer } from 'net';

const ROOT = new URL('.', import.meta.url).pathname.replace(/\/$/, '');

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  '.nx',
  '.emulators',
  '.cache',
  '.firebase',
]);

const FILE_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.mts',
  '.cts',
  '.mjs',
  '.cjs',
  '.json',
  '.md',
  '.css',
  '.html',
  '.rules',
]);

const CURRENT = {
  scope: '@myapp',
  firebaseProjectId: 'my-firebase-project',
  displayName: 'My App',
};

const LOCAL_PORT_MIN = 20000;
const LOCAL_PORT_MAX = 39999;
const FIREBASE_EMULATOR_NAMES = [
  'auth',
  'functions',
  'firestore',
  'database',
  'hosting',
  'pubsub',
  'storage',
  'eventarc',
  'ui',
  'hub',
  'logging',
];

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (question) =>
  new Promise((resolve) => rl.question(question, resolve));

async function walkFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    if (entry.name === 'setup.mjs') continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(full)));
    } else if (FILE_EXTENSIONS.has(extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

async function replaceInFiles(files, replacements) {
  let changed = 0;
  for (const file of files) {
    let content = await readFile(file, 'utf-8');
    const original = content;
    for (const [from, to] of replacements) {
      content = content.replaceAll(from, to);
    }
    if (content !== original) {
      await writeFile(file, content, 'utf-8');
      changed++;
    }
  }
  return changed;
}

function validateScope(scope) {
  if (!scope.startsWith('@')) return 'Scope must start with @';
  if (scope.includes(' ')) return 'Scope must not contain spaces';
  if (!/^@[a-z0-9-]+$/.test(scope))
    return 'Scope must be lowercase alphanumeric with hyphens only';
  return null;
}

function validateProjectId(id) {
  if (!id) return 'Firebase project ID is required';
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id))
    return 'Project ID must be lowercase alphanumeric with hyphens, starting with a letter or number';
  return null;
}

function isPortAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.unref();
    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        resolve(false);
        return;
      }

      // Some restricted shells prohibit local listeners altogether. The
      // generated high port is still valid, but cannot be probed there.
      if (error.code === 'EACCES' || error.code === 'EPERM') {
        resolve(true);
        return;
      }

      reject(error);
    });
    server.listen({ port, host: '127.0.0.1', exclusive: true }, () =>
      server.close(() => resolve(true)),
    );
  });
}

async function allocateAvailablePort(allocatedPorts) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const port = randomInt(LOCAL_PORT_MIN, LOCAL_PORT_MAX + 1);
    if (allocatedPorts.has(port)) continue;
    if (!(await isPortAvailable(port))) continue;

    allocatedPorts.add(port);
    return port;
  }

  throw new Error(
    `Could not find an available local port between ${LOCAL_PORT_MIN} and ${LOCAL_PORT_MAX}`,
  );
}

async function createLocalDevelopmentConfig() {
  const allocatedPorts = new Set();
  const webPort = await allocateAvailablePort(allocatedPorts);
  const firebaseEmulatorPorts = {};

  for (const emulatorName of FIREBASE_EMULATOR_NAMES) {
    firebaseEmulatorPorts[emulatorName] =
      await allocateAvailablePort(allocatedPorts);
  }

  return { webPort, firebaseEmulatorPorts };
}

async function main() {
  console.log('');
  console.log('  Nx + Firebase Boilerplate Setup');
  console.log('  ===============================');
  console.log('');

  // --- Gather inputs ---

  let scope;
  while (true) {
    scope = (await ask('  npm scope (e.g. @mycompany): ')).trim();
    const err = validateScope(scope);
    if (!err) break;
    console.log(`  -> ${err}\n`);
  }

  let firebaseProjectId;
  while (true) {
    firebaseProjectId = (
      await ask('  Firebase project ID (e.g. my-cool-app): ')
    ).trim();
    const err = validateProjectId(firebaseProjectId);
    if (!err) break;
    console.log(`  -> ${err}\n`);
  }

  const displayName = (
    await ask('  Display name (e.g. My Cool App): ')
  ).trim();
  if (!displayName) {
    console.log('  -> Using default: My App');
  }
  const finalDisplayName = displayName || 'My App';

  console.log('');
  console.log('  Firebase config (from Firebase Console > Project Settings):');
  console.log('  Leave fields empty to fill in later.\n');

  const apiKey = (await ask('    API key: ')).trim();
  const messagingSenderId = (await ask('    Messaging sender ID: ')).trim();
  const appId = (await ask('    App ID: ')).trim();
  const measurementId = (await ask('    Measurement ID (optional): ')).trim();

  console.log('');
  const productionApiUrl = (
    await ask(
      '  Production API URL (leave empty to configure later): '
    )
  ).trim();

  const gitRemote = (
    await ask('  Git remote URL (leave empty to skip): ')
  ).trim();

  rl.close();

  const localDevelopment = await createLocalDevelopmentConfig();

  // --- Confirm ---

  console.log('');
  console.log('  Configuration:');
  console.log(`    Scope:              ${scope}`);
  console.log(`    Firebase project:   ${firebaseProjectId}`);
  console.log(`    Display name:       ${finalDisplayName}`);
  console.log(`    API key:            ${apiKey || '(skip)'}`);
  console.log(`    Sender ID:          ${messagingSenderId || '(skip)'}`);
  console.log(`    App ID:             ${appId || '(skip)'}`);
  console.log(`    Measurement ID:     ${measurementId || '(skip)'}`);
  console.log(`    Production API URL: ${productionApiUrl || '(skip)'}`);
  console.log(`    Git remote:         ${gitRemote || '(skip)'}`);
  console.log(`    Web port:           ${localDevelopment.webPort}`);
  console.log(
    `    Functions port:     ${localDevelopment.firebaseEmulatorPorts.functions}`,
  );
  console.log('');

  // --- Execute ---

  console.log('  [1/7] Scanning files...');
  const files = await walkFiles(ROOT);
  console.log(`         Found ${files.length} files.\n`);

  console.log('  [2/7] Replacing identifiers...');
  const replacements = [
    [CURRENT.scope, scope],
    [CURRENT.firebaseProjectId, firebaseProjectId],
    [CURRENT.displayName, finalDisplayName],
  ];

  const changed = await replaceInFiles(files, replacements);
  console.log(`         Updated ${changed} files.\n`);
  const workspacePackages = [];
  for (const file of files) {
    if (!file.endsWith('/package.json')) continue;
    try {
      const pkg = JSON.parse(await readFile(file, 'utf-8'));
      if (pkg.name?.startsWith(`${scope}/`)) {
        workspacePackages.push(pkg.name);
      }
    } catch {
      // Ignore malformed package files; setup should continue replacing text.
    }
  }
  console.log(
    `         Renamed workspace packages: ${workspacePackages.sort().join(', ')}\n`
  );

  console.log('  [3/7] Updating Firebase and local development config...');
  const configPath = join(
    ROOT,
    'packages/utils/src/lib/firebase-config.js'
  );
  let configContent = await readFile(configPath, 'utf-8');

  if (apiKey) {
    configContent = configContent.replace(
      /apiKey:\s*'[^']*'/,
      `apiKey: '${apiKey}'`
    );
  }
  if (messagingSenderId) {
    configContent = configContent.replace(
      /messagingSenderId:\s*'[^']*'/,
      `messagingSenderId: '${messagingSenderId}'`
    );
  }
  if (appId) {
    configContent = configContent.replace(
      /appId:\s*'[^']*'/,
      `appId: '${appId}'`
    );
  }
  if (measurementId) {
    configContent = configContent.replace(
      /measurementId:\s*'[^']*'/,
      `measurementId: '${measurementId}'`
    );
  }
  await writeFile(configPath, configContent, 'utf-8');

  if (productionApiUrl) {
    const urlsPath = join(
      ROOT,
      'packages/constants/src/lib/urls.js'
    );
    let urlsContent = await readFile(urlsPath, 'utf-8');
    urlsContent = urlsContent.replace(
      /API_URL\s*=\s*'[^']*'/,
      `API_URL = '${productionApiUrl}'`
    );
    await writeFile(urlsPath, urlsContent, 'utf-8');
  }

  const firebaseRc = {
    projects: { default: firebaseProjectId },
    targets: {},
  };
  await writeFile(
    join(ROOT, '.firebaserc'),
    JSON.stringify(firebaseRc, null, 2) + '\n',
    'utf-8'
  );

  await writeFile(
    join(ROOT, 'local-development.json'),
    JSON.stringify(localDevelopment, null, 2) + '\n',
    'utf-8',
  );

  const firebaseConfigPath = join(ROOT, 'firebase.json');
  const firebaseConfig = JSON.parse(
    await readFile(firebaseConfigPath, 'utf-8'),
  );
  for (const [emulatorName, port] of Object.entries(
    localDevelopment.firebaseEmulatorPorts,
  )) {
    firebaseConfig.emulators[emulatorName] = {
      ...firebaseConfig.emulators[emulatorName],
      port,
    };
  }
  await writeFile(
    firebaseConfigPath,
    JSON.stringify(firebaseConfig, null, 2) + '\n',
    'utf-8',
  );

  const rootPackagePath = join(ROOT, 'package.json');
  const rootPackage = JSON.parse(await readFile(rootPackagePath, 'utf-8'));
  rootPackage.scripts['dev:web'] =
    `nx dev web --port=${localDevelopment.webPort}`;
  await writeFile(
    rootPackagePath,
    JSON.stringify(rootPackage, null, 2) + '\n',
    'utf-8',
  );

  const firebaseProjectPath = join(ROOT, 'apps/firebase/project.json');
  const firebaseProject = JSON.parse(
    await readFile(firebaseProjectPath, 'utf-8'),
  );
  const emulatorPorts = Object.values(localDevelopment.firebaseEmulatorPorts);
  firebaseProject.targets.killports.options.command = `kill-port --port ${emulatorPorts.join(',')}`;
  await writeFile(
    firebaseProjectPath,
    JSON.stringify(firebaseProject, null, 2) + '\n',
    'utf-8',
  );

  const urlsPath = join(ROOT, 'packages/constants/src/lib/urls.js');
  let urlsContent = await readFile(urlsPath, 'utf-8');
  const developmentApiPattern =
    /export const API_URL_DEV\s*=\s*(?:\r?\n\s*)?'[^']*';/;
  if (!developmentApiPattern.test(urlsContent)) {
    throw new Error(`Could not update API_URL_DEV in ${urlsPath}`);
  }
  urlsContent = urlsContent.replace(
    developmentApiPattern,
    `export const API_URL_DEV =\n  'http://127.0.0.1:${localDevelopment.firebaseEmulatorPorts.functions}/${firebaseProjectId}/europe-west1/api';`,
  );
  await writeFile(urlsPath, urlsContent, 'utf-8');
  console.log('         Done.\n');

  console.log('  [4/7] Cleaning build artifacts...');
  const cleanPaths = [
    'apps/web/.next',
    'apps/functions/dist',
    'apps/firebase/.emulators',
    '.nx',
  ];
  for (const p of cleanPaths) {
    await rm(join(ROOT, p), { recursive: true, force: true });
  }
  console.log('         Done.\n');

  console.log('  [5/7] Resetting git...');
  await rm(join(ROOT, '.git'), { recursive: true, force: true });
  execSync('git init', { cwd: ROOT, stdio: 'pipe' });
  if (gitRemote) {
    execSync(`git remote add origin ${gitRemote}`, {
      cwd: ROOT,
      stdio: 'pipe',
    });
  }
  console.log('         Done.\n');

  console.log('  [6/7] Installing dependencies...');
  await rm(join(ROOT, 'package-lock.json'), { force: true });
  execSync('npm install', { cwd: ROOT, stdio: 'inherit' });
  console.log('');

  console.log('  [7/7] Creating initial commit...');
  await rm(join(ROOT, 'setup.mjs'), { force: true });
  execSync('git add -A', { cwd: ROOT, stdio: 'pipe' });
  execSync(`git commit -m "Initial commit: ${finalDisplayName}"`, {
    cwd: ROOT,
    stdio: 'pipe',
  });
  console.log('         Done.\n');

  console.log('  ===============================');
  console.log(`  "${finalDisplayName}" is ready!`);
  console.log('  ===============================\n');
  console.log('  Next steps:\n');
  console.log(
    `    npm run dev:web          Start Next.js at http://localhost:${localDevelopment.webPort}`,
  );
  console.log(
    `    npm run dev:functions    Start Firebase emulators (Functions: ${localDevelopment.firebaseEmulatorPorts.functions})`,
  );
  console.log('    local-development.json   View all assigned local ports');
  if (gitRemote) {
    console.log(`    git push -u origin main  Push to remote`);
  }
  console.log('');
}

main().catch((err) => {
  console.error('\n  Setup failed:', err.message);
  process.exit(1);
});
