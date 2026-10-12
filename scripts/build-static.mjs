import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const template = await readFile(
  path.join(root, 'static/site-template.html'), 'utf8',
);

/** Assemble trusted local partials before serving, never in the browser. */
async function renderPage() {
  let html = template;
  const names = new Set(
    [...template.matchAll(/\{\{([a-z-]+)\}\}/g)].map(match => match[1]),
  );

  for (const name of names) {
    const partialPath = path.join(root, 'docs/partials', `${name}.html`);
    const partial = (await readFile(partialPath, 'utf8')).trim();
    if (!partial) throw new Error(`Empty partial: ${name}`);
    html = html.replaceAll(`{{${name}}}`, () => partial);
  }

  if (/\{\{.*?\}\}/.test(html)) {
    throw new Error('Unresolved template placeholder');
  }
  // Compact whitespace between closing block tags; keep source partials readable.
  return html.replace(/(<\/(?:div|article|section|nav|figure|svg|g|ul|dl|details)>)[\r\n]+[ \t]*(?=<\/)/g, '$1');
}

try {
  const originalHtml = await renderPage();
  const html = originalHtml
    .replace('<html lang="en">', '<html lang="en" class="theme-keylane">')
    .replace('<meta name="theme-color" content="#153f38">', '<meta name="theme-color" content="#274263">');
  const originalComparison = originalHtml
    .replace('</head>', '<meta name="robots" content="noindex">\n</head>')
    .replace('Built with care. Kept simple.', '<a href="index.html">Return to the selected design <span aria-hidden="true">↗</span></a>');
  for (const [name, content] of [
    ['index.html', html], ['index-modular.html', html], ['keylane.html', html],
    ['original.html', originalComparison],
  ]) {
    const output = path.join(root, 'docs', name);
    if (process.argv.includes('--check')) {
      if (await readFile(output, 'utf8') !== content) {
        throw new Error(`${name} is stale. Run npm run build:static.`);
      }
    } else {
      await writeFile(output, content, 'utf8');
    }
  }
  console.log(process.argv.includes('--check')
    ? 'Static HTML is up to date.'
    : 'Built the selected navy/orange site, compatible entry points, and original comparison.');
} catch (error) {
  console.error(`Static build failed: ${error.message}`);
  process.exitCode = 1;
}
