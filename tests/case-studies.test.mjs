import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { test } from 'node:test';
import { caseStudies } from '../scripts/case-studies.mjs';

const root = new URL('../docs/', import.meta.url);
const homepage = await readFile(new URL('index.html', root), 'utf8');
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
const narratives = await readFile(new URL('partials/project-case-studies.html', root), 'utf8');

test('retired project mentions and its case page are absent from public artifacts', async () => {
  const files = await readdir(root, { recursive: true });
  for (const file of files) {
    assert.doesNotMatch(file, /advent|aoc-project/i);
    if (/\.(html|md|js|css|svg|xml|json|webmanifest)$/i.test(file)) {
      assert.doesNotMatch(await readFile(new URL(file.replaceAll('\\', '/'), root), 'utf8'),
        /Advent of Code|adventOfCode|aoc-project|Java puzzles|Java puzzle tools/i, file);
    }
  }
  assert.equal(caseStudies[0].id, 'product-watch-project');
});

test('project enquiries address the public contact with an encoded project-specific subject', async () => {
  const recipient = homepage.match(/class="email-address" href="mailto:([^"]+)"/)[1];
  const subjects = new Set();
  for (const project of caseStudies) {
    const html = await readFile(new URL(project.file, root), 'utf8');
    const href = html.match(/href="([^"]+)">Discuss this project by email<\/a>/)?.[1];
    assert.ok(href, `${project.file} needs a native email link`);
    assert.doesNotMatch(href, /[\s\r\n]/);
    const url = new URL(href);
    assert.equal(url.protocol, 'mailto:');
    assert.equal(url.pathname, recipient);
    assert.deepEqual([...url.searchParams.keys()], ['subject']);
    assert.equal(url.searchParams.get('subject'), `Portfolio enquiry: ${project.lines[0]}`);
    subjects.add(url.searchParams.get('subject'));
  }
  assert.equal(subjects.size, 4);
});

test('case-study navigation follows portfolio order and stops at the first and last project', async () => {
  for (const [index, project] of caseStudies.entries()) {
    const html = await readFile(new URL(project.file, root), 'utf8');
    const navigation = html.match(/<nav aria-label="More case studies"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(navigation, `${project.file} needs labelled project navigation`);
    const links = [...navigation.matchAll(/href="([^"]+)" rel="(prev|next)"[^>]*><span>([^<]+)<\/span><strong>([^<]+)<\/strong>/g)];
    const expected = [
      ...(index > 0 ? [[caseStudies[index - 1].file, 'prev', '← Previous project', caseStudies[index - 1].lines[0]]] : []),
      ...(index < caseStudies.length - 1 ? [[caseStudies[index + 1].file, 'next', 'Next project →', caseStudies[index + 1].lines[0]]] : []),
    ];
    assert.deepEqual(links.map(match => match.slice(1)), expected);
    assert.ok(links.every(match => match[1] !== project.file), 'Never link back to the current case');
  }
});

test('four case-study pages have unique canonical identities and sharing previews', async () => {
  assert.equal(caseStudies.length, 4);
  const images = new Set();
  for (const project of caseStudies) {
    const html = await readFile(new URL(project.file, root), 'utf8');
    const canonical = `https://odogwudozilla.com/${project.file}`;
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}">`));
    assert.ok(html.includes(`<meta property="og:url" content="${canonical}">`));
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    const heading = html.match(/<h1>([^<]+)<\/h1>/)[1];
    assert.ok(title.startsWith(heading));
    assert.ok(html.includes(`<meta property="og:title" content="${title}">`));
    const image = html.match(/property="og:image" content="([^"]+)"/)[1];
    assert.ok(html.includes(`<meta name="twitter:image" content="${image}">`));
    const bytes = await readFile(new URL(new URL(image).pathname.slice(1), root));
    assert.equal(bytes.readUInt16BE(0), 0xffd8);
    assert.ok(bytes.length < 150_000);
    images.add(image);
    assert.doesNotMatch(html, /name="robots" content="noindex"/);
  }
  assert.equal(images.size, 4);
});

test('case studies retain reviewed content and expose it without JavaScript or disclosures', async () => {
  for (const project of caseStudies) {
    const html = await readFile(new URL(project.file, root), 'utf8');
    const source = narratives.match(new RegExp(`<article[^>]*id="${project.id}"[\\s\\S]*?</article>`))[0];
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.doesNotMatch(html, /<details|project-share|copy-project-link|<h[34]\b/);
    for (const [, heading] of source.matchAll(/<h4>([^<]+)<\/h4>/g)) assert.ok(html.includes(`<h2>${heading}</h2>`));
    assert.ok(html.includes(`href="/#${project.id}"`));
    const normalized = html.replace(/\s+/g, ' ');
    for (const [, paragraph] of source.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
      assert.ok(normalized.includes(paragraph.replace(/\s+/g, ' ').replaceAll('href="#', 'href="/#')), 'Retain the full narrative, not just its headings');
    }
    assert.ok(homepage.includes(`href="${project.file}" aria-label="Read case study: `));
  }
});

test('case-study asset paths and return links resolve and all IDs are unique', async () => {
  const homeIds = new Set([...homepage.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
  for (const project of caseStudies) {
    const html = await readFile(new URL(project.file, root), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
    assert.equal(html.match(/class="case-breadcrumb"><a class="text-link" href="([^"]+)"/)?.[1], `/#${project.id}`);
    for (const [, ref] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (ref.startsWith('/#')) assert.ok(homeIds.has(ref.slice(2)));
      else if (ref.startsWith('#')) assert.ok(ids.includes(ref.slice(1)));
      else if (!/^(https?:|mailto:)/.test(ref)) await access(new URL(ref.replace(/^\//, ''), root));
    }
  }
});
