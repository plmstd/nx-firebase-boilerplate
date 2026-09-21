import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

/**
 * Read only the semantic icon entry point. New icons are requested by adding a
 * named import from ../glyphs/<family>/<Name>.js to common.jsx. No repository-
 * wide scan, network call, environment file or extra manifest is needed.
 * @param {string} root Workspace root, including after setup.mjs renames it.
 * @returns {Promise<{set: string, name: string}[]>} Unique, sorted glyph requests.
 */
export async function collectGlyphs(root) {
  const filename = path.join(root, 'packages/icons/src/icons/common.jsx');
  const code = await fs.readFile(filename, 'utf8');
  const ast = ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true);
  const icons = new Map();
  for (const node of ast.statements) {
    if (!ts.isImportDeclaration(node)) continue;
    const value = node.moduleSpecifier.text;
    if (value.startsWith('react-icons/')) {
      throw new Error('Use ../glyphs/<family>/<Name>.js instead of ' + value);
    }
    if (!value.startsWith('../glyphs/')) continue;
    const match = /^\.\.\/glyphs\/([a-z0-9]+)\/([A-Za-z_$][\w$]*)\.js$/.exec(
      value,
    );
    if (!match) throw new Error('Invalid glyph import: ' + value);
    const [, set, name] = match;
    const bindings = node.importClause?.namedBindings;
    if (
      node.importClause?.name ||
      !bindings ||
      !ts.isNamedImports(bindings) ||
      bindings.elements.length !== 1 ||
      (bindings.elements[0].propertyName || bindings.elements[0].name).text !==
        name
    ) {
      throw new Error(value + ' exports only the named icon ' + name);
    }
    icons.set(set + '/' + name, { set, name });
  }
  if (!icons.size) throw new Error('No glyph imports found in common.jsx');
  return [...icons.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, icon]) => icon);
}

/**
 * Extract selected, exported upstream functions without evaluating third-party
 * code or changing SVG data. Fail on missing names or an incompatible new format.
 * @param {string} code Installed react-icons/<set>/index.mjs text.
 * @param {string} set Icon set identifier.
 * @param {string[]} names Requested upstream function names.
 * @returns {Map<string, string>} Original function declarations keyed by name.
 */
export function extractGlyphs(code, set, names) {
  const ast = ts.createSourceFile(
    `${set}.mjs`,
    code,
    ts.ScriptTarget.Latest,
    true,
  );
  const selected = new Map();
  for (const statement of ast.statements) {
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name &&
      names.includes(statement.name.text) &&
      statement.modifiers?.some(
        (item) => item.kind === ts.SyntaxKind.ExportKeyword,
      )
    ) {
      const text = statement.getText(ast);
      if (statement.parameters.length !== 1 || !text.includes('GenIcon(')) {
        throw new Error(
          `Unsupported upstream shape for ${set}/${statement.name.text}.`,
        );
      }
      selected.set(statement.name.text, text);
    }
  }
  for (const name of names) {
    if (!selected.has(name))
      throw new Error(
        `Unknown icon ${set}/${name} in the installed react-icons version.`,
      );
  }
  return selected;
}
