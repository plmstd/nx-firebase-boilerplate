import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { build } from 'esbuild';
import { cn } from '@myapp/utils/cn';

const root = fileURLToPath(new URL('../../', import.meta.url));

/** Bundle a real consumer to check its complete transitive import graph. */
async function dependencies(contents, platform = 'browser') {
  const result = await build({
    absWorkingDir: root,
    stdin: { contents, resolveDir: root, sourcefile: 'consumer.js' },
    bundle: true,
    write: false,
    metafile: true,
    platform,
    format: 'esm',
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    logLevel: 'silent',
  });
  return Object.keys(result.metafile.inputs);
}

test('the backend logger does not import the Firebase Admin SDK', async () => {
  const files = await dependencies(
    "export { logger } from '@myapp/backend/logger';",
    'node',
  );
  assert.ok(
    files.some((file) =>
      /firebase-functions\/lib\/(?:esm\/)?logger\//.test(file),
    ),
  );
  assert.deepEqual(
    files.filter((file) => file.includes('firebase-admin/')),
    [],
  );
});

test('cn and the reusable UI package do not initialize or bundle Firebase', async () => {
  for (const source of [
    "export { cn } from '@myapp/utils/cn';",
    "export * from '@myapp/ui';",
  ]) {
    const files = await dependencies(source);
    assert.ok(files.length > 0);
    assert.deepEqual(
      files.filter((file) => /(?:@firebase|firebase)[/\\]/.test(file)),
      [],
    );
  }
});

test('the auth store still includes Auth and its Firestore user-document listener', async () => {
  const files = await dependencies(
    "export { useAuthStore } from '@myapp/stores';",
  );
  assert.ok(files.some((file) => file.includes('@firebase/auth/')));
  assert.ok(files.some((file) => file.includes('@firebase/firestore/')));
});

test('the UI uses individual glyphs instead of whole react-icons families', async () => {
  const files = await dependencies("export * from '@myapp/ui';");
  assert.ok(files.some((file) => file.includes('icons/src/glyphs/')));
  assert.deepEqual(
    files.filter((file) => /react-icons\/(?!lib\/)[^/]+\//.test(file)),
    [],
  );
});

test('cn preserves conditional classes and semantic token overrides', () => {
  assert.equal(
    cn(
      'p-2 text-body rounded-control',
      false,
      { 'p-4': true },
      'text-caption rounded-surface',
    ),
    'p-4 text-caption rounded-surface',
  );
  assert.equal(
    cn('text-error-strong text-body', 'text-caption'),
    'text-error-strong text-caption',
  );
});
