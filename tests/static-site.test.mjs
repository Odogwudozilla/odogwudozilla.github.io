import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { test } from 'node:test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { caseStudies } from '../scripts/case-studies.mjs';
import './case-studies.test.mjs';
import './icons.test.mjs';
import './navigation-focus.test.mjs';
import './project-sharing.test.mjs';
import './palette-contrast.test.mjs';
import './project-disclosures.test.mjs';
import './email-copy.test.mjs';
import './responsive-images.test.mjs';
import './interactive.test.mjs';
import './investigation.test.mjs';
import './search.test.mjs';
import './lab.test.mjs';
import './compatibility.test.mjs';
import './access.test.mjs';
import './demo-help.test.mjs';

const root = fileURLToPath(new URL('../docs/', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/g)]
  .map(match => match[1]);
const enhancements = await readFile(path.join(root, 'js/scripts.js'), 'utf8');

test('Person structured data matches visible identity and public profile links', async () => {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(blocks.length, 1);
  const person = JSON.parse(blocks[0][1]);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)[1];
  assert.equal(person['@context'], 'https://schema.org');
  assert.equal(person['@type'], 'Person');
  assert.equal(person.url, canonical);
  assert.equal(person['@id'], canonical + '#person');
  assert.equal(person.name, html.match(/<h1 id="hero-title">([^<]+)<\/h1>/)[1]);
  assert.equal(person.jobTitle, html.match(/<p class="hero-role">([^<]+)<\/p>/)[1]);
  assert.deepEqual(person.sameAs, [
    'https://www.linkedin.com/in/chidoziennachor/', 'https://github.com/Odogwudozilla',
  ]);
  for (const profile of person.sameAs) assert.ok(refs.includes(profile));
  assert.deepEqual(Object.keys(person).sort(),
    ['@context', '@type', '@id', 'name', 'jobTitle', 'url', 'sameAs'].sort());
  const missing = await readFile(path.join(root, '404.html'), 'utf8');
  assert.doesNotMatch(missing, /application\/ld\+json/);
});

test('sharing metadata uses one reachable landscape JPEG with matching dimensions', async () => {
  const meta = new Map([...html.matchAll(/<meta (?:property|name)="([^"]+)" content="([^"]*)">/g)]
    .map(match => [match[1], match[2]]));
  const image = new URL(meta.get('og:image'));
  assert.equal(image.origin, new URL(meta.get('og:url')).origin);
  assert.equal(image.protocol, 'https:');
  assert.equal(meta.get('twitter:card'), 'summary_large_image');
  assert.equal(meta.get('twitter:image'), image.href);
  assert.equal(meta.get('twitter:image:alt'), meta.get('og:image:alt'));
  assert.ok(meta.get('og:image:alt').length > 30, 'Describe the image, not just the name');
  assert.equal(meta.get('og:image:type'), 'image/jpeg');
  const relative = decodeURIComponent(image.pathname).slice(1);
  const file = path.resolve(root, relative);
  assert.ok(!path.relative(root, file).startsWith('..'));
  const bytes = await readFile(file);
  assert.equal(bytes.readUInt16BE(0), 0xffd8, 'Expected a JPEG image');
  assert.ok(bytes.length < 150_000, 'Keep the preview image below 150 KB');
  let dimensions;
  for (let offset = 2; offset + 9 < bytes.length;) {
    assert.equal(bytes[offset], 0xff, 'Invalid JPEG segment');
    const marker = bytes[offset + 1];
    if ([0xc0, 0xc1, 0xc2, 0xc3].includes(marker)) {
      dimensions = [bytes.readUInt16BE(offset + 7), bytes.readUInt16BE(offset + 5)];
      break;
    }
    if (marker === 0xda || marker === 0xd9) break;
    const length = bytes.readUInt16BE(offset + 2);
    assert.ok(length >= 2, 'Invalid JPEG segment length');
    offset += length + 2;
  }
  assert.deepEqual(dimensions, [Number(meta.get('og:image:width')), Number(meta.get('og:image:height'))]);
  assert.deepEqual(dimensions, [1200, 630]);
});

