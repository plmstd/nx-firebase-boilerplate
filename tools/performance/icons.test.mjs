import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { IconContext } from 'react-icons';
import { collectGlyphs, extractGlyphs } from '../icons/source.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const upstream = path.dirname(
  createRequire(import.meta.url).resolve('react-icons'),
);

test('every generated glyph preserves the upstream SVG, props and IconContext', async () => {
  const icons = await collectGlyphs(root);
  const originals = new Map();
  for (const { set, name } of icons) {
    if (!originals.has(set)) {
      originals.set(
        set,
        await import(pathToFileURL(path.join(upstream, set, 'index.mjs'))),
      );
    }
    const original = originals.get(set)[name];
    const generated = (
      await import(
        pathToFileURL(
          path.join(root, 'packages/icons/src/glyphs', set, name + '.js'),
        )
      )
    )[name];
    assert.equal(typeof generated, 'function', name);
    for (const props of [
      {},
      { size: 19, color: '#123456', className: 'sample', 'aria-hidden': true },
      {
        size: '2em',
        title: 'Icon title',
        style: { opacity: 0.8 },
        'aria-label': 'Sample',
      },
      { size: 0, strokeWidth: 3, attr: { 'data-extra': 'kept' } },
    ]) {
      for (const context of [
        null,
        {
          size: 29,
          color: '#654321',
          className: 'context-icon',
          style: { verticalAlign: 'middle' },
          attr: { 'data-context': 'kept' },
        },
      ]) {
        const render = (Component) =>
          renderToStaticMarkup(
            context
              ? React.createElement(
                  IconContext.Provider,
                  { value: context },
                  React.createElement(Component, props),
                )
              : React.createElement(Component, props),
          );
        assert.equal(render(generated), render(original), `${set}/${name}`);
      }
    }
    assert.match(
      await fs.readFile(
        path.join(root, 'packages/icons', `LICENSE.${set}.txt`),
        'utf8',
      ),
      /Copyright/,
    );
  }
});

test('an unknown upstream icon fails with an actionable error', () => {
  assert.throws(
    () =>
      extractGlyphs(
        'export function Existing(props) { return GenIcon({})(props); }',
        'lu',
        ['Missing'],
      ),
    /Unknown icon lu\/Missing/,
  );
});
