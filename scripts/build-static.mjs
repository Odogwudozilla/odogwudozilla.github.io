import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));

/** Assemble trusted local partials before serving, never in the browser. */
async function renderPage(templateName = 'site-template.html') {
  const template = await readFile(path.join(root, 'static', templateName), 'utf8');
  let html = template;
  const names = new Set(
    [...template.matchAll(/\{\{([a-z-]+)\}\}/g)].map(match => match[1]),
  );

  for (const name of names) {
    const partialPath = path.join(root, 'docs/partials', `${name}.html`);
    let partial = (await readFile(partialPath, 'utf8')).trim();
    if (templateName === 'not-found-template.html' && name === 'navigation') {
      partial = partial.replaceAll('href="#', 'href="/#');
    }
    if (!partial) throw new Error(`Empty partial: ${name}`);
    html = html.replaceAll(`{{${name}}}`, () => partial);
  }

  if (/\{\{.*?\}\}/.test(html)) {
    throw new Error('Unresolved template placeholder');
  }
  // A changed script must not reuse a previous deployment's browser-cache URL.
  for (const [, source] of [...html.matchAll(/\bsrc="(\/?js\/[^"?]+\.js)"/g)]) {
    const bytes = await readFile(path.join(root, 'docs', source.replace(/^\//, '')));
    // Git publishes LF; Windows checkouts can use CRLF for the same script.
    const version = createHash('sha256').update(bytes.toString('utf8').replaceAll('\r\n', '\n')).digest('hex').slice(0, 12);
    html = html.replaceAll(`src="${source}"`, `src="${source}?v=${version}"`);
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
    .replace('<p>Software engineering portfolio</p>', '<p><a href="index.html">Return to the default palette</a></p>');
  const notFoundHtml = (await renderPage('not-found-template.html'))
    .replace('<html lang="en">', '<html lang="en" class="theme-keylane">');
  // Keep discovery metadata aligned with the homepage's existing canonical URL.
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (!canonical) throw new Error('Missing canonical homepage URL');
  const homepage = new URL(canonical);
  if (homepage.protocol !== 'https:' || homepage.pathname !== '/'
    || homepage.search || homepage.hash || homepage.username || homepage.password) {
    throw new Error('Discovery metadata requires a canonical HTTPS homepage');
  }
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', homepage).href}\n`;
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${homepage.href}</loc>\n  </url>\n</urlset>\n`;
  for (const [name, content] of [
    ['index.html', html], ['index-modular.html', html], ['keylane.html', html],
    ['original.html', originalComparison],
    ['404.html', notFoundHtml],
    ['robots.txt', robots], ['sitemap.xml', sitemap],
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
    ? 'Static HTML and discovery metadata are up to date.'
    : 'Built the site, compatible entry points, comparison, and discovery metadata.');
} catch (error) {
  console.error(`Static build failed: ${error.message}`);
  process.exitCode = 1;
}
