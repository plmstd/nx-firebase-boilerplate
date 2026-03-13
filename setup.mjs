#!/usr/bin/env node

import { readdir, readFile, writeFile, rm } from 'fs/promises';
import { join, extname } from 'path';
import { createInterface } from 'readline';
import { execSync } from 'child_process';

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

  console.log('  [3/7] Updating Firebase config...');
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
  console.log('    npm run dev:web          Start the Next.js dev server');
  console.log('    npm run dev:functions    Start Firebase emulators');
  if (gitRemote) {
    console.log(`    git push -u origin main  Push to remote`);
  }
  console.log('');
}

main().catch((err) => {
  console.error('\n  Setup failed:', err.message);
  process.exit(1);
});