test('discovery metadata advertises the canonical homepage and allows crawler access', async () => {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  assert.ok(canonical, 'Missing canonical homepage');
  const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
  const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.doesNotMatch(robots, /^Disallow:\s*\//m, 'Crawlers need access to read canonical and noindex tags');
  assert.equal(robots.match(/^Sitemap: (.+)$/m)?.[1], new URL('sitemap.xml', canonical).href);
  assert.match(sitemap, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/);
  assert.deepEqual([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]), [canonical, ...caseStudies.map(project => new URL(project.file, canonical).href)]);
  assert.doesNotMatch(sitemap, /<lastmod>|<changefreq>|<priority>/,
    'Do not invent modification dates or scheduling hints');
});

test('missing pages offer working recovery links without becoming successful responses', async () => {
  const missing = await readFile(path.join(root, '404.html'), 'utf8');
  assert.match(missing, /name="robots" content="noindex"/);
  assert.match(missing, /<h1\b/);
  for (const [, ref] of missing.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (ref.startsWith('#')) {
      assert.ok(missing.includes(`id="${ref.slice(1)}"`));
    } else if (ref.startsWith('/#')) {
      assert.ok(ids.includes(ref.slice(2)), `Broken recovery link: ${ref}`);
    } else if (ref !== '/') {
      assert.ok(ref.startsWith('/'), `Nested URLs need root-relative assets: ${ref}`);
      await access(path.join(root, ref.slice(1).split('?')[0]));
    }
  }
  const preview = spawn(process.execPath, [fileURLToPath(new URL('../scripts/serve-static.mjs', import.meta.url))], {
    env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  try {
    const address = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Preview startup timed out')), 5000);
      preview.once('error', error => { clearTimeout(timeout); reject(error); });
      preview.stdout.once('data', chunk => {
        clearTimeout(timeout);
        const url = chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
        if (url) resolve(url);
        else reject(new Error('Missing preview address'));
      });
    });
    for (const route of ['/old-page', '/old/nested/page', '/missing-image.png']) {
      const response = await fetch(address + route);
      assert.equal(response.status, 404);
      assert.equal(await response.text(), missing);
    }
    const head = await fetch(address + '/old/nested/page', { method: 'HEAD' });
    assert.equal(head.status, 404);
    assert.equal(await head.text(), '');
    assert.equal((await fetch(address + '/old-page', { method: 'POST' })).status, 405);
    assert.equal((await fetch(address + '/')).status, 200);
    for (const project of caseStudies) {
      for (const [file, type] of [[project.file, 'text/html'], ['assets/img/' + project.image, 'image/jpeg']]) {
        const response = await fetch(address + '/' + file);
        assert.equal(response.status, 200);
        assert.ok(response.headers.get('content-type').startsWith(type));
        assert.deepEqual(Buffer.from(await response.arrayBuffer()), await readFile(path.join(root, file)));
      }
    }
    for (const [, stylesheet] of html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)) {
      const response = await fetch(address + '/' + stylesheet);
      assert.equal(response.status, 200);
      assert.ok(response.headers.get('content-type').startsWith('text/css'));
      assert.equal(await response.text(), await readFile(path.join(root, stylesheet.split('?')[0]), 'utf8'));
    }
    for (const [file, type] of [['robots.txt', 'text/plain'], ['sitemap.xml', 'application/xml'], ['site.webmanifest', 'application/manifest+json']]) {
      const response = await fetch(address + '/' + file);
      assert.equal(response.status, 200);
      assert.ok(response.headers.get('content-type').startsWith(type));
      assert.equal(await response.text(), await readFile(path.join(root, file), 'utf8'));
    }
  } finally {
    preview.kill();
  }
});

test('printing reveals folded details and restores choices after print or cancellation', () => {
  const details = [{ open: false }, { open: true }, { open: false }];
  const handlers = new Map();
  runInNewContext(enhancements, {
    window: {
      location: { hash: '' },
      addEventListener: (name, callback) => handlers.set(name, callback),
    },
    document: {
      querySelector: () => null,
      getElementById: () => null,
      querySelectorAll: () => details.filter(item => !item.open),
      addEventListener: () => {},
    },
  });
  const before = handlers.get('beforeprint');
  const after = handlers.get('afterprint');
  after(); // An unmatched completion must leave reading state intact.
  before();
  assert.deepEqual(details.map(item => item.open), [true, true, true]);
  before(); // Repeated browser notifications must not replace the snapshot.
  after();
  assert.deepEqual(details.map(item => item.open), [false, true, false]);
  details[0].open = true;
  before();
  after();
  assert.deepEqual(details.map(item => item.open), [true, true, false]);
});

test('the published HTML is complete before JavaScript runs', () => {
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<main id="main"/);
  assert.match(html, /<html lang="en"(?: class="theme-keylane")?>/);
  for (const id of [
    'home', 'portfolio', 'insurance-case', 'experience', 'skills',
    'about', 'education', 'contact',
  ]) {
    assert.ok(ids.includes(id), `Missing section: ${id}`);
  }
  assert.match(html, /<h1 id="hero-title">Chidozie Nnachor<\/h1>/);
  assert.match(html, /Software engineering portfolio/);
  assert.match(html, /Fusion Almere FC/);
  assert.match(html, /HomeWizard Energy Intelligence/);
  assert.match(html, /Personal Product Watch/);
  assert.match(html, /mailto:odogwu.naija@gmail.com/);
  assert.doesNotMatch(html, /\{\{|components-loader|container"><\/div>/);
  assert.doesNotMatch(html, /onclick=|alert\(|coming soon|style="width:/i);
  assert.doesNotMatch(html, /<script[^>]+src="https?:/);
});

test('all internal anchors resolve and IDs are unique', () => {
  assert.equal(new Set(ids).size, ids.length);
  for (const ref of refs.filter(value => value.startsWith('#'))) {
    assert.ok(ids.includes(ref.slice(1)), `Broken anchor: ${ref}`);
  }
});

test('local assets exist within the public folder', async () => {
  const local = refs.filter(ref => !/^(#|https?:|mailto:)/.test(ref));
  for (const ref of local) {
    assert.ok(!ref.startsWith('//'), 'Protocol-relative URLs are not local assets');
    const target = path.resolve(root, ref.split('?')[0].replace(/^\//, ''));
    assert.ok(!path.relative(root, target).startsWith('..'));
    await access(target);
  }
});

test('experience entries retain native disclosures with descriptive summaries', () => {
  const details = [...html.matchAll(/<details class="(?:case-details|experience-details)\b[\s\S]*?<\/details>/g)];
  assert.equal(details.length, 3);
  for (const [markup] of details) {
    assert.doesNotMatch(markup.match(/<details\b[^>]*>/)?.[0] || '', /\bopen(?:\s|=|>)/,
      'Details must start folded');
    const label = markup.match(/<summary>([\s\S]+?)<\/summary>/)?.[1]
      .replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    assert.ok(label && label.length > 15, 'Disclosure needs a descriptive label');
    if (markup.includes('class="case-details')) {
      assert.ok((markup.match(/<h4>[^<]+<\/h4>/g) || []).length >= 2,
        'Project details need headings that describe the work');
    } else {
      assert.match(markup, /class="experience-details"/);
      assert.match(markup, /<ul>[\s\S]*?<li>/);
    }
  }
});

test('concise project overviews expose technology evidence once and link to their case study', () => {
  const cards = [...html.matchAll(/<article class="project-card[^\"]*"[\s\S]*?<\/article>/g)];
  assert.equal(cards.length, 4);
  for (const [card] of cards) {
    const preview = card.split('<details')[0];
    assert.match(preview, /<h3>[^<]+<\/h3>/);
    assert.match(preview, /<p>[\s\S]+?<\/p>/);
    const technologies = preview.match(/<ul class="chip-list" aria-label="[^"]+">([\s\S]*?)<\/ul>/);
    assert.ok(technologies, 'Overview needs a labelled technology list');
    assert.ok([...technologies[1].matchAll(/<li>[^<]+<\/li>/g)].length >= 4);
    assert.equal([...card.matchAll(/class="chip-list"/g)].length, 1, 'Do not duplicate technologies');
    assert.doesNotMatch(card, /<details|<figure|project-expanded/);
    assert.match(card, /class="project-case-link text-link"/);
    assert.doesNotMatch(preview, /<figure|project-code-link/);
  }
});

test('curated projects have valid anchors and public-facing access labels', async () => {
  for (const [id, label] of [['fusion-project', 'Private repository'], ['energy-project', 'Private repository'], ['product-watch-project', 'Private repository']]) {
    const card = html.match(new RegExp(`<article[^>]*id="${id}"[\\s\\S]*?</article>`))[0];
    const preview = card.split('<details')[0];
    assert.ok(preview.includes(label), `${id} access label must be visible before expansion`);
    assert.equal(card.split(label).length - 1, 1, 'Expansion must not duplicate access labels');
    assert.match(preview, /Personal project/);
  }
  const professional = html.match(/<article[^>]*id="insurance-case"[\s\S]*?<\/article>/)[0];
  assert.doesNotMatch(professional, /Private repository|Public source/, 'Do not invent company repository access');
  for (const id of ['fusion-project', 'energy-project', 'product-watch-project']) {
    assert.ok(ids.includes(id), `Missing project anchor: ${id}`);
  }
  assert.doesNotMatch(html, /href="https:\/\/github.com\/Odogwudozilla\/(homewizard|fusion-almere-fc)"/);
  assert.match(await readFile(path.join(root, 'case-personal-product-watch.html'), 'utf8'), /href="https:\/\/personal-product-watch\.odogwu-naija\.workers\.dev\/demo"/);
  assert.match(await readFile(path.join(root, 'case-fusion-almere-fc.html'), 'utf8'), /Public test site · MVP in development/);
  assert.match(await readFile(path.join(root, 'case-homewizard-energy.html'), 'utf8'), /<ol class="energy-flow"[\s\S]*?Save readings in SQLite[\s\S]*?Upload to Supabase[\s\S]*?<\/ol>/);
  assert.doesNotMatch(html, /id="portfolio"[\s\S]*?Field data, brought together/);
});

test('the legacy modular entry point renders the same complete site', async () => {
  assert.equal(await readFile(path.join(root, 'index-modular.html'), 'utf8'), html);
});

test('Keylane descriptions stay at the level of professional responsibilities', async () => {
  const keylane = html.match(/<article[^>]+id="insurance-case">([\s\S]*?)<\/article>/)?.[1];
  assert.ok(keylane, 'Missing Keylane overview');
  assert.doesNotMatch(keylane, /\bQSD-\d+|@keylane\.com|\\\\|href="https?:|\d+(?:\.\d+)?%/i);
  const detail = (await readFile(path.join(root, 'case-keylane.html'), 'utf8')).match(/<article[^>]+id="insurance-case">([\s\S]*?)<\/article>/)[1];
  assert.doesNotMatch(detail, /\bQSD-\d+|@keylane\.com|\\\\|href="https?:|\d+(?:\.\d+)?%/i);
  assert.match(detail, /requirements and acceptance criteria/);
  assert.match(detail, /Authentication, authorisation/);
  assert.match(keylane, /authorisation/);
});

test('Product Watch leads the portfolio and professional context stays public-safe', () => {
  const work = html.match(/<div class="work-grid"[^>]*>([\s\S]*?)<div class="work-colophon">/)?.[1];
  assert.ok(work);
  assert.match(work, /^\s*<article[^>]+id="product-watch-project">/);
  assert.deepEqual([...work.matchAll(/<article[^>]+id="([^"]+)"/g)].map(match => match[1]),
    caseStudies.map(project => project.id));
  assert.match(html, /Sep 2019 — Present/);
  assert.doesNotMatch(html, /engineering-decision|Engineering decisions/);
  assert.doesNotMatch(html, /keylane-portfolio-public-safe-context\.md/);
});

test('the selected palette is default and the original comparison retains shared content', async () => {
  assert.match(html, /class="theme-keylane"/);
  assert.match(html, /href="css\/keylane-theme.css\?v=[a-f0-9]{12}"/);
  assert.doesNotMatch(html, /name="robots" content="noindex"|Colour study/);
  assert.equal(await readFile(path.join(root, 'keylane.html'), 'utf8'), html);
  const alternate = await readFile(path.join(root, 'original.html'), 'utf8');
  assert.doesNotMatch(alternate, /class="theme-keylane"/);
  assert.match(alternate, /href="css\/keylane-theme.css\?v=[a-f0-9]{12}"/);
  assert.match(alternate, /name="robots" content="noindex"/);
  assert.equal(alternate.match(/<main[\s\S]*?<\/main>/)?.[0], html.match(/<main[\s\S]*?<\/main>/)?.[0]);
  const alternateIds = [...alternate.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(alternateIds).size, alternateIds.length);
  for (const [, ref] of alternate.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (ref.startsWith('#')) assert.ok(alternateIds.includes(ref.slice(1)), `Broken alternate anchor: ${ref}`);
    else if (!/^(https?:|mailto:)/.test(ref)) await access(path.join(root, ref.split('?')[0]));
  }
});

test('generated pages reference script versions derived from LF-normalized content', async () => {
  for (const name of ['index.html', 'index-modular.html', 'keylane.html', 'original.html', '404.html', ...caseStudies.map(project => project.file)]) {
    const page = await readFile(path.join(root, name), 'utf8');
    const scripts = [...page.matchAll(/<script src="(\/?js\/[^"?]+\.js)\?v=([a-f0-9]{12})"/g)];
    const homepage = ['index.html', 'index-modular.html', 'keylane.html', 'original.html'].includes(name);
    assert.deepEqual(scripts.map(([, source]) => source.replace(/^\//, '')).sort(),
      (homepage ? ['js/theme.js', 'js/scripts.js', 'js/interactive.js', 'js/investigation-model.js', 'js/investigation.js', 'js/search-model.js', 'js/search.js', 'js/lab.js', 'js/compatibility-model.js', 'js/compatibility.js', 'js/access-model.js', 'js/access.js', 'js/demo-help.js'] : ['js/theme.js', 'js/scripts.js']).sort(),
      `${name} must version each intended browser script`);
    for (const [, source, version] of scripts) {
      const bytes = await readFile(path.join(root, source.replace(/^\//, '')));
      assert.equal(version, createHash('sha256').update(bytes.toString('utf8').replaceAll('\r\n', '\n')).digest('hex').slice(0, 12));
    }
  }
});

test('every generated stylesheet URL matches its content version', async () => {
  for (const name of ['index.html', 'index-modular.html', 'keylane.html', 'original.html', '404.html', ...caseStudies.map(project => project.file)]) {
    const page = await readFile(path.join(root, name), 'utf8');
    const styles = [...page.matchAll(/<link rel="stylesheet" href="(\/?css\/[^"?]+\.css)\?v=([a-f0-9]{12})"/g)];
    assert.deepEqual(styles.map(([, source]) => source.replace(/^\//, '')).sort(),
      ['base', 'navigation', 'components', 'sections', 'portfolio', 'responsive', 'keylane-theme',
        ...(name === '404.html' ? [] : ['interactive', 'investigation', 'search', 'lab', 'compatibility', 'access'])].map(file => `css/${file}.css`).sort(),
      `${name} must version every intended stylesheet`);
    for (const [, source, version] of styles) {
      const css = await readFile(path.join(root, source.replace(/^\//, '')), 'utf8');
      assert.equal(version, createHash('sha256').update(css.replaceAll('\r\n', '\n')).digest('hex').slice(0, 12));
      assert.equal(source.startsWith('/'), name === '404.html', 'Preserve nested recovery-page asset paths');
    }
  }
});
